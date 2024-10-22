package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/google/uuid"   // Import the uuid package for generating UUIDs
	"github.com/joho/godotenv" // Import the godotenv package
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Todo represents a todo item with UUID and text
type Todo struct {
	ID   string `bson:"_id,omitempty"` // Use omitempty to ignore empty ID fields
	Text string `bson:"text"`
}

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
	log.Printf("MongoDB URI: %s\n", uri) // Log the URI for debugging

	clientOptions := options.Client().ApplyURI(uri)

	var err error
	Client, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	// Set the collection
	TodoCollection = Client.Database(os.Getenv("MONGO_DB")).Collection("todo") // Ensure the collection name is correct

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
func InsertTodo(text string) (*Todo, error) {
	id := uuid.New().String()        // Generate a new UUID for the todo
	todo := Todo{ID: id, Text: text} // Create a new todo instance

	_, err := TodoCollection.InsertOne(context.Background(), todo)
	if err != nil {
		return nil, fmt.Errorf("failed to insert todo: %w", err)
	}

	log.Printf("Inserted todo: %+v\n", todo)
	return &todo, nil
}
