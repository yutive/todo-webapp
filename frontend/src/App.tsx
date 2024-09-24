import React from 'react';
import TodoForm from './components/todoForm.tsx';
import TodoList from './components/todoList';
import useTodos from './hooks/useTodos';

const App: React.FC = () => {
    const { todos, newTodo, setNewTodo, handleNewTodoSubmit, handleDelete } = useTodos();

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-fuchsia-400 flex flex-col items-center justify-center text-white font-poppins px-4 sm:px-0">
            <h1 className="text-5xl font-bold mb-8 text-center">Todo List</h1>
            <TodoForm newTodo={newTodo} setNewTodo={setNewTodo} handleNewTodoSubmit={handleNewTodoSubmit} />
            {todos.length > 0 ? (
                <TodoList todos={todos} handleDelete={handleDelete} />
            ) : (
                <p className="text-white mt-4">No todos available. Add your first todo!</p>
            )}
        </div>
    );
};

export default App;
