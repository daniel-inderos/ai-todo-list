import React from 'react';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import CategoryFilter from './components/CategoryFilter';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import { TodoProvider } from './context/TodoContext';
import { UserProvider } from './context/UserContext';
import { useUserContext } from './context/UserContext';

const AppContent = () => {
  const { isOnboarded, name } = useUserContext();

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12 relative">
          <div className="absolute right-0 top-0">
            <Settings />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {name}'s Smart Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your intelligent task manager that automatically organizes your todos
          </p>
        </header>

        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/50 rounded-xl shadow-lg dark:shadow-indigo-500/10 p-6 mb-8 border border-gray-100 dark:border-gray-800">
          <AddTodoForm />
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <aside className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/50 rounded-xl shadow-lg dark:shadow-indigo-500/10 p-6 h-fit border border-gray-100 dark:border-gray-800">
            <CategoryFilter />
          </aside>

          <main className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/50 rounded-xl shadow-lg dark:shadow-indigo-500/10 p-6 border border-gray-100 dark:border-gray-800">
            <TodoList />
          </main>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </UserProvider>
  );
}

export default App;
