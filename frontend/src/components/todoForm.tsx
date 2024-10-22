import React, { ChangeEvent, FormEvent } from 'react';

interface TodoFormProps {
    newTodo: string;
    setNewTodo: (value: string) => void;
    handleNewTodoSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

const TodoForm: React.FC<TodoFormProps> = ({ newTodo, setNewTodo, handleNewTodoSubmit }) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewTodo(event.target.value);
    };

    return (
        <form onSubmit={handleNewTodoSubmit} className="w-full max-w-md mb-8">
            <input
                type="text"
                value={newTodo}
                onChange={handleChange}
                placeholder="New Todo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-black"
            />
            <button type="submit" className="w-full mt-2 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm">
                Add Todo
            </button>
        </form>
    );
};

export default TodoForm;
