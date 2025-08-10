/**
 * Select Component
 * Modern select dropdown with beautiful design
 */

import { forwardRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import clsx from 'clsx';

const Select = forwardRef(({
  label,
  error,
  helperText,
  children,
  className,
  containerClassName,
  size = 'md',
  variant = 'default',
  disabled = false,
  placeholder,
  ...props
}, ref) => {
  // Base classes with modern design
  const baseClasses = 'block w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed appearance-none';
  
  const sizes = {
    sm: 'px-3 py-2 text-sm pr-8',
    md: 'px-4 py-2.5 text-sm pr-10',
    lg: 'px-4 py-3 text-base pr-10'
  };
  
  // Modern variants with better styling
  const variants = {
    default: error
      ? 'border-red-300 dark:border-red-600 bg-white dark:bg-gray-800 text-red-900 dark:text-red-300 focus:ring-red-500 focus:border-red-500 shadow-sm'
      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm',
    
    filled: error
      ? 'border-transparent bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 focus:ring-red-500 focus:border-red-500 focus:bg-white dark:focus:bg-gray-800'
      : 'border-transparent bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600',
    
    outlined: error
      ? 'border-2 border-red-300 dark:border-red-600 bg-transparent text-red-900 dark:text-red-300 focus:ring-0 focus:border-red-500'
      : 'border-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-0 focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-500'
  };
  
  const disabledClasses = 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed';
  
  const selectClasses = clsx(
    baseClasses,
    sizes[size],
    disabled ? disabledClasses : variants[variant],
    className
  );

  return (
    <div className={clsx('relative', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Select Field */}
        <select
          ref={ref}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        
        {/* Dropdown Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FaChevronDown 
            className={clsx(
              'h-5 w-5',
              disabled 
                ? 'text-gray-400 dark:text-gray-600' 
                : 'text-gray-400 dark:text-gray-500'
            )} 
          />
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.displayName = 'Select';

export { Select };
export default Select;
