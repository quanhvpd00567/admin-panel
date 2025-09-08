/**
 * Mock Subject Data Service
 * Provides simulated subject management functionality
 */

import { generateId, simulateNetworkDelay } from '../../utils/mockUtils';

// Subject categories for classification
export const SUBJECT_CATEGORIES = {
  TECHNOLOGY: 'technology',
  SCIENCE: 'science',
  ARTS: 'arts',
  BUSINESS: 'business',
  LANGUAGE: 'language',
  MATHEMATICS: 'mathematics',
  OTHER: 'other',
};

// Subject difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// Subject status options
export const SUBJECT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
};

// Mock subjects data
export const mockSubjects = [
  {
    id: 'subj-001',
    name: 'Introduction to Web Development',
    slug: 'intro-web-development',
    description: 'Learn the fundamentals of modern web development including HTML, CSS, JavaScript, and responsive design. This comprehensive course covers everything from basic web structure to advanced frontend frameworks.',
    category: SUBJECT_CATEGORIES.TECHNOLOGY,
    status: SUBJECT_STATUS.ACTIVE,
    thumbnail: '/images/subjects/web-development.jpg',
    duration: 120, // hours
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    prerequisites: [],
    tags: ['html', 'css', 'javascript', 'responsive', 'frontend'],
    metadata: {
      classCount: 5,
      totalStudents: 150,
      completionRate: 85,
      averageRating: 4.6,
    },
    instructor: {
      id: 'inst-001',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      avatar: '/images/instructors/sarah-chen.jpg',
    },
    createdBy: 'admin-001',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-08-10'),
    publishedAt: new Date('2025-02-01'),
  },
  {
    id: 'subj-002',
    name: 'Advanced React Development',
    slug: 'advanced-react-development',
    description: 'Deep dive into React ecosystem including hooks, context, performance optimization, testing, and modern state management solutions.',
    category: SUBJECT_CATEGORIES.TECHNOLOGY,
    status: SUBJECT_STATUS.ACTIVE,
    thumbnail: '/images/subjects/react-advanced.jpg',
    duration: 80,
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    prerequisites: ['subj-001'],
    tags: ['react', 'hooks', 'context', 'performance', 'testing'],
    metadata: {
      classCount: 3,
      totalStudents: 75,
      completionRate: 78,
      averageRating: 4.8,
    },
    instructor: {
      id: 'inst-002',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@example.com',
      avatar: '/images/instructors/mike-rodriguez.jpg',
    },
    createdBy: 'admin-001',
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-08-05'),
    publishedAt: new Date('2025-03-15'),
  },
  {
    id: 'subj-003',
    name: 'Digital Marketing Fundamentals',
    slug: 'digital-marketing-fundamentals',
    description: 'Comprehensive introduction to digital marketing strategies, social media marketing, SEO, content marketing, and analytics.',
    category: SUBJECT_CATEGORIES.BUSINESS,
    status: SUBJECT_STATUS.ACTIVE,
    thumbnail: '/images/subjects/digital-marketing.jpg',
    duration: 60,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    prerequisites: [],
    tags: ['marketing', 'seo', 'social-media', 'analytics', 'content'],
    metadata: {
      classCount: 4,
      totalStudents: 200,
      completionRate: 92,
      averageRating: 4.5,
    },
    instructor: {
      id: 'inst-003',
      name: 'Jennifer Park',
      email: 'jennifer.park@example.com',
      avatar: '/images/instructors/jennifer-park.jpg',
    },
    createdBy: 'admin-001',
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-07-20'),
    publishedAt: new Date('2025-02-25'),
  },
  {
    id: 'subj-004',
    name: 'Data Science with Python',
    slug: 'data-science-python',
    description: 'Learn data analysis, visualization, and machine learning using Python. Covers pandas, numpy, matplotlib, and scikit-learn.',
    category: SUBJECT_CATEGORIES.SCIENCE,
    status: SUBJECT_STATUS.ACTIVE,
    thumbnail: '/images/subjects/data-science.jpg',
    duration: 100,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    prerequisites: [],
    tags: ['python', 'data-science', 'pandas', 'machine-learning', 'visualization'],
    metadata: {
      classCount: 2,
      totalStudents: 60,
      completionRate: 70,
      averageRating: 4.7,
    },
    instructor: {
      id: 'inst-004',
      name: 'Dr. Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      avatar: '/images/instructors/ahmed-hassan.jpg',
    },
    createdBy: 'admin-001',
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-08-01'),
    publishedAt: new Date('2025-04-15'),
  },
  {
    id: 'subj-005',
    name: 'UI/UX Design Principles',
    slug: 'ui-ux-design-principles',
    description: 'Master the fundamentals of user interface and user experience design. Learn design thinking, prototyping, and usability testing.',
    category: SUBJECT_CATEGORIES.ARTS,
    status: SUBJECT_STATUS.DRAFT,
    thumbnail: '/images/subjects/ui-ux-design.jpg',
    duration: 75,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    prerequisites: [],
    tags: ['design', 'ui', 'ux', 'prototyping', 'figma'],
    metadata: {
      classCount: 0,
      totalStudents: 0,
      completionRate: 0,
      averageRating: 0,
    },
    instructor: {
      id: 'inst-005',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@example.com',
      avatar: '/images/instructors/lisa-thompson.jpg',
    },
    createdBy: 'admin-001',
    createdAt: new Date('2025-07-01'),
    updatedAt: new Date('2025-08-12'),
    publishedAt: null,
  },
];

