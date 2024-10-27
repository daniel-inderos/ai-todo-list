import React from 'react';
import { useTodoContext } from '../context/TodoContext';
import { useUserContext } from '../context/UserContext';
import { Briefcase, Home, Book, Dumbbell, ShoppingCart, GraduationCap } from 'lucide-react';

const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory, getCategoryCount } = useTodoContext();
  const { occupationType } = useUserContext();

  const categories = [
    { id: 'all', name: 'All Tasks', icon: Home },
    { 
      id: occupationType, 
      name: occupationType === 'work' ? 'Work' : 'School', 
      icon: occupationType === 'work' ? Briefcase : GraduationCap 
    },
    { id: 'personal', name: 'Personal', icon: Book },
    { id: 'health', name: 'Health', icon: Dumbbell },
    { id: 'shopping', name: 'Shopping', icon: ShoppingCart },
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Categories</h2>
      {categories.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setSelectedCategory(id)}
          className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
            selectedCategory === id
              ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${
              selectedCategory === id 
                ? 'text-indigo-600 dark:text-indigo-300' 
                : 'text-gray-500 dark:text-gray-400'
            }`} />
            <span>{name}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-sm ${
            selectedCategory === id
              ? 'bg-indigo-200 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            {getCategoryCount(id)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
