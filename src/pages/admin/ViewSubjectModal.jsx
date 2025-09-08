/**
 * View Subject Modal Component
 * Modal for viewing subject details in read-only mode
 */

import React, { useState, useEffect } from 'react';
import { 
  FiX, FiEdit2, FiTrash2, FiEye, FiEyeOff, 
  FiBook, FiUsers, FiCalendar, FiBarChart3, FiRefreshCw 
} from 'react-icons/fi';
import { subjectAPI } from '../../services/subjectAPI';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui/Toast';

const ViewSubjectModal = ({ 
  subject, 
  onClose, 
  onEdit, 
  onDelete, 
  onRestore,
  onRefresh 
}) => {
  const [loading, setLoading] = useState(true);
  const [subjectData, setSubjectData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load subject data
  useEffect(() => {
    const loadSubjectData = async () => {
      try {
        setLoading(true);
        
        let data;
        if (typeof subject === 'string') {
          // If subject is an ID, fetch the full data
          const result = await subjectAPI.getSubject(subject);
          if (!result.success) {
            throw new Error(result.error || 'Failed to load subject');
          }
          data = result.data;
        } else {
          // If subject is already an object, use it directly
          data = subject;
        }

        setSubjectData(data);

      } catch (error) {
        console.error('Load subject error:', error);
        showToast.error(`Error loading subject: ${error.message}`);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (subject) {
      loadSubjectData();
    }
  }, [subject, onClose]);

  const handleToggleStatus = async () => {
    try {
      setActionLoading(true);
      
      const subjectId = typeof subject === 'string' ? subject : subject._id;
      
      if (subjectData.isActive) {
        // Soft delete (deactivate)
        const result = await subjectAPI.deleteSubject(subjectId);
        if (result.success) {
          showToast.success('Subject deactivated successfully');
          setSubjectData({ ...subjectData, isActive: false, deletedAt: new Date().toISOString() });
          onRefresh && onRefresh();
        } else {
          throw new Error(result.error || 'Failed to deactivate subject');
        }
      } else {
        // Restore (activate)
        const result = await subjectAPI.restoreSubject(subjectId);
        if (result.success) {
          showToast.success('Subject restored successfully');
          setSubjectData({ ...subjectData, isActive: true, deletedAt: null });
          onRefresh && onRefresh();
        } else {
          throw new Error(result.error || 'Failed to restore subject');
        }
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      showToast.error(`Error: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    onEdit && onEdit(subjectData);
  };

  const handleDelete = () => {
    onDelete && onDelete(subjectData);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex items-center space-x-3">
          <LoadingSpinner />
          <span className="text-gray-900 dark:text-white">Loading subject...</span>
        </div>
      </div>
    );
  }

  if (!subjectData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-medium"
              style={{ backgroundColor: subjectData.color }}
            >
              {subjectData.code?.substring(0, 2) || subjectData.name?.substring(0, 2) || 'SU'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {subjectData.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subjectData.code} • ID: {subjectData._id}
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
          {/* Status Badge */}
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subjectData.isActive 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {subjectData.isActive ? 'Active' : 'Inactive'}
            </span>
            {!subjectData.isActive && subjectData.deletedAt && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Deactivated on {new Date(subjectData.deletedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Description */}
          {subjectData.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </h3>
              <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                {subjectData.description}
              </p>
            </div>
          )}

          {/* Subject Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Subject Code:</span>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {subjectData.code}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Color:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="w-6 h-6 rounded border border-gray-200 dark:border-gray-600"
                      style={{ backgroundColor: subjectData.color }}
                    ></div>
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {subjectData.color}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Icon:</span>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {subjectData.icon}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Statistics
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiBook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-600 dark:text-blue-400">Courses</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                    {subjectData.courseCount || 0}
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-600 dark:text-green-400">Students</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                    {subjectData.studentCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(subjectData.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(subjectData.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <FiRefreshCw className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(subjectData.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(subjectData.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {subjectData.deletedAt && (
                <div className="flex items-center space-x-2">
                  <FiTrash2 className="w-4 h-4 text-red-400" />
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Deleted:</span>
                    <p className="font-medium text-red-600 dark:text-red-400">
                      {new Date(subjectData.deletedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-red-400">
                      {new Date(subjectData.deletedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subject Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Subject Card Preview
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg"
                  style={{ backgroundColor: subjectData.color }}
                >
                  {subjectData.code?.substring(0, 2) || subjectData.name?.substring(0, 2) || 'SU'}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {subjectData.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subjectData.code}
                  </p>
                  {subjectData.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {subjectData.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{subjectData.courseCount || 0} courses</span>
                    <span>{subjectData.studentCount || 0} students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              disabled={actionLoading}
              className={subjectData.isActive ? 'text-red-600 border-red-300 hover:bg-red-50' : 'text-green-600 border-green-300 hover:bg-green-50'}
            >
              {actionLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : subjectData.isActive ? (
                <FiEyeOff className="w-4 h-4 mr-2" />
              ) : (
                <FiEye className="w-4 h-4 mr-2" />
              )}
              {subjectData.isActive ? 'Deactivate' : 'Restore'}
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            
            <Button
              onClick={handleEdit}
              disabled={actionLoading}
            >
              <FiEdit2 className="w-4 h-4 mr-2" />
              Edit Subject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubjectModal;
