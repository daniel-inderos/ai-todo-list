import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTodoContext } from '../context/TodoContext';

const AddTodoForm = () => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTodo } = useTodoContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await addTodo(text, dueDate, dueTime);
      setText('');
      setDueDate('');
      setDueTime('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 flex-wrap md:flex-nowrap">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white ${
            isSubmitting 
              ? 'bg-indigo-400 dark:bg-indigo-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
          disabled={isSubmitting}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {isSubmitting ? 'Analyzing...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;