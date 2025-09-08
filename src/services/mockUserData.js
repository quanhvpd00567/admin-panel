/**
 * Mock User Data Service
 * Simulates user management API for development
 */

// Generate mock users with realistic data
const generateMockUsers = () => {
  const roles = ['admin', 'manager', 'editor', 'user'];
  const statuses = ['active', 'inactive', 'suspended', 'pending'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design'];
  
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa',
    'William', 'Jessica', 'James', 'Ashley', 'Christopher', 'Amanda', 'Daniel',
    'Stephanie', 'Matthew', 'Jennifer', 'Anthony', 'Elizabeth', 'Mark', 'Deborah'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
  ];

  const users = [];
  
  for (let i = 1; i <= 50; i++) {
    let firstName, lastName, email;
    
    // Use specific data for the first few users to match mockAuthAPI
    if (i === 1) {
      firstName = 'Admin';
      lastName = 'User';
      email = 'admin@blog.com';
    } else if (i === 2) {
      firstName = 'Manager';
      lastName = 'User';
      email = 'manager@blog.com';
    } else if (i === 3) {
      firstName = 'Regular';
      lastName = 'User';
      email = 'user@blog.com';
    } else {
      firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    }
    
    const role = i <= 2 ? 'admin' : i <= 6 ? 'manager' : i <= 15 ? 'editor' : 'user';
    const status = Math.random() > 0.1 ? 'active' : statuses[Math.floor(Math.random() * statuses.length)];
    
    const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
    const lastLogin = status === 'active' 
      ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      : null;

    users.push({
      id: `user-${i.toString().padStart(3, '0')}`,
      email,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&size=150`,
      role,
      status,
      bio: `Experienced ${role} with ${Math.floor(Math.random() * 10) + 1} years in ${departments[Math.floor(Math.random() * departments.length)]}.`,
      phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      timezone: 'America/New_York',
      language: 'en',
      preferences: {
        theme: Math.random() > 0.5 ? 'dark' : 'light',
        notifications: {
          email: Math.random() > 0.3,
          push: Math.random() > 0.5,
          newPosts: Math.random() > 0.4,
          comments: Math.random() > 0.6
        }
      },
      lastLogin,
      emailVerified: Math.random() > 0.1,
      createdAt: createdDate,
      updatedAt: new Date(createdDate.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      createdBy: i === 1 ? null : 'user-001', // First user created by system
      stats: {
        postsCount: Math.floor(Math.random() * 50),
        loginCount: Math.floor(Math.random() * 200) + 10,
        lastActivity: lastLogin
      }
    });
  }

  return users;
};

let mockUsers = generateMockUsers();

// User roles configuration
export const userRoles = {
  admin: {
    name: 'Administrator',
    permissions: ['*'], // All permissions
    color: 'red',
    description: 'Full system access',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  },
  manager: {
    name: 'Content Manager',
    permissions: [
      'posts.create', 'posts.edit', 'posts.delete',
      'categories.manage', 'tags.manage',
      'users.view', 'analytics.view'
    ],
    color: 'blue',
    description: 'Content management access',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  editor: {
    name: 'Editor',
    permissions: [
      'posts.create', 'posts.edit',
      'categories.view', 'tags.view'
    ],
    color: 'green',
    description: 'Content editing access',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  user: {
    name: 'User',
    permissions: [
      'posts.view', 'profile.edit'
    ],
    color: 'gray',
    description: 'Basic user access',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
};

// User status configuration
export const userStatuses = {
  active: {
    name: 'Active',
    color: 'green',
    description: 'Can log in and use system',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  inactive: {
    name: 'Inactive',
    color: 'gray',
    description: 'Account disabled, cannot log in',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  },
  suspended: {
    name: 'Suspended',
    color: 'red',
    description: 'Temporarily blocked',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  },
  pending: {
    name: 'Pending',
    color: 'yellow',
    description: 'Awaiting email verification',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }
};

// Mock API functions
export const userAPI = {
  // Get all users with filtering and pagination
  getUsers: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    let filteredUsers = [...mockUsers];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.department.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Apply status filter
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle date fields
      if (sortBy === 'createdAt' || sortBy === 'lastLogin') {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
        hasNext: endIndex < filteredUsers.length,
        hasPrev: page > 1
      }
    };
  },

  // Get single user by ID
  getUser: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('Getting user with ID:', id);
    console.log('Available users:', mockUsers.slice(0, 3).map(u => ({ id: u.id, email: u.email })));
    
    // Handle different ID formats
    let user = mockUsers.find(u => u.id === id);
    
    // If not found and ID is numeric, try with user-00X format
    if (!user && !isNaN(id)) {
      const formattedId = `user-${String(id).padStart(3, '0')}`;
      user = mockUsers.find(u => u.id === formattedId);
    }
    
    if (!user) {
      console.error('User not found. Looking for ID:', id);
      throw new Error('User not found');
    }
    
    return user;
  },

  // Create new user
  createUser: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validate email uniqueness
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: `user-${String(mockUsers.length + 1).padStart(3, '0')}`,
      ...userData,
      displayName: `${userData.firstName} ${userData.lastName}`,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random&size=150`,
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          newPosts: true,
          comments: true
        }
      },
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user', // In real app, this would be the current user
      stats: {
        postsCount: 0,
        loginCount: 0,
        lastActivity: null
      }
    };

    mockUsers.push(newUser);
    return newUser;
  },

  // Update user
  updateUser: async (id, userData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Validate email uniqueness (exclude current user)
    if (userData.email && mockUsers.some(u => u.email === userData.email && u.id !== id)) {
      throw new Error('Email already exists');
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      displayName: `${userData.firstName || mockUsers[userIndex].firstName} ${userData.lastName || mockUsers[userIndex].lastName}`,
      updatedAt: new Date()
    };

    mockUsers[userIndex] = updatedUser;
    return updatedUser;
  },

  // Delete user
  deleteUser: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Prevent deleting the main admin
    if (mockUsers[userIndex].id === 'user-001') {
      throw new Error('Cannot delete main administrator');
    }

    mockUsers.splice(userIndex, 1);
    return { success: true, message: 'User deleted successfully' };
  },

  // Change user status
  changeUserStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex].status = status;
    mockUsers[userIndex].updatedAt = new Date();
    
    return mockUsers[userIndex];
  },

  // Bulk operations
  bulkOperation: async (userIds, operation, data = {}) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results = [];
    
    for (const id of userIds) {
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        try {
          switch (operation) {
            case 'delete':
              if (mockUsers[userIndex].id === 'user-001') {
                throw new Error('Cannot delete main administrator');
              }
              mockUsers.splice(userIndex, 1);
              results.push({ id, success: true, message: 'Deleted successfully' });
              break;
              
            case 'changeStatus':
              mockUsers[userIndex].status = data.status;
              mockUsers[userIndex].updatedAt = new Date();
              results.push({ id, success: true, message: 'Status updated successfully' });
              break;
              
            case 'changeRole':
              mockUsers[userIndex].role = data.role;
              mockUsers[userIndex].updatedAt = new Date();
              results.push({ id, success: true, message: 'Role updated successfully' });
              break;
              
            default:
              results.push({ id, success: false, message: 'Unknown operation' });
          }
        } catch (error) {
          results.push({ id, success: false, message: error.message });
        }
      } else {
        results.push({ id, success: false, message: 'User not found' });
      }
    }
    
    return {
      results,
      summary: {
        total: userIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };
  },

  // Get user statistics
  getUserStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stats = {
      total: mockUsers.length,
      active: mockUsers.filter(u => u.status === 'active').length,
      inactive: mockUsers.filter(u => u.status === 'inactive').length,
      suspended: mockUsers.filter(u => u.status === 'suspended').length,
      pending: mockUsers.filter(u => u.status === 'pending').length,
      byRole: {
        admin: mockUsers.filter(u => u.role === 'admin').length,
        manager: mockUsers.filter(u => u.role === 'manager').length,
        editor: mockUsers.filter(u => u.role === 'editor').length,
        user: mockUsers.filter(u => u.role === 'user').length
      },
      recentSignups: mockUsers.filter(u => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(u.createdAt) > weekAgo;
      }).length
    };
    
    return stats;
  },

  // Specific bulk operation methods for BulkActionModal
  bulkDeleteUsers: async (userIds) => {
    return await userAPI.bulkOperation(userIds, 'delete');
  },

  bulkChangeStatus: async (userIds, status) => {
    return await userAPI.bulkOperation(userIds, 'changeStatus', { status });
  },

  bulkChangeRole: async (userIds, role) => {
    return await userAPI.bulkOperation(userIds, 'changeRole', { role });
  },

  bulkVerifyEmails: async (userIds) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const results = [];
    for (const id of userIds) {
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        mockUsers[userIndex].emailVerified = true;
        mockUsers[userIndex].updatedAt = new Date();
        results.push({ id, success: true, message: 'Email verified successfully' });
      } else {
        results.push({ id, success: false, message: 'User not found' });
      }
    }
    
    return {
      results,
      summary: {
        total: userIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };
  },

  exportUsers: async (userIds) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const usersToExport = mockUsers.filter(u => userIds.includes(u.id));
    
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Created Date', 'Last Login'];
    const csvRows = [
      headers.join(','),
      ...usersToExport.map(user => [
        user.id,
        `"${user.displayName}"`,
        user.email,
        user.role,
        user.status,
        new Date(user.createdAt).toLocaleDateString(),
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return {
      results: usersToExport.map(u => ({ 
        id: u.id, 
        success: true, 
        message: 'Exported successfully' 
      })),
      summary: {
        total: userIds.length,
        successful: usersToExport.length,
        failed: userIds.length - usersToExport.length
      }
    };
  }
};

export default userAPI;
