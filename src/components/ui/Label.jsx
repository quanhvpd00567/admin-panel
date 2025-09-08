/**
 * Label Component
 * Simple form label component
 */

import { forwardRef } from 'react';
import clsx from 'clsx';

const Label = forwardRef(({ children, htmlFor, className, required, ...props }, ref) => {
  const labelClasses = clsx(
    'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
    className
  );

  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={labelClasses}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
});

Label.displayName = 'Label';

export default Label;
