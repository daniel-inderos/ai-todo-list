import React, { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';
import { useUserContext } from '../context/UserContext';
import { 
  Briefcase, Home, Book, Dumbbell, ShoppingCart, GraduationCap,
  Lightbulb, Coffee, Palette, Music, Plus, Check, X, Trash2
} from 'lucide-react';

// Define preset categories with their icons
const PRESET_CATEGORIES = [
  { id: 'ideas', name: 'Ideas', icon: Lightbulb },
  { id: 'hobbies', name: 'Hobbies', icon: Palette },
  { id: 'music', name: 'Music', icon: Music },
  { id: 'social', name: 'Social', icon: Coffee },
  { id: 'health', name: 'Health', icon: Dumbbell },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart },
];

// Define categories that cannot be deleted
const DEFAULT_CATEGORIES = ['all', 'personal'];

const CategoryFilter = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    getCategoryCount, 
    customCategories, 
    addCustomCategory,
    deleteCustomCategory 
  } = useTodoContext();
  const { occupationType } = useUserContext();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  // Get icon for a category
  const getCategoryIcon = (id: string) => {
    // Check presets first
    const preset = PRESET_CATEGORIES.find(p => p.id.toLowerCase() === id.toLowerCase());
    if (preset) return preset.icon;

    // Then check default icons
    switch (id) {
      case 'all': return Home;
      case 'work': case 'school': return occupationType === 'work' ? Briefcase : GraduationCap;
      case 'personal': return Book;
      case 'health': return Dumbbell;
      case 'shopping': return ShoppingCart;
      default: return Book;
    }
  };

  const defaultCategories = [
    { id: 'all', name: 'All Tasks', icon: Home },
    { 
      id: occupationType, 
      name: occupationType === 'work' ? 'Work' : 'School', 
      icon: occupationType === 'work' ? Briefcase : GraduationCap 
    },
    { id: 'personal', name: 'Personal', icon: Book },
    // Only include health and shopping if they haven't been deleted
    ...(customCategories.includes('Health') ? [{ id: 'health', name: 'Health', icon: Dumbbell }] : []),
    ...(customCategories.includes('Shopping') ? [{ id: 'shopping', name: 'Shopping', icon: ShoppingCart }] : []),
    ...customCategories
      .filter(cat => !['Health', 'Shopping'].includes(cat)) // Don't duplicate health and shopping
      .map(cat => ({ 
        id: cat, 
        name: cat, 
        icon: getCategoryIcon(cat)
      })),
  ];

  // Get currently used categories (including both custom and default)
  const usedCategories = [
    'all', 'personal', occupationType, 
    ...customCategories.map(cat => cat.toLowerCase())
  ];

  // Filter out presets that are already in use (case-insensitive)
  const availablePresets = PRESET_CATEGORIES.filter(preset => 
    !usedCategories.includes(preset.name.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCustomCategory(newCategoryName.trim());
      handleCancel();
    }
  };

  const handleAddPreset = (preset: { id: string; name: string; icon: any }) => {
    addCustomCategory(preset.name);
    handleCancel();
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory('all');
    }
    deleteCustomCategory(categoryId);
  };

  const handleCancel = () => {
    setIsAddingCategory(false);
    setShowPresets(false);
    setNewCategoryName('');
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Categories</h2>
      
      {/* Existing Categories */}
      {defaultCategories.map(({ id, name, icon: Icon }) => (
        <div
          key={id}
          className="group relative"
        >
          <button
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
            <div className="flex items-center gap-2">
              {!DEFAULT_CATEGORIES.includes(id) && id !== occupationType && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 dark:hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <span className={`group-hover:pr-2 px-2 py-1 rounded-full text-sm transition-all ${
                selectedCategory === id
                  ? 'bg-indigo-200 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {getCategoryCount(id)}
              </span>
            </div>
          </button>
        </div>
      ))}

      {/* Add Category Section */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {!isAddingCategory && !showPresets && (
          <div className="space-y-2">
            <button
              onClick={() => setIsAddingCategory(true)}
              className="w-full flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Custom Category</span>
            </button>
            {availablePresets.length > 0 && (
              <button
                onClick={() => setShowPresets(true)}
                className="w-full flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              >
                <Lightbulb className="w-5 h-5" />
                <span>Choose from Presets</span>
              </button>
            )}
          </div>
        )}

        {/* Add Custom Category Form */}
        {isAddingCategory && (
          <div className="flex items-center bg-white dark:bg-gray-800 border rounded-lg dark:border-gray-700">
            <div className="flex border-r dark:border-gray-700">
              <button
                onClick={handleAddCategory}
                className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 p-2 bg-transparent dark:text-white focus:outline-none rounded-r-lg"
              autoFocus
            />
          </div>
        )}

        {/* Preset Categories */}
        {showPresets && (
          <div className="space-y-2">
            {PRESET_CATEGORIES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleAddPreset(preset)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <preset.icon className="w-5 h-5" />
                <span>{preset.name}</span>
              </button>
            ))}
            <button
              onClick={handleCancel}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors mt-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