// Statistics for dashboard
export const mockSubjectStats = {
  total: mockSubjects.length,
  active: mockSubjects.filter(s => s.status === SUBJECT_STATUS.ACTIVE).length,
  draft: mockSubjects.filter(s => s.status === SUBJECT_STATUS.DRAFT).length,
  inactive: mockSubjects.filter(s => s.status === SUBJECT_STATUS.INACTIVE).length,
  totalStudents: mockSubjects.reduce((sum, s) => sum + s.metadata.totalStudents, 0),
  averageRating: mockSubjects.reduce((sum, s) => sum + s.metadata.averageRating, 0) / mockSubjects.length,
  totalClasses: mockSubjects.reduce((sum, s) => sum + s.metadata.classCount, 0),
};

// Mock Subject Service
export const mockSubjectService = {
  // Get all subjects with optional filtering
  getSubjects: async (filters = {}) => {
    await simulateNetworkDelay();
    
    let filteredSubjects = [...mockSubjects];
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      filteredSubjects = filteredSubjects.filter(s => s.category === filters.category);
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredSubjects = filteredSubjects.filter(s => s.status === filters.status);
    }
    
    if (filters.difficulty && filters.difficulty !== 'all') {
      filteredSubjects = filteredSubjects.filter(s => s.difficulty === filters.difficulty);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredSubjects = filteredSubjects.filter(s => 
        s.name.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredSubjects.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'created':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'students':
            return b.metadata.totalStudents - a.metadata.totalStudents;
          case 'rating':
            return b.metadata.averageRating - a.metadata.averageRating;
          default:
            return 0;
        }
      });
    }
    
    return {
      subjects: filteredSubjects,
      total: filteredSubjects.length,
      stats: mockSubjectStats,
    };
  },

  // Get single subject by ID
  getSubject: async (id) => {
    await simulateNetworkDelay();
    const subject = mockSubjects.find(s => s.id === id);
    if (!subject) {
      throw new Error(`Subject with ID ${id} not found`);
    }
    return subject;
  },

  // Create new subject
  createSubject: async (subjectData) => {
    await simulateNetworkDelay();
    
    const newSubject = {
      ...subjectData,
      id: generateId('subj'),
      slug: subjectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      metadata: {
        classCount: 0,
        totalStudents: 0,
        completionRate: 0,
        averageRating: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: subjectData.status === SUBJECT_STATUS.ACTIVE ? new Date() : null,
    };
    
    mockSubjects.push(newSubject);
    return newSubject;
  },

  // Update existing subject
  updateSubject: async (id, subjectData) => {
    await simulateNetworkDelay();
    
    const index = mockSubjects.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Subject with ID ${id} not found`);
    }
    
    const updatedSubject = {
      ...mockSubjects[index],
      ...subjectData,
      updatedAt: new Date(),
    };
    
    // Update published date if status changed to active
    if (subjectData.status === SUBJECT_STATUS.ACTIVE && mockSubjects[index].status !== SUBJECT_STATUS.ACTIVE) {
      updatedSubject.publishedAt = new Date();
    }
    
    mockSubjects[index] = updatedSubject;
    return updatedSubject;
  },

  // Delete subject
  deleteSubject: async (id) => {
    await simulateNetworkDelay();
    
    const index = mockSubjects.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Subject with ID ${id} not found`);
    }
    
    // Check if subject has associated classes
    const hasClasses = mockSubjects[index].metadata.classCount > 0;
    if (hasClasses) {
      throw new Error('Cannot delete subject with associated classes');
    }
    
    mockSubjects.splice(index, 1);
    return { success: true, message: 'Subject deleted successfully' };
  },

  // Bulk operations
  bulkUpdateSubjects: async (ids, updateData) => {
    await simulateNetworkDelay();
    
    const updatedSubjects = [];
    for (const id of ids) {
      const index = mockSubjects.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSubjects[index] = {
          ...mockSubjects[index],
          ...updateData,
          updatedAt: new Date(),
        };
        updatedSubjects.push(mockSubjects[index]);
      }
    }
    
    return {
      success: true,
      updated: updatedSubjects.length,
      subjects: updatedSubjects,
    };
  },

  // Get subject statistics
  getSubjectStats: async () => {
    await simulateNetworkDelay();
    return mockSubjectStats;
  },

  // Get subjects by instructor
  getSubjectsByInstructor: async (instructorId) => {
    await simulateNetworkDelay();
    return mockSubjects.filter(s => s.instructor.id === instructorId);
  },

  // Search subjects
  searchSubjects: async (query) => {
    await simulateNetworkDelay();
    
    const searchTerm = query.toLowerCase();
    return mockSubjects.filter(s => 
      s.name.toLowerCase().includes(searchTerm) ||
      s.description.toLowerCase().includes(searchTerm) ||
      s.instructor.name.toLowerCase().includes(searchTerm) ||
      s.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  },
};

export default mockSubjectService;
