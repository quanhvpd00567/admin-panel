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
import DashboardPage from './pages/admin/Dashboard';
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
import Settings from './pages/admin/Settings';
import FormComponentsDemo from './pages/FormComponentsDemo';
import AuthDemo from './pages/AuthDemo';
import NotFound from './pages/NotFound';

// Import education management pages (Phase 7)
import EducationDashboard from './pages/education/EducationDashboard';

import SubjectList from './pages/education/subjects/SubjectList';
import CreateSubject from './pages/education/subjects/CreateSubject';
import EditSubject from './pages/education/subjects/EditSubject';
import ViewSubject from './pages/education/subjects/ViewSubject';
import ClassList from './pages/education/classes/ClassList';

// Import quiz management pages (Phase 9.1)
import QuizListV1 from './pages/quizzes/QuizListV1';
import EditQuiz from './pages/quizzes/EditQuiz';
import QuizDetail from './pages/quizzes/QuizDetail';
import TakeQuiz from './pages/quizzes/TakeQuiz';
// import MakeQuizzes from './pages/student/MakeQuizzes';
import TakeQuizNature from './pages/quizzes/TakeQuizNature';
import CreateQuizV1 from './pages/quizzes/CreateQuizV1'; // Ensure CreateQuizV1 is imported
import UIPreviewIndex from './pages/UIPreviewIndex';

// Import question management pages (Phase 9.2)
import QuestionList from './pages/questions/QuestionList';
import QuestionForm from './pages/questions/QuestionForm';
import QuestionDetail from './pages/questions/QuestionDetail';

// Import child management pages (Phase 10)
import ChildList from './pages/children/ChildList';
import ChildResults from './pages/children/ChildResults';

// Import AI pages
import { AiDashboard, AiGenerateProcess} from './pages/ai';

// Import route guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import {
  AdminRoute,
  ManagerRoute,
} from './components/auth/RoleGuard';

import studentRoutes from './routes/student_routes';

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
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'ui-preview',
        element: <UIPreviewIndex />,
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
            <DashboardPage />
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

      // Education Management routes (Phase 7)
      {
        path: 'education',
        element: (
          <ManagerRoute>
            <EducationDashboard />
          </ManagerRoute>
        ),
      },
      {
        path: 'subjects',
        children: [
          {
            index: true,
            element: (
              <ManagerRoute>
                <SubjectList />
              </ManagerRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <ManagerRoute>
                <CreateSubject />
              </ManagerRoute>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <ManagerRoute>
                <EditSubject />
              </ManagerRoute>
            ),
          },
          {
            path: ':id',
            element: (
              <ProtectedRoute>
                <ViewSubject />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'classes',
        children: [
          {
            index: true,
            element: (
              <ManagerRoute>
                <ClassList />
              </ManagerRoute>
            ),
          },
        ],
      },

      // Quiz Management routes (Phase 9.1)
      {
        path: 'quizzes',
        children: [
          {
            index: true,
            element: (
              <ManagerRoute>
                <QuizListV1 />
              </ManagerRoute>
            ),
          },
          {
            path: 'create-v1',
            element: (
              <ManagerRoute>
                <CreateQuizV1 />
              </ManagerRoute>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <ManagerRoute>
                <EditQuiz />
              </ManagerRoute>
            ),
          },
          {
            path: ':id',
            element: (
              <ProtectedRoute>
                <QuizDetail />
              </ProtectedRoute>
            ),
          },
          {
            path: 'take/:id',
            element: (
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            ),
          },
          {
            path: 'nature',
            element: (
              <ProtectedRoute>
                <TakeQuizNature />
              </ProtectedRoute>
            ),
          }
        ],
      },

      // Student routes
      ...studentRoutes,
  
      // Quiz Results routes
      {
        path: 'questions',
        children: [
          {
            index: true,
            element: (
              <ManagerRoute>
                <QuestionList />
              </ManagerRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <ManagerRoute>
                <QuestionForm />
              </ManagerRoute>
            ),
          },
          {
            path: ':id',
            element: (
              <ProtectedRoute>
                <QuestionDetail />
              </ProtectedRoute>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <ManagerRoute>
                <QuestionForm />
              </ManagerRoute>
            ),
          },
        ],
      },


      // Child management routes (Phase 10)
      {
        path: 'children',
        children: [
          {
            index: true,
            element: (
              <ManagerRoute>
                <ChildList />
              </ManagerRoute>
            ),
          },
          {
            path: ':id/results',
            element: (
              <ProtectedRoute>
                <ChildResults />
              </ProtectedRoute>
            ),
          }
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

      // AI routes
      {
        path: 'ai',
        element: (
          <ManagerRoute>
            <AiDashboard />
          </ManagerRoute>
        ),
      },
      {
        path: 'ai/generate-process',
        element: (
          <ManagerRoute>
            <AiGenerateProcess />
          </ManagerRoute>
        ),
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
