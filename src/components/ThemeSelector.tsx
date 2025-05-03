import React from 'react';
import { useTheme } from '../theme/ThemeContext';

interface ThemeSelectorProps {
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
  const { mode, accentColor, toggleMode, setAccentColor } = useTheme();
  
  const colorOptions = [
    { value: 'indigo', label: 'Indigo', bgClass: 'bg-indigo-500', ringClass: 'ring-indigo-400' },
    { value: 'purple', label: 'Purple', bgClass: 'bg-purple-500', ringClass: 'ring-purple-400' },
    { value: 'blue', label: 'Blue', bgClass: 'bg-blue-500', ringClass: 'ring-blue-400' },
    { value: 'green', label: 'Green', bgClass: 'bg-green-500', ringClass: 'ring-green-400' },
    { value: 'rose', label: 'Rose', bgClass: 'bg-rose-500', ringClass: 'ring-rose-400' },
    { value: 'amber', label: 'Amber', bgClass: 'bg-amber-500', ringClass: 'ring-amber-400' }
  ];
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme Settings</h3>
        <button
          onClick={toggleMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
        >
          {mode === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accent Color</label>
          <div className="grid grid-cols-3 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value as any)}
                className={`
                  w-full flex items-center justify-center p-3 rounded-lg 
                  ${color.bgClass} text-white 
                  ${accentColor === color.value ? `ring-2 ${color.ringClass} ring-offset-2 dark:ring-offset-gray-900` : ''}
                  transition-all duration-200
                `}
                aria-label={`Set accent color to ${color.label}`}
              >
                {color.label}
                {accentColor === color.value && (
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Settings are saved automatically and will be remembered for your next visit.
        </p>
      </div>
    </div>
  );
};

export default ThemeSelector; 