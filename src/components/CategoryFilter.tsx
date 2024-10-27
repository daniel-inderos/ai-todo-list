import React from 'react';
import { useTodoContext } from '../context/TodoContext';
import { Briefcase, Home, Book, Dumbbell, ShoppingCart } from 'lucide-react';

const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory, getCategoryCount } = useTodoContext();

  const categories = [
    { id: 'all', name: 'All Tasks', icon: Home },
    { id: 'work', name: 'Work', icon: Briefcase },
    { id: 'personal', name: 'Personal', icon: Book },
    { id: 'health', name: 'Health', icon: Dumbbell },
    { id: 'shopping', name: 'Shopping', icon: ShoppingCart },
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
      {categories.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setSelectedCategory(id)}
          className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === id
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <span>{name}</span>
          </div>
          <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
            {getCategoryCount(id)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;