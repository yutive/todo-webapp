package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/yutive/todo-crud-api/database"
	"github.com/yutive/todo-crud-api/models"
	"net/http"
)

func HomeHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "todos crud api"})
}

// GetTodos retrieves all todos from the database
func GetTodos(c *gin.Context) {
	todos, err := database.GetTodos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, todos)
}

// GetTodoById retrieves a single todo by its ID
func GetTodoById(c *gin.Context) {
	id := c.Param("id")
	todo, err := database.GetTodoByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Todo not found"})
		return
	}
	c.JSON(http.StatusOK, todo)
}

// CreateTodo creates a new todo in the database
func CreateTodo(c *gin.Context) {
	var newTodo models.Todo
	if err := c.ShouldBindJSON(&newTodo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "error": err.Error()})
		return
	}
	todo, err := database.InsertTodo(newTodo.Text)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusCreated, todo)
}

// UpdateTodo updates an existing todo
func UpdateTodo(c *gin.Context) {
	id := c.Param("id")
	var updatedTodo models.Todo

	if err := c.ShouldBindJSON(&updatedTodo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "error": err.Error()})
		return
	}

	if err := database.UpdateTodo(id, updatedTodo); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Todo not found"})
		return
	}
	c.JSON(http.StatusOK, updatedTodo)
}

// DeleteTodo deletes a todo by its ID
func DeleteTodo(c *gin.Context) {
	id := c.Param("id")

	if err := database.DeleteTodo(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Todo not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
}
