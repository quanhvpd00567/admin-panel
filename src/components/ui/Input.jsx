/**
 * Input Component
 * Modern form input with beautiful design and validation styles
 */

import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className,
      containerClassName,
      type = 'text',
      size = 'md',
      variant = 'default',
      disabled = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    // Base classes with modern design
    const baseClasses =
      'block w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed';

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    // Modern variants with better styling
    const variants = {
      default: error
        ? 'border-red-300 dark:border-red-600 bg-white dark:bg-gray-800 text-red-900 dark:text-red-300 placeholder-red-400 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500 shadow-sm'
        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm',

      filled: error
        ? 'border-transparent bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 placeholder-red-400 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500 focus:bg-white dark:focus:bg-gray-800'
        : 'border-transparent bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600',

      outlined: error
        ? 'border-2 border-red-300 dark:border-red-600 bg-transparent text-red-900 dark:text-red-300 placeholder-red-400 dark:placeholder-red-500 focus:ring-0 focus:border-red-500'
        : 'border-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-500',
    };

    const disabledClasses =
      'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed';

    const inputClasses = clsx(
      baseClasses,
      sizes[size],
      disabled ? disabledClasses : variants[variant],
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
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
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400 dark:text-gray-500">
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400 dark:text-gray-500">
                {rightIcon}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center">
            <svg
              className="h-4 w-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.displayName = 'Input';

export { Input };
export default Input;
