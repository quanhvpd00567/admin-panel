import { generateId, simulateNetworkDelay } from '../../utils/mockUtils';
import { QUESTION_TYPES, QUIZ_DIFFICULTY } from './mockQuestionData';

export const QUIZ_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export { QUIZ_DIFFICULTY, QUESTION_TYPES };

export const mockQuizzes = [
  {
    id: 'quiz-001',
    title: 'HTML & CSS Fundamentals Quiz',
    slug: 'html-css-fundamentals-quiz',
    description: 'Test your knowledge of HTML structure and CSS styling basics',
    subjectId: 'subj-001',
    subjectName: 'Introduction to Web Development',
    classId: 'class-001',
    className: 'Web Development Bootcamp - Fall 2025',
    settings: {
      timeLimit: 30, // 30 minutes
      attempts: 3,
      randomizeQuestions: true,
      randomizeAnswers: true,
      showResults: 'immediate',
      allowReview: true,
      requireLogin: true,
      passingScore: 70,
    },
    availability: {
      startDate: new Date('2025-09-20T00:00:00'),
      endDate: new Date('2025-09-27T23:59:59'),
      isPublic: false,
      allowLateSubmission: false,
    },
    questions: [
      {
        id: 'quiz-q-001',
        questionId: 'q-001',
        order: 1,
        points: 10,
        isRequired: true,
      },
      {
        id: 'quiz-q-002',
        questionId: 'q-002',
        order: 2,
        points: 10,
        isRequired: true,
      },
      {
        id: 'quiz-q-003',
        questionId: 'q-003',
        order: 3,
        points: 10,
        isRequired: true,
      },
      {
        id: 'quiz-q-004',
        questionId: 'q-004',
        order: 4,
        points: 15,
        isRequired: true,
      },
      {
        id: 'quiz-q-005',
        questionId: 'q-005',
        order: 5,
        points: 15,
        isRequired: true,
      },
    ],
    stats: {
      totalQuestions: 20,
      totalPoints: 200,
      averageTime: 25, // minutes
      totalAttempts: 145,
      passRate: 78, // percentage
      averageScore: 82.5,
    },
    tags: ['html', 'css', 'web-development', 'frontend'],
    difficulty: QUIZ_DIFFICULTY.BEGINNER,
    category: 'Web Development',
    status: QUIZ_STATUS.PUBLISHED,
    createdBy: 'instructor-001',
    createdAt: new Date('2025-09-15'),
    updatedAt: new Date('2025-09-18'),
    publishedAt: new Date('2025-09-19'),
  },
  {
    id: 'quiz-002',
    title: 'JavaScript ES6+ Features',
    slug: 'javascript-es6-features',
    description: 'Advanced JavaScript concepts including arrow functions, destructuring, and modules',
    subjectId: 'subj-002',
    subjectName: 'Advanced JavaScript Programming',
    classId: 'class-002',
    className: 'Full Stack Development - Spring 2025',
    settings: {
      timeLimit: 45,
      attempts: 2,
      randomizeQuestions: false,
      randomizeAnswers: true,
      showResults: 'after_submission',
      allowReview: true,
      requireLogin: true,
      passingScore: 75,
    },
    availability: {
      startDate: new Date('2025-10-01T00:00:00'),
      endDate: new Date('2025-10-15T23:59:59'),
      isPublic: false,
      allowLateSubmission: true,
    },
    questions: [
      {
        id: 'quiz-q-006',
        questionId: 'q-006',
        order: 1,
        points: 15,
        isRequired: true,
      },
      {
        id: 'quiz-q-007',
        questionId: 'q-007',
        order: 2,
        points: 15,
        isRequired: true,
      },
      {
        id: 'quiz-q-008',
        questionId: 'q-008',
        order: 3,
        points: 20,
        isRequired: true,
      },
    ],
    stats: {
      totalQuestions: 15,
      totalPoints: 225,
      averageTime: 38,
      totalAttempts: 89,
      passRate: 65,
      averageScore: 71.2,
    },
    tags: ['javascript', 'es6', 'advanced', 'programming'],
    difficulty: QUIZ_DIFFICULTY.INTERMEDIATE,
    category: 'Programming',
    status: QUIZ_STATUS.PUBLISHED,
    createdBy: 'instructor-002',
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-22'),
    publishedAt: new Date('2025-09-23'),
  },
  {
    id: 'quiz-003',
    title: 'React Hooks and State Management',
    slug: 'react-hooks-state-management',
    description: 'Comprehensive test on React hooks, context API, and state management patterns',
    subjectId: 'subj-003',
    subjectName: 'React Framework Development',
    classId: 'class-001',
    className: 'Web Development Bootcamp - Fall 2025',
    settings: {
      timeLimit: 60,
      attempts: 1,
      randomizeQuestions: true,
      randomizeAnswers: false,
      showResults: 'after_due',
      allowReview: false,
      requireLogin: true,
      passingScore: 80,
    },
    availability: {
      startDate: new Date('2025-11-01T00:00:00'),
      endDate: new Date('2025-11-08T23:59:59'),
      isPublic: false,
      allowLateSubmission: false,
    },
    questions: [
      {
        id: 'quiz-q-009',
        questionId: 'q-009',
        order: 1,
        points: 20,
        isRequired: true,
      },
      {
        id: 'quiz-q-010',
        questionId: 'q-010',
        order: 2,
        points: 25,
        isRequired: true,
      },
    ],
    stats: {
      totalQuestions: 25,
      totalPoints: 300,
      averageTime: 52,
      totalAttempts: 42,
      passRate: 45,
      averageScore: 68.8,
    },
    tags: ['react', 'hooks', 'state-management', 'advanced'],
    difficulty: QUIZ_DIFFICULTY.ADVANCED,
    category: 'Frontend Frameworks',
    status: QUIZ_STATUS.DRAFT,
    createdBy: 'instructor-001',
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date('2025-10-05'),
    publishedAt: null,
  },
  {
    id: 'quiz-004',
    title: 'Database Design Principles',
    slug: 'database-design-principles',
    description: 'Fundamentals of relational database design, normalization, and SQL basics',
    subjectId: 'subj-004',
    subjectName: 'Database Systems',
    classId: 'class-003',
    className: 'Backend Development Track - Summer 2025',
    settings: {
      timeLimit: 40,
      attempts: 3,
      randomizeQuestions: false,
      randomizeAnswers: true,
      showResults: 'immediate',
      allowReview: true,
      requireLogin: true,
      passingScore: 70,
    },
    availability: {
      startDate: new Date('2025-08-15T00:00:00'),
      endDate: new Date('2025-08-30T23:59:59'),
      isPublic: true,
      allowLateSubmission: true,
    },
    questions: [
      {
        id: 'quiz-q-011',
        questionId: 'q-011',
        order: 1,
        points: 10,
        isRequired: true,
      },
      {
        id: 'quiz-q-012',
        questionId: 'q-012',
        order: 2,
        points: 15,
        isRequired: true,
      },
    ],
    stats: {
      totalQuestions: 18,
      totalPoints: 180,
      averageTime: 35,
      totalAttempts: 156,
      passRate: 82,
      averageScore: 76.4,
    },
    tags: ['database', 'sql', 'normalization', 'design'],
    difficulty: QUIZ_DIFFICULTY.INTERMEDIATE,
    category: 'Database',
    status: QUIZ_STATUS.ARCHIVED,
    createdBy: 'instructor-003',
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-10'),
    publishedAt: new Date('2025-08-14'),
  },
];

