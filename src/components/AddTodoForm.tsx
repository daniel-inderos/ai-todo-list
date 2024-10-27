import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTodoContext } from '../context/TodoContext';

const AddTodoForm = () => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const { addTodo } = useTodoContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { text, dueDate, dueTime });
    
    if (text.trim()) {
      try {
        await addTodo(text, dueDate, dueTime);
        console.log('Todo added successfully');
        setText('');
        setDueDate('');
        setDueTime('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-grow p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
      >
        <PlusCircle className="w-5 h-5" />
        Add Task
      </button>
    </form>
  );
};

export default AddTodoForm;
