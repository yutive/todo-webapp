
# Todo CRUD API

This project is a simple CRUD (Create, Read, Update, Delete) API for managing Todo items.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Go programming language (version 1.16 or higher)

### Running the application

Run the application
```bash
go run main.go
```

## API Endpoints

### Home

- URL: `/`
- Method: `GET`
- Description: Welcome endpoint

### Get all Todos

- URL: `api/v1/todos`
- Method: `GET`
- Description: Returns a list of all todos

### Get a Todo by ID

- URL: `api/v1/todos/:id`
- Method: `GET`
- Description: Returns a single todo with the specified ID

### Create a new Todo

- URL: `api/v1/todos`
- Method: `POST`
- Description: Creates a new todo
- Body: `{"id": "<id>", "text": "<text>"}`

### Update a Todo

- URL: `api/v1/todos/:id`
- Method: `PUT`
- Description: Updates the todo with the specified ID
- Body: `{"id": "<id>", "text": "<text>"}`

### Delete a Todo

- URL: `api/v1/todos/:id`
- Method: `DELETE`
- Description: Deletes the todo with the specified ID
