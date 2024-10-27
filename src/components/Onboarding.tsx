import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { Briefcase, GraduationCap } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [occupationType, setOccupationType] = useState<'work' | 'school'>('work');
  const [apiKey, setApiKey] = useState('');
  const { completeOnboarding } = useUserContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('groqApiKey', apiKey);
    completeOnboarding(name, occupationType);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Welcome to Smart Tasks! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Let's get to know you better
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
              <button
                onClick={() => name && setStep(2)}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Hi, {name}! 🎯
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  What best describes your current status?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setOccupationType('work');
                    setStep(3);
                  }}
                  className="p-6 border rounded-xl flex flex-col items-center gap-3 transition-all hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                >
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">Working</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOccupationType('school');
                    setStep(3);
                  }}
                  className="p-6 border rounded-xl flex flex-col items-center gap-3 transition-all hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                >
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">Studying</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  One Last Step! 🚀
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  To enable AI-powered task categorization, please add your Groq API key
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Groq API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Groq API key"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don't have a Groq API key? Get one for free at{' '}
                  <a 
                    href="https://console.groq.com/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    console.groq.com
                  </a>
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
