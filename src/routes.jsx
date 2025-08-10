import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';

// Import components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';

// Import placeholder pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/admin/Dashboard';
import PostList from './pages/blog/PostList';
import CreatePost from './pages/blog/CreatePost';
import EditPost from './pages/blog/EditPost';
import ViewPost from './pages/blog/ViewPost';
import UserManagement from './pages/admin/UserManagement';
import CreateUser from './pages/admin/CreateUser';
import EditUser from './pages/admin/EditUser';
import ViewUser from './pages/admin/ViewUser';
import Categories from './pages/blog/Categories';
import Tags from './pages/blog/Tags';
import Media from './pages/Media';
import Profile from './pages/Profile';
import Settings from './pages/admin/Settings';
import FormComponentsDemo from './pages/FormComponentsDemo';
import AuthDemo from './pages/AuthDemo';
import NotFound from './pages/NotFound';

// Import route guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard, { AdminRoute, ManagerRoute } from './components/auth/RoleGuard';

// Define the router configuration with comprehensive route structure
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      // Public routes
      {
        index: true,
        element: <Home />,
      },
      
      // Authentication routes (redirect if already logged in)
      {
        path: 'login',
        element: (
          <ProtectedRoute requireAuth={false}>
            <LoginForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <ProtectedRoute requireAuth={false}>
            <RegisterForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <ProtectedRoute requireAuth={false}>
            <ForgotPasswordForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      
      // Protected routes
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <AdminRoute>
            <Settings />
          </AdminRoute>
        ),
      },
      
      // Blog management routes
      {
        path: 'posts',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <PostList />
              </ProtectedRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <ManagerRoute>
                <CreatePost />
              </ManagerRoute>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <ManagerRoute>
                <EditPost />
              </ManagerRoute>
            ),
          },
          {
            path: ':id',
            element: (
              <ProtectedRoute>
                <ViewPost />
              </ProtectedRoute>
            ),
          },
        ],
      },
      
      // Categories and Tags management
      {
        path: 'categories',
        element: (
          <ManagerRoute>
            <Categories />
          </ManagerRoute>
        ),
      },
      {
        path: 'tags',
        element: (
          <ManagerRoute>
            <Tags />
          </ManagerRoute>
        ),
      },
      
      // Media management
      {
        path: 'media',
        element: (
          <ProtectedRoute>
            <Media />
          </ProtectedRoute>
        ),
      },
      
      // User management routes (Admin only)
      {
        path: 'users',
        children: [
          {
            index: true,
            element: (
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <AdminRoute>
                <CreateUser />
              </AdminRoute>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <AdminRoute>
                <EditUser />
              </AdminRoute>
            ),
          },
          {
            path: ':id',
            element: (
              <AdminRoute>
                <ViewUser />
              </AdminRoute>
            ),
          },
        ],
      },
      
      // Demo routes
      {
        path: 'demo',
        children: [
          {
            path: 'forms',
            element: <FormComponentsDemo />,
          },
          {
            path: 'auth',
            element: <AuthDemo />,
          },
        ],
      },
      
      // Catch all route - 404
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

// Router Provider Component
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
