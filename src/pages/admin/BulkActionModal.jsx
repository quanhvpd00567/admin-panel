/**
 * Bulk Actions Modal Component
 * Modal for performing bulk operations on selected users
 */

import React, { useState } from 'react';
import { FiX, FiCheck, FiAlertTriangle, FiUsers, FiUserMinus, FiUserCheck, FiEdit3 } from 'react-icons/fi';
import { userStatuses, userRoles } from '../../services/mockUserData';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { showToast } from '../../components/ui/Toast';

const BULK_ACTIONS = {
  DELETE: 'delete',
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
  VERIFY_EMAIL: 'verify_email',
  CHANGE_ROLE: 'change_role',
  CHANGE_STATUS: 'change_status',
  EXPORT: 'export'
};

const BulkActionModal = ({ selectedUsers, onClose, onApply }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedCount = selectedUsers.length;

  const getActionInfo = (action) => {
    const actions = {
      [BULK_ACTIONS.DELETE]: {
        title: 'Delete Users',
        description: 'Permanently delete the selected users. This action cannot be undone.',
        icon: FiUserMinus,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        confirmText: 'DELETE',
        requiresConfirm: true,
        dangerous: true
      },
      [BULK_ACTIONS.ACTIVATE]: {
        title: 'Activate Users',
        description: 'Change the status of selected users to Active.',
        icon: FiUserCheck,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20'
      },
      [BULK_ACTIONS.DEACTIVATE]: {
        title: 'Deactivate Users',
        description: 'Change the status of selected users to Inactive.',
        icon: FiUserMinus,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
      },
      [BULK_ACTIONS.VERIFY_EMAIL]: {
        title: 'Verify Email Addresses',
        description: 'Mark email addresses as verified for selected users.',
        icon: FiCheck,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20'
      },
      [BULK_ACTIONS.CHANGE_ROLE]: {
        title: 'Change User Roles',
        description: 'Assign a new role to all selected users.',
        icon: FiEdit3,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        requiresInput: true
      },
      [BULK_ACTIONS.CHANGE_STATUS]: {
        title: 'Change User Status',
        description: 'Update the status for all selected users.',
        icon: FiEdit3,
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        requiresInput: true
      },
      [BULK_ACTIONS.EXPORT]: {
        title: 'Export User Data',
        description: 'Download user information for selected users as CSV.',
        icon: FiUsers,
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-700'
      }
    };
    return actions[action];
  };

  const canPerformAction = () => {
    if (!selectedAction) return false;
    
    const actionInfo = getActionInfo(selectedAction);
    
    if (actionInfo.requiresConfirm && confirmInput !== actionInfo.confirmText) {
      return false;
    }
    
    if (selectedAction === BULK_ACTIONS.CHANGE_ROLE && !newRole) {
      return false;
    }
    
    if (selectedAction === BULK_ACTIONS.CHANGE_STATUS && !newStatus) {
      return false;
    }
    
    return true;
  };

  const handleApply = async () => {
    if (!canPerformAction()) return;
    
    setIsProcessing(true);
    
    try {
      const actionData = {
        action: selectedAction,
        userIds: selectedUsers.map(user => user.id),
        params: {}
      };
      
      // Add additional parameters based on action
      if (selectedAction === BULK_ACTIONS.CHANGE_ROLE) {
        actionData.params.role = newRole;
      }
      
      if (selectedAction === BULK_ACTIONS.CHANGE_STATUS) {
        actionData.params.status = newStatus;
      }
      
      await onApply(actionData);
      
      // Show success message
      const actionInfo = getActionInfo(selectedAction);
      showToast.success(`Successfully ${actionInfo.title.toLowerCase()} for ${selectedCount} user(s)`);
      
      onClose();
    } catch (error) {
      showToast.error(`Failed to perform bulk action: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const actionInfo = selectedAction ? getActionInfo(selectedAction) : null;
  const IconComponent = actionInfo?.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FiUsers className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bulk Actions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Perform actions on {selectedCount} selected user{selectedCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selected Users Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Selected Users ({selectedCount})
            </h3>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {selectedUsers.slice(0, 10).map(user => (
                <div
                  key={user.id}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-5 h-5 rounded-full"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=20`;
                    }}
                  />
                  <span className="text-gray-900 dark:text-white">{user.displayName}</span>
                </div>
              ))}
              {selectedCount > 10 && (
                <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-400">
                  +{selectedCount - 10} more
                </div>
              )}
            </div>
          </div>

          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Action
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(BULK_ACTIONS).map(action => {
                const info = getActionInfo(action);
                const Icon = info.icon;
                return (
                  <button
                    key={action}
                    onClick={() => setSelectedAction(action)}
                    className={`
                      flex items-center space-x-3 p-4 rounded-lg border-2 text-left transition-all
                      ${selectedAction === action
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }
                      ${info.dangerous ? 'hover:border-red-300 dark:hover:border-red-600' : ''}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${info.color}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {info.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {info.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action-specific inputs */}
          {selectedAction === BULK_ACTIONS.CHANGE_ROLE && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a role...</option>
                {Object.entries(userRoles).map(([key, role]) => (
                  <option key={key} value={key}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedAction === BULK_ACTIONS.CHANGE_STATUS && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a status...</option>
                {Object.entries(userStatuses).map(([key, status]) => (
                  <option key={key} value={key}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Confirmation Input for Dangerous Actions */}
          {actionInfo?.requiresConfirm && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2 mb-3">
                <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Dangerous Action - Confirmation Required
                </h4>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                This action cannot be undone. Type <strong>{actionInfo.confirmText}</strong> to confirm.
              </p>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={`Type "${actionInfo.confirmText}" to confirm`}
                className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Action Preview */}
          {actionInfo && (
            <div className={`p-4 rounded-lg ${actionInfo.bgColor}`}>
              <div className="flex items-center space-x-2 mb-2">
                <IconComponent className={`w-5 h-5 ${actionInfo.color}`} />
                <h4 className={`font-medium ${actionInfo.color}`}>
                  Action Preview
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedAction === BULK_ACTIONS.DELETE && 
                  `${selectedCount} user(s) will be permanently deleted from the system.`}
                {selectedAction === BULK_ACTIONS.ACTIVATE && 
                  `${selectedCount} user(s) will be set to Active status.`}
                {selectedAction === BULK_ACTIONS.DEACTIVATE && 
                  `${selectedCount} user(s) will be set to Inactive status.`}
                {selectedAction === BULK_ACTIONS.VERIFY_EMAIL && 
                  `Email addresses for ${selectedCount} user(s) will be marked as verified.`}
                {selectedAction === BULK_ACTIONS.CHANGE_ROLE && newRole &&
                  `${selectedCount} user(s) will be assigned the role: ${userRoles[newRole]?.name}`}
                {selectedAction === BULK_ACTIONS.CHANGE_STATUS && newStatus &&
                  `${selectedCount} user(s) will be updated to status: ${userStatuses[newStatus]?.name}`}
                {selectedAction === BULK_ACTIONS.EXPORT && 
                  `User data for ${selectedCount} user(s) will be exported to CSV.`}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!canPerformAction() || isProcessing}
            variant={actionInfo?.dangerous ? "danger" : "primary"}
            loading={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Apply Action'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionModal;
