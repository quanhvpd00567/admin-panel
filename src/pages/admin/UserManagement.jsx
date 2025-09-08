/**
 * User Management Page Component
 * Comprehensive user management interface for administrators
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiUsers, FiSearch, FiPlus, FiEdit3, FiTrash2, 
  FiMoreVertical, FiX, FiUser, FiCalendar,
  FiEye, FiUserCheck, FiUserX, FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { userAPI } from '../../services/userAPI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import ViewUserModal from './ViewUserModal';
import BulkActionModal from './BulkActionModal';
import { showToast } from '../../components/ui/Toast';

// User roles configuration for display
const userRoles = {
  administrator: { name: 'Administrator', badge: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
  parent: { name: 'Parent', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  student: { name: 'Student', badge: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
};

// User statuses configuration for display
const userStatuses = {
  true: { name: 'Active', badge: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  false: { name: 'Inactive', badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load users data
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersResponse, statsResponse] = await Promise.all([
        userAPI.getUsers(filters),
        userAPI.getUserStats()
      ]);
      
      if (usersResponse.success) {
        console.log('Users loaded:', usersResponse.data.users);
        
        setUsers(usersResponse.data.users);
        setPagination(usersResponse.data.pagination);
      } else {
        setError(usersResponse.error);
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load data on component mount and filter changes
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle search input
  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  // Handle sorting
  const handleSort = (column) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle page size change  
  const handlePageSizeChange = (limit) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }));
  };

  // Handle user selection
  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  // Handle user actions
  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.fullName || `${user.firstName} ${user.lastName}`}?`)) {
      try {
        const result = await userAPI.deleteUser(user.id);
        if (result.success) {
          showToast.success(`${user.fullName || `${user.firstName} ${user.lastName}`} deleted successfully`);
          loadUsers();
          setSelectedUsers(prev => prev.filter(id => id !== user.id));
        } else {
          showToast.error(result.error || 'Failed to delete user');
        }
      } catch (err) {
        showToast.error(`Error deleting user: ${err.message}`);
      }
    }
  };

  const handleStatusChange = async (user, newStatus) => {
    try {
      const result = await userAPI.updateUser(user.id, { isActive: newStatus });
      if (result.success) {
        showToast.success(`${user.fullName || `${user.firstName} ${user.lastName}`} status updated`);
        loadUsers();
      } else {
        showToast.error(result.error || 'Failed to update status');
      }
    } catch (err) {
      showToast.error(`Error changing status: ${err.message}`);
    }
  };

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedUsers.length === 0) {
      showToast.warning('Please select users first');
      return;
    }
    setShowBulkModal(true);
  };

  const handleBulkApply = async (actionData) => {
    try {
      const { action, userIds, params } = actionData;
      
      switch (action) {
        case 'delete':
          await userAPI.bulkDeleteUsers(userIds);
          break;
        case 'activate':
          await userAPI.bulkChangeStatus(userIds, 'active');
          break;
        case 'deactivate':
          await userAPI.bulkChangeStatus(userIds, 'inactive');
          break;
        case 'verify_email':
          await userAPI.bulkVerifyEmails(userIds);
          break;
        case 'change_role':
          await userAPI.bulkChangeRole(userIds, params.role);
          break;
        case 'change_status':
          await userAPI.bulkChangeStatus(userIds, params.status);
          break;
        case 'export':
          await userAPI.exportUsers(userIds);
          break;
        default:
          throw new Error('Unknown bulk action');
      }
      
      // Reload users and clear selection
      loadUsers();
      setSelectedUsers([]);
      setShowBulkModal(false);
    } catch (err) {
      throw new Error(`Bulk action failed: ${err.message}`);
    }
  };

  // Render functions
  const renderUserAvatar = (user) => (
    <div className="flex items-center space-x-3">
      <img
        src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=40`}
        alt={user.fullName || `${user.firstName} ${user.lastName}`}
        className="w-10 h-10 rounded-full"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=40`;
        }}
      />
      <div>
        <div className="font-medium text-gray-900 dark:text-white">
          {user.fullName || `${user.firstName} ${user.lastName}`}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {user.email}
        </div>
      </div>
    </div>
  );

  const renderRoleBadge = (role) => (
    <Badge variant="secondary" className={userRoles[role]?.badge}>
      {userRoles[role]?.name || role}
    </Badge>
  );

  const renderStatusBadge = (status) => (
    <Badge variant="secondary" className={userStatuses[status]?.badge}>
      {userStatuses[status]?.name || (status ? 'Active' : 'Inactive')}
    </Badge>
  );

  const renderActionMenu = (user) => (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="p-1"
        onClick={() => {}}
      >
        <FiMoreVertical className="w-4 h-4" />
      </Button>
      
      <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg invisible group-hover:visible group-focus-within:visible z-10">
        <div className="py-1 min-w-[150px]">
          <button
            onClick={() => handleViewUser(user)}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiEye className="w-4 h-4 mr-2" />
            View Details
          </button>
          
          <button
            onClick={() => handleEditUser(user)}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiEdit3 className="w-4 h-4 mr-2" />
            Edit User
          </button>
          
          {user.isActive ? (
            <button
              onClick={() => handleStatusChange(user, false)}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiUserX className="w-4 h-4 mr-2" />
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange(user, true)}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiUserCheck className="w-4 h-4 mr-2" />
              Activate
            </button>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          
          <button
            onClick={() => handleDeleteUser(user)}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            disabled={user.id === currentUser?.id}
          >
            <FiTrash2 className="w-4 h-4 mr-2" />
            Delete User
          </button>
        </div>
      </div>
    </div>
  );

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSortIcon = (column) => {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === 'asc' ? '↑' : '↓';
  };

  // Check if current user has admin permissions
  if (currentUser?.role !== 'administrator') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiUser className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Access Denied
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You need administrator privileges to access user management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users, roles, and permissions
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadUsers}
            disabled={loading}
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={handleCreateUser}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiUsers className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.total || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiUserCheck className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Users
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.active || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiUserX className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Inactive Users
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.inactive || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiCalendar className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                New This Week
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.recentSignups || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Users
            </label>
            <Input
              type="text"
              placeholder="Search by name, email, or department..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
              leftIcon={<FiSearch />}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <Select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              options={[
                { value: '', label: 'All' },
                { value: 'administrator', label: 'Administrator' },
                { value: 'parent', label: 'Parent' },
                { value: 'student', label: 'Student' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <Select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              options={[
                { value: '', label: 'All' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]}
            />
          </div>
        </div>
        
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedUsers.length} user(s) selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkAction}
            >
              Bulk Actions
            </Button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FiX className="w-16 h-16 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Error Loading Users
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={loadUsers}>Try Again</Button>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FiUsers className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Users Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No users match your current filters.
              </p>
              <Button onClick={() => setFilters({ ...filters, search: '', role: '', isActive: '' })}>
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('displayName')}
                  >
                    User {getSortIcon('displayName')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('role')}
                  >
                    Role {getSortIcon('role')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('lastLogin')}
                  >
                    Last Login {getSortIcon('lastLogin')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created {getSortIcon('createdAt')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {renderUserAvatar(user)}
                    </td>
                    <td className="px-6 py-4">
                      {renderRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(user.isActive)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatDate(user.lastLoginAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {renderActionMenu(user)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.limit}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector={true}
            showQuickJumper={pagination.totalPages > 10}
          />
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadUsers}
        />
      )}
      
      {showEditModal && selectedUser && (
        <EditUserModal
          id={selectedUser.id}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={loadUsers}
        />
      )}
      
      {showViewModal && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => {
            setShowViewModal(false);
            setSelectedUser(null);
          }}
          onEdit={(user) => {
            setSelectedUser(user);
            setShowViewModal(false);
            setShowEditModal(true);
          }}
        />
      )}
      
      {showBulkModal && (
        <BulkActionModal
          selectedUsers={users.filter(user => selectedUsers.includes(user.id))}
          onClose={() => setShowBulkModal(false)}
          onApply={handleBulkApply}
        />
      )}
    </div>
  );
};

export default UserManagement;
