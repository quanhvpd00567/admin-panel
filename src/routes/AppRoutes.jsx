import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginForm from '../components/auth/LoginForm';
import Unauthorized from '../components/errors/Unauthorized';
import Dashboard from '../pages/Dashboard';
import Education from '../pages/Education';
import StudentPortal from '../pages/student/StudentPortal';
import QuizDetail from '../pages/quizzes/QuizDetail';
import QuizListV1 from '../pages/quizzes/QuizListV1';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['administrator']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quizzes" element={<QuizListV1 />} />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
          <Route path="/education" element={<Education />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student-portal" element={<StudentPortal />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
