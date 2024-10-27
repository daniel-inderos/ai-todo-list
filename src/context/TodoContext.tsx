import React, { createContext, useContext, useState, useEffect } from 'react';
import CategoryClassifier from '../utils/categoryClassifier';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  dueDate: string;
  dueTime: string;
}

interface TodoContextType {
  todos: Todo[];
  selectedCategory: string;
  darkMode: boolean;
  groqApiKey: string;
  addTodo: (text: string, dueDate: string, dueTime: string) => Promise<void>;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setSelectedCategory: (category: string) => void;
  getCategoryCount: (category: string) => number;
  setDarkMode: (enabled: boolean) => void;
  setGroqApiKey: (key: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [groqApiKey, setGroqApiKey] = useState(() => {
    return localStorage.getItem('groqApiKey') || '';
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('groqApiKey', groqApiKey);
  }, [groqApiKey]);

  const addTodo = async (text: string, dueDate: string, dueTime: string) => {
    const classifier = CategoryClassifier.getInstance();
    const category = await classifier.categorizeTask(text, groqApiKey);

    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      category,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      dueTime: dueTime || '12:00'
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getCategoryCount = (category: string): number => {
    if (category === 'all') return todos.length;
    return todos.filter(todo => todo.category === category).length;
  };

  return (
    <TodoContext.Provider value={{
      todos,
      selectedCategory,
      darkMode,
      groqApiKey,
      addTodo,
      toggleTodo,
      deleteTodo,
      setSelectedCategory,
      getCategoryCount,
      setDarkMode,
      setGroqApiKey,
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};