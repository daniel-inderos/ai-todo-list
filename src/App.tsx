import React from 'react';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import CategoryFilter from './components/CategoryFilter';
import Settings from './components/Settings';
import { TodoProvider } from './context/TodoContext';

function App() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="text-center mb-12 relative">
            <div className="absolute right-0 top-0">
              <Settings />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Smart Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your intelligent task manager that automatically organizes your todos
            </p>
          </header>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
            <AddTodoForm />
          </div>

          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <aside className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 h-fit">
              <CategoryFilter />
            </aside>

            <main className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <TodoList />
            </main>
          </div>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;