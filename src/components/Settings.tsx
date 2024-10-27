import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Key } from 'lucide-react';
import { useTodoContext } from '../context/TodoContext';

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, setDarkMode, groqApiKey, setGroqApiKey } = useTodoContext();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                <label htmlFor="apiKey" className="text-sm font-medium">
                  Groq API Key
                </label>
              </div>
              <input
                type="password"
                id="apiKey"
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
                placeholder="Enter your Groq API key"
                className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Required for advanced task categorization
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;