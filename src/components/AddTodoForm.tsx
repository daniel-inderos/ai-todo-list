import React, { useState } from 'react';
import { PlusCircle, Clock, Calendar } from 'lucide-react';
import { useTodoContext } from '../context/TodoContext';

const AddTodoForm = () => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { addTodo } = useTodoContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      try {
        setIsLoading(true);
        // Convert 12h to 24h time if manually set
        const time24 = dueTime ? convertTo24Hour(dueTime) : '';
        await addTodo(text, dueDate, time24);
        setText('');
        setDueDate('');
        setDueTime('');
      } catch (error) {
        console.error('Error adding todo:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Helper function to convert 12h to 24h format
  const convertTo24Hour = (time12: string): string => {
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);

    if (hour === 12) {
      hour = modifier === 'PM' ? 12 : 0;
    } else if (modifier === 'PM') {
      hour = hour + 12;
    }

    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-grow p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
      <div className="flex gap-2">
        <div className="relative">
          <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="pl-10 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div className="relative">
          <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="time"
            value={dueTime}
            onChange={(e) => {
              const time24 = e.target.value;
              const [hours, minutes] = time24.split(':');
              const hour = parseInt(hours, 10);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const hour12 = hour % 12 || 12;
              setDueTime(`${hour12}:${minutes} ${ampm}`);
            }}
            className="pl-10 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <PlusCircle className="w-5 h-5" />
          Add Task
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;
