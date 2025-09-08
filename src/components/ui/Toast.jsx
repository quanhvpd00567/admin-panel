/**
 * Toast Component
 * Notification component for success, error, warning, and info messages
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { FiCheck, FiX, FiAlertTriangle, FiInfo, FiXCircle } from 'react-icons/fi';

// Toast Context
const ToastContext = createContext();

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now()
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Item Component
const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = () => {
    const baseStyles = `
      relative flex items-start space-x-3 p-4 rounded-lg border shadow-lg 
      transform transition-all duration-300 ease-in-out max-w-md w-full
      ${isVisible && !isRemoving 
        ? 'translate-x-0 opacity-100' 
        : 'translate-x-full opacity-0'
      }
    `;

    const typeStyles = {
      success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
    };

    return `${baseStyles} ${typeStyles[toast.type] || typeStyles.info}`;
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0 mt-0.5";
    
    switch (toast.type) {
      case 'success':
        return <FiCheck className={`${iconClass} text-green-600 dark:text-green-400`} />;
      case 'error':
        return <FiXCircle className={`${iconClass} text-red-600 dark:text-red-400`} />;
      case 'warning':
        return <FiAlertTriangle className={`${iconClass} text-yellow-600 dark:text-yellow-400`} />;
      case 'info':
      default:
        return <FiInfo className={`${iconClass} text-blue-600 dark:text-blue-400`} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-relaxed">
          {toast.message}
        </p>
      </div>
      
      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

// Convenience function for showing toasts
export const showToast = {
  success: (message, duration) => {
    if (typeof window !== 'undefined' && window.__toastProvider) {
      return window.__toastProvider.addToast(message, 'success', duration);
    }
    console.log('Success:', message);
  },
  
  error: (message, duration) => {
    if (typeof window !== 'undefined' && window.__toastProvider) {
      return window.__toastProvider.addToast(message, 'error', duration);
    }
    console.error('Error:', message);
  },
  
  warning: (message, duration) => {
    if (typeof window !== 'undefined' && window.__toastProvider) {
      return window.__toastProvider.addToast(message, 'warning', duration);
    }
    console.warn('Warning:', message);
  },
  
  info: (message, duration) => {
    if (typeof window !== 'undefined' && window.__toastProvider) {
      return window.__toastProvider.addToast(message, 'info', duration);
    }
    console.info('Info:', message);
  }
};

// Enhanced ToastProvider that registers global access
export const EnhancedToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now()
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Register global access
  useEffect(() => {
    window.__toastProvider = {
      addToast,
      removeToast,
      removeAllToasts
    };

    return () => {
      delete window.__toastProvider;
    };
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export default ToastItem;
