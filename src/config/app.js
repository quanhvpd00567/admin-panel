/**
 * Application Configuration
 * Centralizes app-wide configuration settings
 */

import { ENV, getConfig } from './env.js'

// Application-wide configuration
export const APP_CONFIG = {
  // Application Info
  name: ENV.APP_NAME,
  version: ENV.APP_VERSION,
  
  // API Configuration
  api: {
    baseUrl: ENV.API_BASE_URL,
    uploadUrl: ENV.UPLOAD_URL,
    timeout: getConfig().apiTimeout,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  // Authentication Configuration
  auth: {
    tokenKey: 'blog_admin_token',
    refreshKey: 'blog_admin_refresh',
    expiresIn: ENV.JWT_EXPIRES_IN,
    loginPath: '/login',
    redirectAfterLogin: '/dashboard',
    redirectAfterLogout: '/login',
  },
  
  // UI Configuration
  ui: {
    theme: 'light', // 'light' | 'dark' | 'system'
    sidebar: {
      defaultCollapsed: false,
      collapsedWidth: 60,
      expandedWidth: 250,
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [5, 10, 20, 50],
    },
    notifications: {
      position: 'top-right',
      duration: 5000,
      maxVisible: 3,
    },
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    documentFormats: ['pdf', 'doc', 'docx'],
  },
  
  // Blog Configuration
  blog: {
    postsPerPage: 12,
    maxTitleLength: 200,
    maxExcerptLength: 500,
    allowedStatuses: ['draft', 'published', 'archived'],
    defaultStatus: 'draft',
    categories: [
      'Technology',
      'Programming',
      'Web Development',
      'Tutorial',
      'News',
      'Tips & Tricks',
    ],
  },
  
  // User Management Configuration
  users: {
    roles: ['admin', 'editor', 'author'],
    defaultRole: 'author',
    maxUsersPerPage: 20,
    passwordMinLength: 8,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },
  
  // Validation Rules
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  
  // Feature Flags
  features: {
    analytics: ENV.ENABLE_ANALYTICS,
    darkMode: true,
    notifications: true,
    comments: true,
    tags: true,
    categories: true,
    drafts: true,
    scheduling: true,
    seo: true,
    socialSharing: true,
  },
  
  // Development Configuration
  development: {
    enableLogs: getConfig().enableLogs,
    enableDevTools: getConfig().enableDevTools,
    enableMockData: getConfig().enableMockData,
    mockDelay: 1000, // Mock API delay in ms
  },
}

// Routes configuration
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Blog management
  POSTS: '/posts',
  POSTS_CREATE: '/posts/create',
  POSTS_EDIT: '/posts/edit/:id',
  POSTS_VIEW: '/posts/:id',
  
  // User management (Admin only)
  USERS: '/users',
  USERS_CREATE: '/users/create',
  USERS_EDIT: '/users/edit/:id',
  USERS_VIEW: '/users/:id',
  
  // Categories and Tags
  CATEGORIES: '/categories',
  TAGS: '/tags',
  
  // Media management
  MEDIA: '/media',
  
  // System
  NOT_FOUND: '/404',
}

// Navigation menu configuration
export const NAVIGATION = {
  main: [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: 'HomeIcon',
      current: false,
      roles: ['admin', 'editor', 'author'],
    },
    {
      name: 'Posts',
      href: ROUTES.POSTS,
      icon: 'DocumentTextIcon',
      current: false,
      roles: ['admin', 'editor', 'author'],
      children: [
        { name: 'All Posts', href: ROUTES.POSTS },
        { name: 'Create New', href: ROUTES.POSTS_CREATE },
      ],
    },
    {
      name: 'Media',
      href: ROUTES.MEDIA,
      icon: 'PhotoIcon',
      current: false,
      roles: ['admin', 'editor', 'author'],
    },
    {
      name: 'Categories',
      href: ROUTES.CATEGORIES,
      icon: 'TagIcon',
      current: false,
      roles: ['admin', 'editor'],
    },
    {
      name: 'Users',
      href: ROUTES.USERS,
      icon: 'UsersIcon',
      current: false,
      roles: ['admin'],
    },
  ],
  user: [
    {
      name: 'Profile',
      href: ROUTES.PROFILE,
      icon: 'UserIcon',
    },
    {
      name: 'Settings',
      href: ROUTES.SETTINGS,
      icon: 'CogIcon',
    },
  ],
}

// Status codes and messages
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
}

export default APP_CONFIG
