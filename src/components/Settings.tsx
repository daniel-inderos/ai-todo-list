import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import { useTodoContext } from '../context/TodoContext';

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, setDarkMode, groqApiKey, setGroqApiKey } = useTodoContext();

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    console.log('Setting new API key, length:', newKey.length);
    setGroqApiKey(newKey);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors"
        aria-label="Settings"
      >
        <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Settings Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-indigo-500/10 border border-gray-200 dark:border-gray-800 p-4 z-50">
            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    darkMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Groq API Key
                </label>
                <input
                  type="password"
                  value={groqApiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your Groq API key"
                  className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get your API key from{' '}
                  <a 
                    href="https://console.groq.com/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    console.groq.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
