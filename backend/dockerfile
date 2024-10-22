# Use an official Go image as the base image
FROM golang:1.23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files to the working directory
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code files into the container
COPY . .

# Build the Go application
RUN go build -o todo-crud-api .

# Expose the port on which the application will run
EXPOSE 8080

# Run the application when the container starts
CMD ["./todo-crud-api"]
