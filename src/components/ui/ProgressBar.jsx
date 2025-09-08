import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProgressBar Component
 * A customizable progress bar with multiple color variants
 */
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className = '', 
  color = 'blue',
  showLabel = false,
  labelFormat = 'percentage',
  size = 'md',
  striped = false,
  animated = false
}) => {
  // Calculate percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Color variants
  const colorVariants = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500',
  };
  
  // Size variants
  const sizeVariants = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };
  
  // Background color variants
  const bgColorVariants = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100',
    indigo: 'bg-indigo-100',
    pink: 'bg-pink-100',
    gray: 'bg-gray-100',
  };
  
  // Format label
  const formatLabel = () => {
    switch (labelFormat) {
      case 'percentage':
        return `${Math.round(percentage)}%`;
      case 'fraction':
        return `${value}/${max}`;
      case 'value':
        return value.toString();
      default:
        return `${Math.round(percentage)}%`;
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Progress bar container */}
      <div 
        className={`
          w-full rounded-full overflow-hidden
          ${bgColorVariants[color] || bgColorVariants.blue}
          ${sizeVariants[size] || sizeVariants.md}
        `}
      >
        {/* Progress bar fill */}
        <div
          className={`
            ${sizeVariants[size] || sizeVariants.md}
            ${colorVariants[color] || colorVariants.blue}
            transition-all duration-300 ease-in-out
            ${striped ? 'bg-stripes' : ''}
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Label */}
      {showLabel && (
        <div className="flex justify-center mt-1">
          <span className="text-sm font-medium text-gray-700">
            {formatLabel()}
          </span>
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'blue', 'green', 'yellow', 'red', 'purple', 'indigo', 'pink', 'gray'
  ]),
  showLabel: PropTypes.bool,
  labelFormat: PropTypes.oneOf(['percentage', 'fraction', 'value']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  striped: PropTypes.bool,
  animated: PropTypes.bool,
};

/**
 * Circular Progress Component
 * A circular progress indicator
 */
export const CircularProgress = ({ 
  value = 0, 
  max = 100, 
  size = 120,
  strokeWidth = 8,
  color = 'blue',
  className = '',
  showLabel = true,
  labelFormat = 'percentage'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Color variants for circular progress
  const colorVariants = {
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    indigo: '#6366F1',
    pink: '#EC4899',
    gray: '#6B7280',
  };
  
  const formatLabel = () => {
    switch (labelFormat) {
      case 'percentage':
        return `${Math.round(percentage)}%`;
      case 'fraction':
        return `${value}/${max}`;
      case 'value':
        return value.toString();
      default:
        return `${Math.round(percentage)}%`;
    }
  };
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorVariants[color] || colorVariants.blue}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700">
            {formatLabel()}
          </span>
        </div>
      )}
    </div>
  );
};

CircularProgress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  color: PropTypes.oneOf([
    'blue', 'green', 'yellow', 'red', 'purple', 'indigo', 'pink', 'gray'
  ]),
  className: PropTypes.string,
  showLabel: PropTypes.bool,
  labelFormat: PropTypes.oneOf(['percentage', 'fraction', 'value']),
};

export default ProgressBar;
