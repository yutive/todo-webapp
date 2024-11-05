package database

import (
	"context"
	"fmt"
	"github.com/yutive/todo-crud-api/models"
	"go.mongodb.org/mongo-driver/bson"
	"log"
	"os"
	"time"

	"github.com/google/uuid"   // Import the uuid package for generating UUIDs
	"github.com/joho/godotenv" // Import the godotenv package
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Client         *mongo.Client
	TodoCollection *mongo.Collection
)

// LoadEnv loads environment variables from the .env file
func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("Error loading .env file; using environment variables directly")
	}
}

// CreateMongoURI constructs the MongoDB URI from environment variables
func CreateMongoURI() string {
	user := os.Getenv("MONGO_USER")
	password := os.Getenv("MONGO_PASSWORD")
	host := os.Getenv("MONGO_HOST")
	port := os.Getenv("MONGO_PORT")
	dbName := os.Getenv("MONGO_DB")

	return fmt.Sprintf("mongodb://%s:%s@%s:%s/%s?authSource=admin", user, password, host, port, dbName)
}

// ConnectDB initializes the MongoDB connection
func ConnectDB() error {
	LoadEnv() // Load environment variables

	uri := CreateMongoURI()

	clientOptions := options.Client().ApplyURI(uri)

	var err error
	Client, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	// Set the collection
	TodoCollection = Client.Database(os.Getenv("MONGO_DB")).Collection("todo")

	// Ping the database to check the connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := Client.Ping(ctx, nil); err != nil {
		return fmt.Errorf("failed to ping MongoDB: %w", err)
	}
	log.Println("Connected to MongoDB!")
	return nil
}

// InsertTodo inserts a new todo item into the collection
func InsertTodo(text string) (*models.Todo, error) {
	id := uuid.New().String()               // Generate a new UUID for the todo
	todo := models.Todo{ID: id, Text: text} // Create a new todo instance

	_, err := TodoCollection.InsertOne(context.Background(), todo)
	if err != nil {
		return nil, fmt.Errorf("failed to insert todo: %w", err)
	}

	log.Printf("Inserted todo: %+v\n", todo)
	return &todo, nil
}

// GetTodos retrieves all todo items from the collection
func GetTodos() ([]*models.Todo, error) {
	var todos []*models.Todo

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := TodoCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve todos: %w", err)
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var todo models.Todo
		if err := cursor.Decode(&todo); err != nil {
			return nil, fmt.Errorf("failed to decode todo: %w", err)
		}
		todos = append(todos, &todo)
	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor error: %w", err)
	}

	log.Printf("Retrieved %d todos\n", len(todos))
	return todos, nil
}

// GetTodoByID retrieves a todo item by its ID
func GetTodoByID(id string) (*models.Todo, error) {
	var todo models.Todo

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := TodoCollection.FindOne(ctx, bson.M{"id": id}).Decode(&todo)
	if err != nil {
		return nil, fmt.Errorf("failed to find todo: %w", err)
	}

	return &todo, nil
}

// UpdateTodo updates an existing todo item
func UpdateTodo(id string, updatedTodo models.Todo) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := TodoCollection.UpdateOne(ctx, bson.M{"id": id}, bson.M{"$set": updatedTodo})
	if err != nil {
		return fmt.Errorf("failed to update todo: %w", err)
	}

	log.Printf("Updated todo with ID: %s\n", id)
	return nil
}

// DeleteTodo deletes a todo item by its ID
func DeleteTodo(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := TodoCollection.DeleteOne(ctx, bson.M{"id": id})
	if err != nil {
		return fmt.Errorf("failed to delete todo: %w", err)
	}

	log.Printf("Deleted todo with ID: %s\n", id)
	return nil
}
