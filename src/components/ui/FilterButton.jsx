/**
 * FilterButton Component
 * Advanced filter button with dropdown and active state
 */

import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  FaFilter, 
  FaChevronDown,
  FaTimes 
} from 'react-icons/fa';
import clsx from 'clsx';
import Button from './Button.jsx';
import Badge from './Badge.jsx';

const FilterButton = ({ 
  filters = [], 
  activeFilters = [], 
  onFilterChange,
  className 
}) => {
  const activeCount = activeFilters.length;
  
  const handleFilterToggle = (filterId) => {
    const newActiveFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    onFilterChange?.(newActiveFilters);
  };

  const clearAllFilters = () => {
    onFilterChange?.([]);
  };

  return (
    <Menu as="div" className={clsx("relative inline-block text-left", className)}>
      {/* Filter Button */}
      <Menu.Button as="div">
        <Button
          variant="secondary"
          size="md"
          className={clsx(
            'relative',
            activeCount > 0 && 'ring-2 ring-blue-500 dark:ring-blue-400'
          )}
        >
          <FaFilter className="h-4 w-4 mr-2" />
          Filters
          <FaChevronDown className="h-4 w-4 ml-2" />
          
          {/* Active Filter Count Badge */}
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 text-xs font-medium rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </Menu.Button>

      {/* Dropdown Menu */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Filter Options
              </h3>
              {activeCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                >
                  <FaTimes className="h-3 w-3 mr-1" />
                  Clear all
                </button>
              )}
            </div>

            {/* Filter Options */}
            <div className="space-y-3">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    {filter.label}
                  </div>
                  <div className="space-y-1">
                    {filter.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={activeFilters.includes(option.id)}
                          onChange={() => handleFilterToggle(option.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          {option.label}
                        </span>
                        {option.count && (
                          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Applied Filters */}
            {activeCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Applied Filters
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeFilters.map((filterId) => {
                    const filter = filters.find(f => f.options.some(o => o.id === filterId));
                    const option = filter?.options.find(o => o.id === filterId);
                    
                    return option ? (
                      <Badge
                        key={filterId}
                        variant="blue"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        {option.label}
                        <button
                          onClick={() => handleFilterToggle(filterId)}
                          className="ml-1 hover:bg-blue-600 rounded-full p-0.5"
                        >
                          <FaTimes className="h-2.5 w-2.5" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default FilterButton;
