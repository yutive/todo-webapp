import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


const App = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    let id = 0;

    const fetchTodos = () => {
        fetch('http://localhost:8080/api/v1/todos')
            .then(response => response.json())
            .then(data => setTodos(data))
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        fetchTodos(); // Fetch todos immediately
    }, []);

    const handleNewTodoChange = (event) => {
        setNewTodo(event.target.value);
    };

    const handleNewTodoSubmit = (event) => {
        event.preventDefault();

        const todoToSend = {
            id: uuidv4(),
            text: newTodo,
        };

        fetch('http://localhost:8080/api/v1/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todoToSend),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // After submitting the new todo, fetch the updated list of todos
                fetchTodos();
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        setNewTodo(''); // Clear the input field
    };


    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-fuchsia-400 flex flex-col items-center justify-center text-white font-poppins px-4 sm:px-0">
            <h1 className="text-5xl font-bold mb-8 text-center">Todo List</h1>
            <form onSubmit={handleNewTodoSubmit} className="w-full max-w-md mb-8">
                <input
                    type="text"
                    value={newTodo}
                    onChange={handleNewTodoChange}
                    placeholder="New Todo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-black"
                />
                <button type="submit" className="w-full mt-2 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm">Add Todo</button>
            </form>
            <ul className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-black">
                {todos && todos.map(todo => (
                    todo.text && <li key={todo.id} className="text-lg my-2 border-b-2 border-gray-200 py-2">{todo.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;