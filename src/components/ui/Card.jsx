/**
 * Card Component
 * Flexible card component for admin panel
 */

import clsx from 'clsx';

const Card = ({ 
  children, 
  className, 
  padding = true,
  shadow = 'sm',
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700';
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  const classes = clsx(
    baseClasses,
    shadows[shadow],
    padding && 'p-6',
    className
  );
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  const classes = clsx(
    'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
    className
  );
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className, ...props }) => {
  const classes = clsx(
    'px-6 py-4',
    className
  );
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className, ...props }) => {
  const classes = clsx(
    'px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg',
    className
  );
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };
export default Card;
