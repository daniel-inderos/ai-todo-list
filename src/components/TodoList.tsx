import React from 'react';
import { useTodoContext } from '../context/TodoContext';
import { Calendar, Tag, Clock, Trash2 } from 'lucide-react';

const TodoList = () => {
  const { todos, toggleTodo, deleteTodo, selectedCategory } = useTodoContext();

  const filteredTodos = selectedCategory === 'all' 
    ? todos
    : todos.filter(todo => todo.category === selectedCategory);

  return (
    <div className="space-y-4">
      {filteredTodos.map((todo) => (
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
            <p className={`text-gray-800 dark:text-gray-200 ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {todo.text}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                {todo.dueDate}
              </span>
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
            className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;