/**
 * Route Constants
 * Centralized route definitions to prevent typos and ensure consistency
 */

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

  // Categories and Tags
  CATEGORIES: '/categories',
  TAGS: '/tags',

  // Media management
  MEDIA: '/media',

  // User management (Admin only)
  USERS: '/users',
  USERS_CREATE: '/users/create',
  USERS_EDIT: '/users/edit/:id',
  USERS_VIEW: '/users/:id',

  // Demo pages
  FORM_DEMO: '/demo/forms',

  // Error pages
  NOT_FOUND: '/404',
};

// Helper functions to build dynamic routes
export const buildRoute = {
  postsEdit: id => `/posts/edit/${id}`,
  postsView: id => `/posts/${id}`,
  usersEdit: id => `/users/edit/${id}`,
  usersView: id => `/users/${id}`,
  resetPassword: token => `/reset-password?token=${token}`,
};

// Route groups for navigation and access control
export const ROUTE_GROUPS = {
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
  ],

  AUTHENTICATED: [
    ROUTES.DASHBOARD,
    ROUTES.PROFILE,
    ROUTES.POSTS,
    ROUTES.POSTS_CREATE,
    ROUTES.MEDIA,
    ROUTES.SETTINGS,
  ],

  ADMIN_ONLY: [ROUTES.USERS, ROUTES.USERS_CREATE],

  EDITOR_AND_ADMIN: [ROUTES.CATEGORIES, ROUTES.TAGS],
};

// Navigation menu structure
export const NAVIGATION_MENU = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: 'HomeIcon',
    roles: ['admin', 'editor', 'author'],
  },
  {
    name: 'Posts',
    href: ROUTES.POSTS,
    icon: 'DocumentTextIcon',
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
    roles: ['admin', 'editor', 'author'],
  },
  {
    name: 'Categories',
    href: ROUTES.CATEGORIES,
    icon: 'TagIcon',
    roles: ['admin', 'editor'],
  },
  {
    name: 'Tags',
    href: ROUTES.TAGS,
    icon: 'HashtagIcon',
    roles: ['admin', 'editor'],
  },
  {
    name: 'Users',
    href: ROUTES.USERS,
    icon: 'UsersIcon',
    roles: ['admin'],
  },
];

// Breadcrumb configuration
export const BREADCRUMB_CONFIG = {
  [ROUTES.DASHBOARD]: [{ name: 'Dashboard', href: ROUTES.DASHBOARD }],
  [ROUTES.POSTS]: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'Posts', href: ROUTES.POSTS },
  ],
  [ROUTES.POSTS_CREATE]: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'Posts', href: ROUTES.POSTS },
    { name: 'Create', href: ROUTES.POSTS_CREATE },
  ],
  [ROUTES.USERS]: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'Users', href: ROUTES.USERS },
  ],
  [ROUTES.USERS_CREATE]: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'Users', href: ROUTES.USERS },
    { name: 'Create', href: ROUTES.USERS_CREATE },
  ],
  [ROUTES.MEDIA]: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'Media', href: ROUTES.MEDIA },
  ],
  [ROUTES.CATEGORIES]: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'Categories', href: ROUTES.CATEGORIES },
  ],
  [ROUTES.TAGS]: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'Tags', href: ROUTES.TAGS },
  ],
  [ROUTES.SETTINGS]: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'Settings', href: ROUTES.SETTINGS },
  ],
  [ROUTES.PROFILE]: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'Profile', href: ROUTES.PROFILE },
  ],
};

export default ROUTES;
