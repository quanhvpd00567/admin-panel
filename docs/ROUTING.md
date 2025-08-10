# Routing Documentation

## Overview

This project uses React Router v7 for client-side routing. The routing system is designed to be scalable, maintainable, and provides proper navigation structure for the blog admin panel.

## Route Structure

### Public Routes

Routes accessible without authentication:

- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form with token

### Protected Routes

Routes requiring authentication (to be implemented in Phase 2):

- `/dashboard` - Main admin dashboard
- `/profile` - User profile management
- `/settings` - Application settings

### Blog Management Routes

Routes for content management:

- `/posts` - List all blog posts
- `/posts/create` - Create new blog post
- `/posts/edit/:id` - Edit existing post
- `/posts/:id` - View post details

### Content Organization Routes

Routes for organizing content:

- `/categories` - Manage blog categories
- `/tags` - Manage blog tags
- `/media` - Media library and file management

### User Management Routes

Admin-only routes for user management:

- `/users` - List all users
- `/users/create` - Create new user
- `/users/edit/:id` - Edit user details
- `/users/:id` - View user profile

### Error Routes

- `*` (catch-all) - 404 Not Found page

## File Structure

```
src/
├── routes.jsx              # Main router configuration
├── constants/
│   └── routes.js           # Route constants and helpers
└── pages/                  # Page components
    ├── Home.jsx            # Landing page
    ├── Profile.jsx         # User profile
    ├── Media.jsx           # Media management
    ├── NotFound.jsx        # 404 error page
    ├── auth/               # Authentication pages
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── ForgotPassword.jsx
    │   └── ResetPassword.jsx
    ├── admin/              # Admin pages
    │   ├── Dashboard.jsx
    │   ├── Settings.jsx
    │   ├── UserManagement.jsx
    │   ├── CreateUser.jsx
    │   ├── EditUser.jsx
    │   └── ViewUser.jsx
    └── blog/               # Blog management pages
        ├── PostList.jsx
        ├── CreatePost.jsx
        ├── EditPost.jsx
        ├── ViewPost.jsx
        ├── Categories.jsx
        └── Tags.jsx
```

## Route Configuration

### Main Router Setup

```javascript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      // Route definitions...
    ],
  },
]);
```

### Nested Routes

The routing system uses nested routes for better organization:

```javascript
// Posts routes
{
  path: 'posts',
  children: [
    { index: true, element: <PostList /> },
    { path: 'create', element: <CreatePost /> },
    { path: 'edit/:id', element: <EditPost /> },
    { path: ':id', element: <ViewPost /> },
  ],
}

// Users routes
{
  path: 'users',
  children: [
    { index: true, element: <UserManagement /> },
    { path: 'create', element: <CreateUser /> },
    { path: 'edit/:id', element: <EditUser /> },
    { path: ':id', element: <ViewUser /> },
  ],
}
```

## Route Constants

All routes are defined as constants in `src/constants/routes.js` to prevent typos and ensure consistency:

```javascript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  POSTS: '/posts',
  POSTS_CREATE: '/posts/create',
  // ... more routes
};

// Helper functions for dynamic routes
export const buildRoute = {
  postsEdit: id => `/posts/edit/${id}`,
  postsView: id => `/posts/${id}`,
  usersEdit: id => `/users/edit/${id}`,
  usersView: id => `/users/${id}`,
};
```

## Navigation

### Using Link Components

```javascript
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Static routes
<Link to={ROUTES.DASHBOARD}>Dashboard</Link>

// Dynamic routes
<Link to={buildRoute.postsEdit(postId)}>Edit Post</Link>
```

### Programmatic Navigation

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate to route
navigate(ROUTES.DASHBOARD);

// Navigate with state
navigate(ROUTES.LOGIN, { state: { from: location } });

// Go back
navigate(-1);
```

## Route Parameters

### Reading Parameters

```javascript
import { useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams(); // Gets :id from /posts/edit/:id
  // ...
};
```

### Query Parameters

```javascript
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  // ...
};
```

## Error Handling

### 404 Page

The `NotFound` component handles all unmatched routes and provides:

- Clear error message
- Navigation options to common pages
- Back button functionality
- Current path display for debugging

### Error Boundaries

Route-level error boundaries are configured using the `errorElement` prop:

```javascript
{
  path: '/',
  element: <App />,
  errorElement: <NotFound />,
  // ...
}
```

## Access Control (Future Implementation)

Route protection will be implemented in Phase 2 using route guards:

```javascript
// Protected route wrapper (to be implemented)
{
  path: 'dashboard',
  element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
}

// Admin-only route wrapper (to be implemented)
{
  path: 'users',
  element: <AdminRoute><UserManagement /></AdminRoute>,
}
```

## Route Groups

Routes are organized into groups for access control and navigation:

- **PUBLIC**: Accessible without authentication
- **AUTHENTICATED**: Require user login
- **ADMIN_ONLY**: Require admin privileges
- **EDITOR_AND_ADMIN**: Require editor or admin privileges

## Testing Routes

### Development Testing

1. Start the development server: `npm run dev`
2. Navigate to different routes manually
3. Test 404 behavior with invalid URLs
4. Verify parameter passing works correctly

### Build Testing

1. Build the project: `npm run build`
2. Preview the built app: `npm run preview`
3. Test routing in production-like environment

## Future Enhancements

### Phase 2: Authentication System

- Route protection middleware
- Role-based access control
- Redirect after login functionality
- Session management integration

### Phase 3: Layout System

- Nested layout components
- Sidebar navigation integration
- Breadcrumb generation from routes

### Phase 4: Advanced Features

- Route prefetching
- Lazy loading for code splitting
- Route animations/transitions
- Deep linking support

## Best Practices

1. **Use Route Constants**: Always use predefined route constants instead of hardcoded strings
2. **Centralize Route Logic**: Keep all route definitions in one place
3. **Consistent Naming**: Use consistent naming patterns for routes and components
4. **Error Handling**: Provide proper error boundaries and 404 pages
5. **Type Safety**: Consider using TypeScript for better route type safety
6. **Documentation**: Keep route documentation updated as routes change

## Troubleshooting

### Common Issues

1. **Route Not Found**: Check route definition and component import
2. **Parameter Not Passed**: Verify parameter syntax in route definition
3. **Nested Routes**: Ensure parent route has `<Outlet />` component
4. **Build Issues**: Check for missing imports or circular dependencies

### Debug Tools

- React Router DevTools (browser extension)
- Console logging in route components
- Network tab for checking navigation
- React Developer Tools for component tree

---

**Last Updated**: August 10, 2025  
**Phase**: 1 - Project Setup & Foundation  
**Status**: Completed
