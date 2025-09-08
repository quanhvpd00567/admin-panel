// Services Main Index
// Centralized exports for all API services

// Authentication & Users
export { authAPI } from './authAPI';
export { userAPI } from './userAPI';

// Content Management  
export { default as mockBlogData } from './mockBlogData';

// Education System
export { subjectAPI } from './subjectAPI';
export { classAPI } from './classAPI';

// Questions & Quizzes
export { questionAPI } from './questions/questionAPI';
export { feedbackAPI } from './questions/feedbackAPI'; 
export { quizAPI } from './quizzes/quizAPI';

// Mock Data Services
export { default as mockAnalyticsData } from './mockAnalyticsData';
export { default as mockUserData } from './mockUserData';
export { default as mockAuthAPI } from './mockAuthAPI';

// Education Mock Data
export * from './education';
