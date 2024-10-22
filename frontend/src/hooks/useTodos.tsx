import { useState, useEffect } from 'react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const todoSchema = z.object({
    id: z.string(),
    text: z.string(),
});

export type Todo = z.infer<typeof todoSchema>;
const API_URL = 'http://localhost:8080/api/v1';

const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');

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

    const handleNewTodoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newTodo.trim() === '') {
            alert("Todo cannot be empty!");
            return;
        }

        const todoToSend: Todo = {
            id: uuidv4(),
            text: newTodo,
        };

        try {
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

            const updatedTodos = await response.json();
            setTodos([...todos, updatedTodos]);
            setNewTodo('');
        } catch (error) {
            console.error('Error adding new todo:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return { todos, newTodo, setNewTodo, handleNewTodoSubmit, handleDelete };
};

export default useTodos;
