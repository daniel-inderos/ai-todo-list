import React from 'react';
import { useTodoContext } from '../context/TodoContext';
import { Calendar, Clock, Tag, AlertCircle } from 'lucide-react';

const TodoList = () => {
  const { todos, toggleTodo, deleteTodo, selectedCategory } = useTodoContext();

  const filteredTodos = selectedCategory === 'all' 
    ? todos
    : todos.filter(todo => todo.category === selectedCategory);

  const formatDate = (date: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todoDate = new Date(date + 'T00:00:00'); // Add time to ensure proper date comparison
    todoDate.setHours(0, 0, 0, 0);

    if (todoDate.getTime() === today.getTime()) return '';
    if (todoDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    if (todoDate.getTime() === yesterday.getTime()) return 'Yesterday';
    
    // Format other dates as MM/DD/YYYY
    return todoDate.toLocaleDateString();
  };

  const isOverdue = (date: string, time: string): boolean => {
    const now = new Date();
    const taskDateTime = new Date(`${date}T${time}`);
    return taskDateTime < now;
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
    switch (priority) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-yellow-500 dark:text-yellow-400';
      case 'low': return 'text-green-500 dark:text-green-400';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      {filteredTodos.map((todo) => {
        const isTaskOverdue = isOverdue(todo.dueDate, todo.dueTime);
        const formattedDate = formatDate(todo.dueDate);

        return (
          <div
            key={todo.id}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
              todo.completed
                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`text-gray-800 dark:text-gray-200 ${
                  todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                } ${isTaskOverdue && !todo.completed ? 'text-red-500 dark:text-red-400' : ''}`}>
                  {todo.text}
                </p>
                <AlertCircle className={`w-4 h-4 ${getPriorityColor(todo.priority)}`} />
              </div>
              <div className="flex items-center gap-4 mt-2">
                {formattedDate && (
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formattedDate}
                  </span>
                )}
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {todo.dueTime}
                </span>
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Tag className="w-4 h-4 mr-1" />
                  {todo.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TodoList;
