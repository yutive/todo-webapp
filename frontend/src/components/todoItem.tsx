import React from 'react';
import { Todo } from '../hooks/useTodos.tsx'

interface TodoItemProps {
    todo: Todo;
    handleDelete: (id: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, handleDelete }) => {
    return (
        <li className="flex justify-between items-center my-2 border-b-2 border-gray-200 py-2">
            <p>{todo.text}</p>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => handleDelete(todo.id)}
            >
                X
            </button>
        </li>
    );
};

export default TodoItem;
