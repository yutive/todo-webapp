import { useState, useEffect } from 'react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Define the schema for a todo using zod for validation
const todoSchema = z.object({
    ID: z.string(),
    Text: z.string(),
});


// Infer the Todo type from the schema
export type Todo = z.infer<typeof todoSchema>;

// Set the API base URL
const API_URL = 'http://localhost:8080/api/v1';

const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);  // Initialize todos state
    const [newTodo, setNewTodo] = useState<string>('');  // State to track new todo input

    // Fetch todos from the API on component mount
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(`${API_URL}/todos`);
                const data = await response.json();
                const validatedTodos = z.array(todoSchema).parse(data);
                setTodos(validatedTodos);
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };
        fetchTodos();
    }, []);

    // Handle submitting a new todo
    const handleNewTodoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();  // Prevent the default form submission behavior

        // Ensure that the new todo is not empty
        if (newTodo.trim() === '') {
            alert("Todo cannot be empty!");
            return;
        }

        // Construct a new todo object with a generated UUID
        const todoToSend: Todo = {
            ID: uuidv4(),
            Text: newTodo,
        };

        try {
            // Send a POST request to create a new todo
            const response = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todoToSend),
            });

            if (!response.ok) {
                throw new Error('Failed to create todo');
            }

            // Parse the response to get the newly created todo
            const createdTodo = await response.json();

            // Add the newly created todo to the list of todos
            setTodos([...todos, createdTodo]);

            // Clear the new todo input
            setNewTodo('');
        } catch (error) {
            console.error('Error adding new todo:', error);
        }
    };

    // Handle deleting a todo by its ID
    const handleDelete = async (ID: string) => {
        try {
            // Send a DELETE request to remove the todo
            const response = await fetch(`${API_URL}/delete/${ID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            // Remove the deleted todo from the state
            setTodos(todos.filter(todo => todo.ID !== ID));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    // Return the todos, the newTodo state, and the handlers for creating and deleting todos
    return { todos, newTodo, setNewTodo, handleNewTodoSubmit, handleDelete };
};

export default useTodos;
