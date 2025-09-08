/**
 * Switch Component
 * Modern toggle switch component
 */

import { forwardRef } from 'react';
import clsx from 'clsx';

const Switch = forwardRef(({ 
  checked = false, 
  onCheckedChange, 
  disabled = false,
  className,
  size = 'md',
  ...props 
}, ref) => {
  const sizes = {
    sm: 'h-4 w-7',
    md: 'h-6 w-11', 
    lg: 'h-8 w-14'
  };

  const thumbSizes = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-7 w-7'
  };

  const translateSizes = {
    sm: checked ? 'translate-x-3' : 'translate-x-0.5',
    md: checked ? 'translate-x-5' : 'translate-x-0.5', 
    lg: checked ? 'translate-x-6' : 'translate-x-0.5'
  };

  const switchClasses = clsx(
    'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    'disabled:cursor-not-allowed disabled:opacity-50',
    sizes[size],
    checked 
      ? 'bg-blue-600 dark:bg-blue-500' 
      : 'bg-gray-200 dark:bg-gray-700',
    disabled 
      ? 'cursor-not-allowed' 
      : 'cursor-pointer',
    className
  );

  const thumbClasses = clsx(
    'inline-block rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out',
    thumbSizes[size],
    translateSizes[size]
  );

  const handleToggle = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={switchClasses}
      onClick={handleToggle}
      {...props}
    >
      <span className={thumbClasses} />
    </button>
  );
});

Switch.displayName = 'Switch';

export default Switch;