export const mockQuizService = {
  getQuizzes: async (filters = {}) => {
    await simulateNetworkDelay();
    
    let filteredQuizzes = [...mockQuizzes];
    
    // Apply filters
    if (filters.subjectId && filters.subjectId !== 'all') {
      filteredQuizzes = filteredQuizzes.filter(q => q.subjectId === filters.subjectId);
    }
    
    if (filters.classId && filters.classId !== 'all') {
      filteredQuizzes = filteredQuizzes.filter(q => q.classId === filters.classId);
    }
    
    if (filters.difficulty && filters.difficulty !== 'all') {
      filteredQuizzes = filteredQuizzes.filter(q => q.difficulty === filters.difficulty);
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredQuizzes = filteredQuizzes.filter(q => q.status === filters.status);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredQuizzes = filteredQuizzes.filter(q => 
        q.title.toLowerCase().includes(searchTerm) ||
        q.description.toLowerCase().includes(searchTerm) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Sorting
    if (filters.sortBy) {
      filteredQuizzes.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'created':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'updated':
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          case 'attempts':
            return b.stats.totalAttempts - a.stats.totalAttempts;
          case 'passRate':
            return b.stats.passRate - a.stats.passRate;
          default:
            return 0;
        }
      });
    }
    
    return {
      quizzes: filteredQuizzes,
      total: filteredQuizzes.length,
      stats: {
        total: mockQuizzes.length,
        published: mockQuizzes.filter(q => q.status === QUIZ_STATUS.PUBLISHED).length,
        draft: mockQuizzes.filter(q => q.status === QUIZ_STATUS.DRAFT).length,
        archived: mockQuizzes.filter(q => q.status === QUIZ_STATUS.ARCHIVED).length,
        totalAttempts: mockQuizzes.reduce((sum, q) => sum + q.stats.totalAttempts, 0),
        averagePassRate: mockQuizzes.reduce((sum, q) => sum + q.stats.passRate, 0) / mockQuizzes.length,
      },
    };
  },

  getQuiz: async (id) => {
    await simulateNetworkDelay();
    const quiz = mockQuizzes.find(q => q.id === id);
    if (!quiz) {
      throw new Error(`Quiz with ID ${id} not found`);
    }
    return quiz;
  },

  createQuiz: async (quizData) => {
    await simulateNetworkDelay();
    
    const newQuiz = {
      ...quizData,
      id: generateId('quiz'),
      slug: quizData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      stats: {
        totalQuestions: quizData.questions?.length || 0,
        totalPoints: quizData.questions?.reduce((sum, q) => sum + q.points, 0) || 0,
        averageTime: 0,
        totalAttempts: 0,
        passRate: 0,
        averageScore: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: quizData.status === QUIZ_STATUS.PUBLISHED ? new Date() : null,
    };
    
    mockQuizzes.push(newQuiz);
    return newQuiz;
  },

  updateQuiz: async (id, quizData) => {
    await simulateNetworkDelay();
    
    const index = mockQuizzes.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error(`Quiz with ID ${id} not found`);
    }
    
    const updatedQuiz = {
      ...mockQuizzes[index],
      ...quizData,
      updatedAt: new Date(),
    };
    
    if (quizData.status === QUIZ_STATUS.PUBLISHED && mockQuizzes[index].status !== QUIZ_STATUS.PUBLISHED) {
      updatedQuiz.publishedAt = new Date();
    }
    
    mockQuizzes[index] = updatedQuiz;
    return updatedQuiz;
  },

  deleteQuiz: async (id) => {
    await simulateNetworkDelay();
    
    const index = mockQuizzes.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error(`Quiz with ID ${id} not found`);
    }
    
    mockQuizzes.splice(index, 1);
    return { success: true, message: 'Quiz deleted successfully' };
  },

  duplicateQuiz: async (id) => {
    await simulateNetworkDelay();
    
    const originalQuiz = mockQuizzes.find(q => q.id === id);
    if (!originalQuiz) {
      throw new Error(`Quiz with ID ${id} not found`);
    }
    
    const duplicatedQuiz = {
      ...originalQuiz,
      id: generateId('quiz'),
      title: `${originalQuiz.title} (Copy)`,
      slug: `${originalQuiz.slug}-copy`,
      status: QUIZ_STATUS.DRAFT,
      publishedAt: null,
      stats: {
        totalQuestions: originalQuiz.stats.totalQuestions,
        totalPoints: originalQuiz.stats.totalPoints,
        averageTime: 0,
        totalAttempts: 0,
        passRate: 0,
        averageScore: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockQuizzes.push(duplicatedQuiz);
    return duplicatedQuiz;
  },

  getQuizzesBySubject: async (subjectId) => {
    await simulateNetworkDelay();
    return mockQuizzes.filter(q => q.subjectId === subjectId);
  },

  getQuizzesByClass: async (classId) => {
    await simulateNetworkDelay();
    return mockQuizzes.filter(q => q.classId === classId);
  },

  bulkUpdate: async (quizIds, updates) => {
    await simulateNetworkDelay();
    
    const updatedQuizzes = [];
    for (const id of quizIds) {
      const index = mockQuizzes.findIndex(q => q.id === id);
      if (index !== -1) {
        mockQuizzes[index] = {
          ...mockQuizzes[index],
          ...updates,
          updatedAt: new Date(),
        };
        updatedQuizzes.push(mockQuizzes[index]);
      }
    }
    
    return {
      success: true,
      updated: updatedQuizzes.length,
      quizzes: updatedQuizzes,
    };
  },

  bulkDelete: async (quizIds) => {
    await simulateNetworkDelay();
    
    let deletedCount = 0;
    for (const id of quizIds) {
      const index = mockQuizzes.findIndex(q => q.id === id);
      if (index !== -1) {
        mockQuizzes.splice(index, 1);
        deletedCount++;
      }
    }
    
    return {
      success: true,
      deleted: deletedCount,
      message: `${deletedCount} quizzes deleted successfully`,
    };
  },

  getQuizStats: async () => {
    await simulateNetworkDelay();
    
    return {
      total: mockQuizzes.length,
      published: mockQuizzes.filter(q => q.status === QUIZ_STATUS.PUBLISHED).length,
      draft: mockQuizzes.filter(q => q.status === QUIZ_STATUS.DRAFT).length,
      archived: mockQuizzes.filter(q => q.status === QUIZ_STATUS.ARCHIVED).length,
      totalAttempts: mockQuizzes.reduce((sum, q) => sum + q.stats.totalAttempts, 0),
      averagePassRate: mockQuizzes.reduce((sum, q) => sum + q.stats.passRate, 0) / mockQuizzes.length,
      byDifficulty: {
        beginner: mockQuizzes.filter(q => q.difficulty === QUIZ_DIFFICULTY.BEGINNER).length,
        intermediate: mockQuizzes.filter(q => q.difficulty === QUIZ_DIFFICULTY.INTERMEDIATE).length,
        advanced: mockQuizzes.filter(q => q.difficulty === QUIZ_DIFFICULTY.ADVANCED).length,
      },
      bySubject: mockQuizzes.reduce((acc, q) => {
        acc[q.subjectId] = (acc[q.subjectId] || 0) + 1;
        return acc;
      }, {}),
    };
  },
};
