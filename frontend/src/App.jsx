import React, { useState, useEffect } from 'react';

const App = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const fetchTodos = () => {
            fetch('http://localhost:8080/api/v1/todos')
                .then(response => response.json())
                .then(data => setTodos(data))
                .catch(error => console.error('Error:', error));
        };

        fetchTodos(); // Fetch todos immediately

        const intervalId = setInterval(fetchTodos, 5000); // Fetch todos every 1 second

        // Clean up function
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-fuchsia-400 flex flex-col items-center justify-center text-white font-poppins">
            <h1 className="text-5xl font-bold mb-8">Todo List</h1>
            <ul className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-black">
                {todos && todos.map(todo => (
                    todo.text && <li key={todo.id} className="text-lg my-2 border-b-2 border-gray-200 py-2">{todo.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
