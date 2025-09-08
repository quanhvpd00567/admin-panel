/**
 * ClassSelector Component
 * Multi-select dropdown for selecting classes
 */

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiX, FiCheck, FiSearch } from 'react-icons/fi';
import { CLASS_OPTIONS, getGroupedClasses, getClassesByCodes } from '../../constants/classes';

const ClassSelector = ({ 
  value = null, 
  onChange, 
  placeholder = "Select class...",
  error,
  disabled = false,
  multiple = false,
  groupedView = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Handle both single and multiple selection modes
  const selectedClasses = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);
  
  // Get selected class objects
  const selectedClassObjects = getClassesByCodes(selectedClasses);

  // Filter classes based on search term
  const filteredClasses = CLASS_OPTIONS.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get grouped classes if groupedView is enabled
  const groupedClasses = groupedView ? getGroupedClasses() : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleClassToggle = (classCode) => {
    if (disabled) return;

    if (multiple) {
      // Multiple selection mode
      let newSelection;
      if (selectedClasses.includes(classCode)) {
        // Remove class
        newSelection = selectedClasses.filter(code => code !== classCode);
      } else {
        // Add class
        newSelection = [...selectedClasses, classCode];
      }
      onChange?.(newSelection);
    } else {
      // Single selection mode
      if (selectedClasses.includes(classCode)) {
        // Deselect if clicking the same class
        onChange?.(null);
      } else {
        // Select new class
        onChange?.(classCode);
      }
      // Close dropdown after selection in single mode
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleRemoveClass = (classCode, event) => {
    event.stopPropagation();
    if (disabled) return;
    
    if (multiple) {
      const newSelection = selectedClasses.filter(code => code !== classCode);
      onChange?.(newSelection);
    } else {
      onChange?.(null);
    }
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange?.(multiple ? [] : null);
  };

  const renderClassOption = (classItem) => {
    const isSelected = selectedClasses.includes(classItem.code);

    return (
      <div
        key={classItem.code}
        onClick={() => handleClassToggle(classItem.code)}
        className={`
          px-3 py-2 text-sm cursor-pointer flex items-center justify-between
          ${isSelected 
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
        `}
      >
        <span>{classItem.name}</span>
        {isSelected && <FiCheck className="h-4 w-4" />}
      </div>
    );
  };

  const renderGroupedOptions = () => {
    const groups = [
      { key: 'elementary', label: 'Elementary (Lớp 1-5)', classes: groupedClasses.elementary },
      { key: 'secondary', label: 'Secondary (Lớp 6-9)', classes: groupedClasses.secondary },
      { key: 'highSchool', label: 'High School (Lớp 10-12)', classes: groupedClasses.highSchool },
      { key: 'specialized', label: 'Specialized Classes', classes: groupedClasses.specialized },
    ];

    return groups.map(group => {
      const filteredGroupClasses = group.classes.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredGroupClasses.length === 0) return null;

      return (
        <div key={group.key}>
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800">
            {group.label}
          </div>
          {filteredGroupClasses.map(renderClassOption)}
        </div>
      );
    });
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Input */}
      <div
        onClick={handleToggle}
        className={`
          min-h-[42px] px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 cursor-pointer
          flex items-center justify-between gap-2
          ${error 
            ? 'border-red-300 dark:border-red-600' 
            : isOpen
              ? 'border-indigo-500 dark:border-indigo-400 ring-1 ring-indigo-500 dark:ring-indigo-400'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed opacity-60' : ''}
        `}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selectedClassObjects.length > 0 ? (
            multiple ? (
              selectedClassObjects.map(classItem => (
                <span
                  key={classItem.code}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs rounded-md"
                >
                  {classItem.name}
                  {!disabled && (
                    <button
                      onClick={(e) => handleRemoveClass(classItem.code, e)}
                      className="hover:text-indigo-900 dark:hover:text-indigo-200"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-gray-900 dark:text-white text-sm">
                {selectedClassObjects[0].name}
              </span>
            )
          ) : (
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {placeholder}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {selectedClassObjects.length > 0 && !disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
          <FiChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Selection Info */}
      {multiple && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {selectedClasses.length} selected
        </p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {groupedView ? (
              renderGroupedOptions()
            ) : (
              filteredClasses.length > 0 ? (
                filteredClasses.map(renderClassOption)
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No classes found
                </div>
              )
            )}
          </div>

          {/* Footer */}
          {filteredClasses.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {multiple ? `${selectedClasses.length} selected` : (selectedClasses.length > 0 ? '1 selected' : 'None selected')}
                </span>
                {selectedClasses.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Clear {multiple ? 'all' : ''}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassSelector;
