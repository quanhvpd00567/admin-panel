/**
 * View User Modal Component
 * Modal for viewing detailed user information
 */

import React from 'react';
import { FiX, FiMail, FiPhone, FiCalendar, FiUser, FiActivity, FiEdit2 } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const ViewUserModal = ({ user, onClose, onEdit }) => {
  const formatDate = (date) => {
    if (!date) return 'Chưa xác định';
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=64`;
              }}
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(user)}
                className="flex items-center"
              >
                <FiEdit2 className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Role */}
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {user.role}
            </Badge>
            <Badge variant="secondary" className={`bg-${user.isActive ? 'green' : 'red'}-100 text-${user.isActive ? 'green' : 'red'}-800 dark:bg-${user.isActive ? 'green' : 'red'}-900 dark:text-${user.isActive ? 'green' : 'red'}-300`}>
              {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
            </Badge>
            {user.emailVerified ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Email đã xác minh
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Email chưa xác minh
              </Badge>
            )}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Thông tin cá nhân</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Họ và tên</p>
                    <p className="text-gray-900 dark:text-white">{user.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Tên đăng nhập</p>
                    <p className="text-gray-900 dark:text-white">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Email</p>
                    <p className="text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Số điện thoại</p>
                      <p className="text-gray-900 dark:text-white">{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Thông tin tài khoản</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Ngày tạo</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiActivity className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left">Lần đăng nhập cuối</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(user.lastLogin)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Giới thiệu</h3>
              <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
