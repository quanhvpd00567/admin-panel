/**
 * Stats Component
 * Dashboard statistics cards
 */

import clsx from 'clsx';

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'blue',
  className,
  ...props
}) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
    indigo: 'text-indigo-600 bg-indigo-100'
  };
  
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };
  
  const classes = clsx(
    'bg-white rounded-lg p-6 border border-gray-200 shadow-sm',
    className
  );
  
  return (
    <div className={classes} {...props}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon && (
            <div className={clsx('p-3 rounded-md', colors[color])}>
              {icon}
            </div>
          )}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {change && (
                <div className={clsx(
                  'ml-2 flex items-baseline text-sm font-semibold',
                  changeColors[changeType]
                )}>
                  {changeType === 'positive' && (
                    <svg className="self-center flex-shrink-0 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {changeType === 'negative' && (
                    <svg className="self-center flex-shrink-0 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="sr-only">
                    {changeType === 'positive' ? 'Increased' : 'Decreased'} by
                  </span>
                  {change}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

const StatsGrid = ({ children, className, ...props }) => {
  const classes = clsx(
    'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    className
  );
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export { StatsCard, StatsGrid };
