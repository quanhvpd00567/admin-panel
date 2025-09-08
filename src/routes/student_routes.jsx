import { StudentMakeQuizzes, StudentQuizResults, StudentAssignedQuizzes } from './../pages/student/index';
import { StudentRoute } from './../components/auth/RoleGuard';

const studentRoutes = [
  {
    path: 'student',
    children: [
      {
        path: 'quizzes/:id',
        element: (
          <StudentRoute>
            <StudentMakeQuizzes />
          </StudentRoute>
        ),
      },
      // quizz results
      {
        path: 'quizzes/:id/results',
        element: (
          <StudentRoute>
            <StudentQuizResults />
          </StudentRoute>
        ),
      },

      {
        path: 'assigned-quizzes',
        element: (
          <StudentRoute>
            <StudentAssignedQuizzes />
          </StudentRoute>
        ),
      },
    ]
  }
];

export default studentRoutes;