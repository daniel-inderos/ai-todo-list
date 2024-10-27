import React, { createContext, useContext, useState, useEffect } from 'react';
import CategoryClassifier from '../utils/categoryClassifier';
import { useUserContext } from './UserContext';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
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
  customCategories: string[];
  addCustomCategory: (category: string) => void;
  deleteCustomCategory: (category: string) => void;
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
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('customCategories');
    // Initialize with Health and Shopping by default
    return saved ? JSON.parse(saved) : ['Health', 'Shopping'];
  });
  const { occupationType } = useUserContext();

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

  useEffect(() => {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [customCategories]);

  const addTodo = async (text: string, dueDate: string, dueTime: string) => {
    const classifier = CategoryClassifier.getInstance();
    try {
      // First, clean the text and get scheduling info
      const cleanedText = await classifier.cleanTaskText(text, groqApiKey);
      console.log('Cleaned text:', cleanedText);

      // Get category and schedule suggestions
      const [category, schedule] = await Promise.all([
        classifier.categorizeTask(cleanedText, groqApiKey, occupationType),
        classifier.suggestTaskSchedule(text, groqApiKey, new Date().toISOString(), todos.slice(-5))
      ]);

      console.log('Category determined:', category);
      console.log('Schedule suggested:', schedule);

      // Use provided date/time if set, otherwise use AI suggestions
      const finalTime = dueTime || convertTo12Hour(schedule.suggestedTime);
      const finalDate = dueDate || schedule.suggestedDate;

      const newTodo: Todo = {
        id: Date.now().toString(),
        text: cleanedText,
        completed: false,
        category,
        dueDate: finalDate,
        dueTime: finalTime,
        priority: schedule.priority
      };

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      console.error('Error in addTodo:', error);
      // Fallback with manual date/time
      const newTodo: Todo = {
        id: Date.now().toString(),
        text,
        completed: false,
        category: occupationType,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        dueTime: dueTime || '12:00 PM',
        priority: 'medium'
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
    }
  };

  // Helper function to convert 24h to 12h format
  const convertTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
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

  const addCustomCategory = (category: string) => {
    if (!customCategories.includes(category)) {
      setCustomCategories([...customCategories, category]);
    }
  };

  const deleteCustomCategory = (category: string) => {
    setCustomCategories(prev => prev.filter(cat => cat !== category));
    // Optionally move todos in deleted category to 'personal'
    setTodos(prev => prev.map(todo => 
      todo.category === category 
        ? { ...todo, category: 'personal' }
        : todo
    ));
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
      customCategories,
      addCustomCategory,
      deleteCustomCategory,
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
