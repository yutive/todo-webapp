import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:8080/api/v1';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(`${API_URL}/todos`);
                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchTodos();
    }, []);

    const handleNewTodoChange = (event) => {
        setNewTodo(event.target.value);
    };

    const handleNewTodoSubmit = async (event) => {
        event.preventDefault();

        const todoToSend = {
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
            const data = await response.json();
            console.log('Success:', data);
            setNewTodo('');
            const refresh = await fetch(`${API_URL}/todos`);
            const newData = await refresh.json();
            setTodos(newData);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            const refresh = await fetch(`${API_URL}/todos`);
            const newData = await refresh.json();
            setTodos(newData);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-r from-blue-500 to-fuchsia-400 flex flex-col items-center justify-center text-white font-poppins px-4 sm:px-0">
            <h1 className="text-5xl font-bold mb-8 text-center">Todo List</h1>
            <form onSubmit={handleNewTodoSubmit} className="w-full max-w-md mb-8">
                <input
                    type="text"
                    value={newTodo}
                    onChange={handleNewTodoChange}
                    placeholder="New Todo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-black"
                />
                <button type="submit"
                        className="w-full mt-2 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm">Add
                    Todo
                </button>
            </form>
            <ul className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-black">
                {todos && todos.map(todo => (
                    todo.text &&
                    <li key={todo.id}
                        className="flex justify-between items-center my-2 border-b-2 border-gray-200 py-2">
                        <p>
                            {todo.text}
                        </p>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            onClick={() => handleDelete(todo.id)}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;