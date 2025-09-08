/**
 * Modal Component
 * Reusable modal dialog component
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { FaTimes } from 'react-icons/fa';
import Button from './Button';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  ...props
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose?.();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={clsx(
            'relative w-full transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || onClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}

              {/* Close button */}
              {onClose && (
                <button
                  type="button"
                  className="absolute top-2 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  onClick={onClose}
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-3 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Predefined modal variants
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  ...props
}) => {
  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>
        {cancelText}
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm}>
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
      {...props}
    >
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </Modal>
  );
};

export const AlertModal = ({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  buttonText = 'OK',
  variant = 'primary',
  ...props
}) => {
  const footer = (
    <Button variant={variant} onClick={onClose}>
      {buttonText}
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
      {...props}
    >
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </Modal>
  );
};

export default Modal;
