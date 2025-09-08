/**
 * Pagination Component
 * Reusable pagination component for tables and lists
 */

import React from 'react';
import Button from './Button';
import Select from './Select';

const Pagination = ({
  current = 1,
  total = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  showSizeChanger = true,
  showQuickJumper = false,
  showTotal = true,
  pageSizeOptions = [5, 10, 20, 50],
  className = "",
  disabled = false
}) => {
  const totalPages = Math.ceil(total / pageSize);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== current && !disabled) {
      onPageChange?.(page);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if (!disabled) {
      onPageSizeChange?.(parseInt(newPageSize));
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (total === 0) {
    return null;
  }

  return (
    <div className={`flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Left side - Info and page size selector */}
      <div className="flex items-center gap-4">
        {showTotal && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((current - 1) * pageSize) + 1} to{' '}
            {Math.min(current * pageSize, total)} of{' '}
            {total} items
          </div>
        )}
        
        {showSizeChanger && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
            <Select 
              value={pageSize.toString()} 
              onValueChange={handlePageSizeChange}
              className="w-20"
              disabled={disabled}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size.toString()}>{size}</option>
              ))}
            </Select>
          </div>
        )}
      </div>

      {/* Right side - Navigation */}
      <div className="flex items-center gap-2">
        {/* First button */}
        <Button
          variant="outline"
          size="sm"
          disabled={current === 1 || disabled}
          onClick={() => handlePageChange(1)}
        >
          First
        </Button>

        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          disabled={current === 1 || disabled}
          onClick={() => handlePageChange(current - 1)}
        >
          Previous
        </Button>

        {/* Page numbers */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-gray-400">...</span>
                ) : (
                  <Button
                    variant={page === current ? "primary" : "outline"}
                    size="sm"
                    disabled={disabled}
                    onClick={() => handlePageChange(page)}
                    className="min-w-[32px]"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          disabled={current >= totalPages || disabled}
          onClick={() => handlePageChange(current + 1)}
        >
          Next
        </Button>

        {/* Last button */}
        <Button
          variant="outline"
          size="sm"
          disabled={current >= totalPages || disabled}
          onClick={() => handlePageChange(totalPages)}
        >
          Last
        </Button>

        {/* Quick jumper */}
        {showQuickJumper && totalPages > 5 && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Go to:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                    e.target.value = '';
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
