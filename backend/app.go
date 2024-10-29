package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yutive/todo-crud-api/controllers"
	"github.com/yutive/todo-crud-api/database"
)

func main() {
	fmt.Println("Starting Todo CRUD API with MongoDB")

	if err := database.ConnectDB(); err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}

	r := gin.Default()

	// CORS-Middleware
	r.Use(cors.Default())

	//Home Handler
	r.GET("/", controllers.HomeHandler)

	// Versioning of API
	v1 := r.Group("/api/v1")
	{
		v1.GET("7", controllers.HomeHandler)
		//Get Todos
		v1.GET("/todos", controllers.GetTodos)
		// Get Todo by ID
		v1.GET("/todo/:id", controllers.GetTodoById)
		//Post Todo
		v1.POST("/create", controllers.CreateTodo)
		// Update Todo
		v1.PUT("/update/:id", controllers.UpdateTodo)
		// Delete Todo
		v1.DELETE("/delete/:id", controllers.DeleteTodo)
	}

	// Handle error response when a route is not defined
	r.NoRoute(func(c *gin.Context) {
		// return json if route is not defined
		c.JSON(404, gin.H{"message": "Not found"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
