/**
 * Mock Utilities
 * Helper functions for mock data services
 */

/**
 * Generate a unique ID with optional prefix
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Generated ID
 */
export const generateId = (prefix = 'id') => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5);
  return `${prefix}-${timestamp}-${randomPart}`;
};

/**
 * Simulate network delay for more realistic mock API responses
 * @param {number} minDelay - Minimum delay in milliseconds (default: 200)
 * @param {number} maxDelay - Maximum delay in milliseconds (default: 800)
 * @returns {Promise} Promise that resolves after the delay
 */
export const simulateNetworkDelay = (minDelay = 200, maxDelay = 800) => {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Generate random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Pick random item from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random item from array
 */
export const randomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate random date between two dates
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Date} Random date
 */
export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Format date to ISO string for consistent API responses
 * @param {Date} date - Date to format
 * @returns {string} ISO string
 */
export const formatDateForAPI = (date) => {
  return date.toISOString();
};

/**
 * Create a paginated response structure
 * @param {Array} items - All items
 * @param {number} page - Current page (1-based)
 * @param {number} limit - Items per page
 * @returns {Object} Paginated response
 */
export const paginate = (items, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);
  
  return {
    data: paginatedItems,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(items.length / limit),
      totalItems: items.length,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(items.length / limit),
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Create a mock API error response
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {string} code - Error code
 * @returns {Error} Mock API error
 */
export const createMockError = (message, status = 400, code = 'MOCK_ERROR') => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};

/**
 * Simulate API success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Success response
 */
export const createSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Calculate statistics from array of objects
 * @param {Array} items - Array of items
 * @param {string} field - Field to calculate stats for
 * @returns {Object} Statistics object
 */
export const calculateStats = (items, field) => {
  if (!items.length) {
    return { min: 0, max: 0, average: 0, sum: 0, count: 0 };
  }
  
  const values = items.map(item => item[field] || 0);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = sum / values.length;
  
  return {
    min,
    max,
    average: Math.round(average * 100) / 100, // Round to 2 decimal places
    sum,
    count: values.length,
  };
};

/**
 * Sort array by multiple criteria
 * @param {Array} items - Items to sort
 * @param {Array} sortBy - Array of {field, direction} objects
 * @returns {Array} Sorted items
 */
export const multiSort = (items, sortBy) => {
  return items.sort((a, b) => {
    for (const { field, direction = 'asc' } of sortBy) {
      const aVal = a[field];
      const bVal = b[field];
      
      let comparison = 0;
      
      if (aVal < bVal) comparison = -1;
      else if (aVal > bVal) comparison = 1;
      
      if (comparison !== 0) {
        return direction === 'desc' ? -comparison : comparison;
      }
    }
    return 0;
  });
};

/**
 * Filter array by multiple criteria
 * @param {Array} items - Items to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered items
 */
export const multiFilter = (items, filters) => {
  return items.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      
      const itemValue = item[key];
      
      // Handle array values (like tags)
      if (Array.isArray(itemValue)) {
        return itemValue.includes(value);
      }
      
      // Handle string search
      if (typeof value === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      
      // Exact match
      return itemValue === value;
    });
  });
};

export default {
  generateId,
  simulateNetworkDelay,
  randomBetween,
  randomFromArray,
  randomDate,
  formatDateForAPI,
  paginate,
  createMockError,
  createSuccessResponse,
  generateSlug,
  calculateStats,
  multiSort,
  multiFilter,
};
