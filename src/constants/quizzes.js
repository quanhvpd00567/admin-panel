/**
 * Quiz Constants
 * Defines quiz types, statuses, difficulty levels, and related configurations
 */

// Quiz Types
export const QUIZ_TYPES = [
  { value: 'practice', label: 'Practice Quiz' },
  { value: 'exam', label: 'Exam' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'survey', label: 'Survey' }
];

// Quiz Status
export const QUIZ_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
];

// Quiz Difficulty Levels (same as questions for consistency)
export const QUIZ_DIFFICULTY = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

// Quiz Settings Defaults
export const DEFAULT_QUIZ_SETTINGS = {
  timeLimit: 60, // minutes
  attempts: 1,
  randomizeQuestions: false,
  randomizeAnswers: false,
  showResults: 'immediate', // immediate, after_deadline, never
  allowReview: true,
  requireLogin: true,
  passingScore: 60, // percentage
  allowLateSubmission: false,
  isPublic: false,
};

// Quiz Availability Settings
export const QUIZ_RESULT_VISIBILITY = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'after_deadline', label: 'After Deadline' },
  { value: 'never', label: 'Never' }
];

// Helper functions
export const getQuizTypeLabel = (value) => {
  const type = QUIZ_TYPES.find(type => type.value === value);
  return type ? type.label : value;
};

export const getQuizStatusLabel = (value) => {
  const status = QUIZ_STATUS.find(status => status.value === value);
  return status ? status.label : value;
};

export const getQuizDifficultyLabel = (value) => {
  const difficulty = QUIZ_DIFFICULTY.find(diff => diff.value === value);
  return difficulty ? difficulty.label : value;
};

export const getQuizStatusColor = (status) => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'published': return 'bg-green-100 text-green-800';
    case 'archived': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getQuizDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Quiz validation rules
export const QUIZ_VALIDATION = {
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 200,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_TIME_LIMIT: 5, // minutes
  MAX_TIME_LIMIT: 480, // 8 hours
  MIN_ATTEMPTS: 1,
  MAX_ATTEMPTS: 10,
  MIN_PASSING_SCORE: 0,
  MAX_PASSING_SCORE: 100,
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 100,
};

// Quiz permissions
export const QUIZ_PERMISSIONS = {
  CREATE: 'quiz:create',
  READ: 'quiz:read', 
  UPDATE: 'quiz:update',
  DELETE: 'quiz:delete',
  PUBLISH: 'quiz:publish',
  ARCHIVE: 'quiz:archive',
  MANAGE_QUESTIONS: 'quiz:manage_questions',
  VIEW_STATS: 'quiz:view_stats',
  BULK_OPERATIONS: 'quiz:bulk_operations',
};

export default {
  QUIZ_TYPES,
  QUIZ_STATUS,
  QUIZ_DIFFICULTY,
  DEFAULT_QUIZ_SETTINGS,
  QUIZ_RESULT_VISIBILITY,
  getQuizTypeLabel,
  getQuizStatusLabel,
  getQuizDifficultyLabel,
  getQuizStatusColor,
  getQuizDifficultyColor,
  QUIZ_VALIDATION,
  QUIZ_PERMISSIONS,
};
