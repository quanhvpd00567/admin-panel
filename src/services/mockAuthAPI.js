/**
 * Mock API Service
 * Simulates backend authentication endpoints for development
 */

import { ROLES } from '../utils/authUtils';
import { userAPI } from './mockUserData';

// Mock user database (minimal login credentials)
const MOCK_USERS = [
  {
    id: 'user-001',
    email: 'admin@blog.com',
    password: 'admin123',
    name: 'Admin User',
    role: ROLES.ADMIN,
    avatar: null,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: 'user-002',
    email: 'manager@blog.com',
    password: 'manager123',
    name: 'Manager User',
    role: ROLES.MANAGER,
    avatar: null,
    createdAt: '2024-01-02T00:00:00Z',
    isActive: true,
  },
  {
    id: 'user-003',
    email: 'user@blog.com',
    password: 'user123',
    name: 'Regular User',
    role: ROLES.USER,
    avatar: null,
    createdAt: '2024-01-03T00:00:00Z',
    isActive: true,
  },
];

// Helper function to create JWT-like token (simplified)
const createMockToken = user => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    })
  );
  const signature = btoa('mock-signature-' + user.id);

  return `${header}.${payload}.${signature}`;
};

// Helper function to simulate API delay
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAuthAPI = {
  // Login endpoint
  login: async (email, password) => {
    await delay(1500); // Simulate network delay

    const user = MOCK_USERS.find(u => u.email === email);

    if (!user) {
      return {
        success: false,
        field: 'email',
        message: 'No account found with this email address',
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        field: 'password',
        message: 'Incorrect password',
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated. Please contact administrator.',
      };
    }

    const token = createMockToken(user);
    const refreshToken = 'mock-refresh-' + user.id + '-' + Date.now();

    // Get full user data from mockUserData
    const fullUserData = await userAPI.getUser(user.id);

    return {
      success: true,
      data: {
        user: fullUserData, // Return complete user data
        token,
        refreshToken,
        expiresIn: 86400, // 24 hours in seconds
      },
    };
  },

  // Register endpoint
  register: async userData => {
    await delay(2000); // Simulate network delay

    const { name, email, password, role = ROLES.USER } = userData;

    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      return {
        success: false,
        field: 'email',
        message: 'An account with this email already exists',
      };
    }

    // Create user in the main user database
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'User';
    
    const newUserData = {
      firstName,
      lastName,
      email,
      password,
      role,
      status: 'active',
      bio: '',
      phone: '',
      department: ''
    };

    const createdUser = await userAPI.createUser(newUserData);

    // Add to login credentials
    const newUser = {
      id: createdUser.id,
      email,
      password,
      name,
      role,
      avatar: null,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    MOCK_USERS.push(newUser);

    return {
      success: true,
      data: {
        user: createdUser, // Return full user data
        message: 'Account created successfully',
      },
    };
  },

  // Refresh token endpoint
  refreshToken: async refreshToken => {
    await delay(500);

    if (!refreshToken || !refreshToken.startsWith('mock-refresh-')) {
      return {
        success: false,
        message: 'Invalid refresh token',
      };
    }

    // Extract user ID from refresh token
    const tokenParts = refreshToken.split('-');
    const userId = tokenParts.slice(2, -1).join('-'); // Handle user-001 format
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const newToken = createMockToken(user);
    const newRefreshToken = 'mock-refresh-' + user.id + '-' + Date.now();

    return {
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 86400,
      },
    };
  },

  // Logout endpoint
  logout: async token => {
    await delay(300);

    // In a real API, you would invalidate the token
    return {
      success: true,
      message: 'Logged out successfully',
    };
  },

  // Get current user endpoint
  me: async token => {
    await delay(500);

    if (!token) {
      return {
        success: false,
        message: 'No token provided',
      };
    }

    try {
      // Decode mock token
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(atob(parts[1]));
      const user = MOCK_USERS.find(u => u.id === payload.sub);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid token',
      };
    }
  },

  // Forgot password endpoint
  forgotPassword: async email => {
    await delay(2000);

    const user = MOCK_USERS.find(u => u.email === email);

    if (!user) {
      return {
        success: false,
        field: 'email',
        message: 'No account found with this email address',
      };
    }

    return {
      success: true,
      message: 'Password reset link sent to your email',
    };
  },
};

export default mockAuthAPI;
