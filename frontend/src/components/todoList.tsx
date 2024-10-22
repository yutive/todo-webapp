import React from 'react';
import TodoItem from './todoItem';
import { Todo } from '../hooks/useTodos.tsx'

interface TodoListProps {
    todos: Todo[];
    handleDelete: (id: string) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({ todos, handleDelete }) => {
    return (
        <ul className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-black">
            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} handleDelete={handleDelete} />
            ))}
        </ul>
    );
};

export default TodoList;
