/**
 * ThemeToggle Component
 * Toggle button for sw        <FaMoon 
          className={clsx(
            'absolute transition-all duration-300 transform',
            iconSizes[size],
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          )}
        />etween light and dark themes
 */

import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import clsx from 'clsx';

const ThemeToggle = ({ className, size = 'md' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'relative inline-flex items-center justify-center rounded-lg transition-all duration-200',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'hover:bg-gray-50 dark:hover:bg-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
        sizes[size],
        className
      )}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative flex items-center justify-center">
        {/* Sun icon for light mode */}
        <FaSun
          className={clsx(
            'transition-all duration-300 transform',
            iconSizes[size],
            isDark
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          )}
        />

        {/* Moon icon for dark mode */}
        <FaMoon
          className={clsx(
            'absolute inset-0 transition-all duration-300 transform',
            iconSizes[size],
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
          )}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
