/**
 * Mock Class Data Service
 * Provides simulated class management functionality with subject relationships
 */

import { generateId, simulateNetworkDelay } from '../../utils/mockUtils';
import { mockSubjects } from './mockSubjectData';

// Class status options
export const CLASS_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PAUSED: 'paused',
};

// Class visibility options
export const CLASS_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INVITE_ONLY: 'invite-only',
};

// Days of week for scheduling
export const DAYS_OF_WEEK = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
};

// Mock classes data
export const mockClasses = [
  {
    id: 'class-001',
    name: 'Web Development Bootcamp - Fall 2025',
    slug: 'web-dev-bootcamp-fall-2025',
    description: 'Intensive 12-week bootcamp covering full-stack web development. Perfect for beginners looking to start a career in tech.',
    subjectId: 'subj-001',
    subjectName: 'Introduction to Web Development',
    
    // Scheduling
    startDate: new Date('2025-09-15'),
    endDate: new Date('2025-12-15'),
    schedule: {
      days: [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.FRIDAY],
      startTime: '09:00',
      endTime: '12:00',
      timezone: 'UTC+7',
    },
    
    // Enrollment
    capacity: 25,
    enrolledCount: 22,
    waitlistCount: 8,
    
    // Status and management
    status: CLASS_STATUS.ACTIVE,
    visibility: CLASS_VISIBILITY.PUBLIC,
    
    // Content
    syllabus: '<h2>Course Syllabus</h2><p>This comprehensive bootcamp covers...</p>',
    materials: [
      {
        type: 'document',
        title: 'Course Handbook',
        url: '/documents/web-dev-handbook.pdf',
        size: 5242880, // 5MB
      },
      {
        type: 'video',
        title: 'Welcome Video',
        url: '/videos/welcome-bootcamp.mp4',
        size: 104857600, // 100MB
      },
      {
        type: 'link',
        title: 'Online Code Editor',
        url: 'https://codepen.io',
      },
    ],
    
    // Instructor information
    instructor: {
      id: 'inst-001',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      avatar: '/images/instructors/sarah-chen.jpg',
      bio: 'Senior Full-Stack Developer with 8+ years of experience',
    },
    
    // Metadata
    price: 2500,
    currency: 'USD',
    location: 'Online',
    tags: ['bootcamp', 'intensive', 'career-ready', 'beginner-friendly'],
    
    // Analytics
    analytics: {
      viewCount: 1250,
      applicationCount: 45,
      completionRate: 85,
      averageRating: 4.6,
      feedbackCount: 18,
    },
    
    createdBy: 'admin-001',
    createdAt: new Date('2025-07-01'),
    updatedAt: new Date('2025-08-10'),
  },
  {
    id: 'class-002',
    name: 'Advanced React Mastery',
    slug: 'advanced-react-mastery',
    description: 'Deep dive into advanced React patterns, performance optimization, and modern state management solutions.',
    subjectId: 'subj-002',
    subjectName: 'Advanced React Development',
    
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-11-30'),
    schedule: {
      days: [DAYS_OF_WEEK.TUESDAY, DAYS_OF_WEEK.THURSDAY],
      startTime: '18:00',
      endTime: '20:00',
      timezone: 'UTC+7',
    },
    
    capacity: 15,
    enrolledCount: 12,
    waitlistCount: 3,
    
    status: CLASS_STATUS.SCHEDULED,
    visibility: CLASS_VISIBILITY.PUBLIC,
    
    syllabus: '<h2>Advanced React Curriculum</h2><p>Master React hooks, context, and performance...</p>',
    materials: [
      {
        type: 'document',
        title: 'React Advanced Patterns Guide',
        url: '/documents/react-advanced.pdf',
        size: 3145728, // 3MB
      },
      {
        type: 'link',
        title: 'Course GitHub Repository',
        url: 'https://github.com/course/advanced-react',
      },
    ],
    
    instructor: {
      id: 'inst-002',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@example.com',
      avatar: '/images/instructors/mike-rodriguez.jpg',
      bio: 'React Core Team Contributor and Frontend Architect',
    },
    
    price: 1800,
    currency: 'USD',
    location: 'Online',
    tags: ['advanced', 'react', 'performance', 'patterns'],
    
    analytics: {
      viewCount: 680,
      applicationCount: 28,
      completionRate: 0,
      averageRating: 0,
      feedbackCount: 0,
    },
    
    createdBy: 'admin-001',
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-12'),
  },
  {
    id: 'class-003',
    name: 'Digital Marketing Strategy Workshop',
    slug: 'digital-marketing-workshop',
    description: '3-day intensive workshop on creating effective digital marketing strategies for modern businesses.',
    subjectId: 'subj-003',
    subjectName: 'Digital Marketing Fundamentals',
    
    startDate: new Date('2025-09-20'),
    endDate: new Date('2025-09-22'),
    schedule: {
      days: [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY],
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'UTC+7',
    },
    
    capacity: 30,
    enrolledCount: 28,
    waitlistCount: 12,
    
    status: CLASS_STATUS.SCHEDULED,
    visibility: CLASS_VISIBILITY.PUBLIC,
    
    syllabus: '<h2>Workshop Agenda</h2><p>Day 1: Strategy Development<br>Day 2: Implementation<br>Day 3: Analytics & Optimization</p>',
    materials: [
      {
        type: 'document',
        title: 'Marketing Strategy Template',
        url: '/documents/marketing-template.xlsx',
        size: 1048576, // 1MB
      },
    ],
    
    instructor: {
      id: 'inst-003',
      name: 'Jennifer Park',
      email: 'jennifer.park@example.com',
      avatar: '/images/instructors/jennifer-park.jpg',
      bio: 'Digital Marketing Director with 10+ years experience',
    },
    
    price: 800,
    currency: 'USD',
    location: 'New York, NY',
    tags: ['workshop', 'intensive', 'strategy', 'hands-on'],
    
    analytics: {
      viewCount: 950,
      applicationCount: 42,
      completionRate: 0,
      averageRating: 0,
      feedbackCount: 0,
    },
    
    createdBy: 'admin-001',
    createdAt: new Date('2025-07-15'),
    updatedAt: new Date('2025-08-05'),
  },
  {
    id: 'class-004',
    name: 'Data Science Fundamentals',
    slug: 'data-science-fundamentals',
    description: '8-week comprehensive course covering Python, statistics, and machine learning basics.',
    subjectId: 'subj-004',
    subjectName: 'Data Science with Python',
    
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-09-30'),
    schedule: {
      days: [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY],
      startTime: '19:00',
      endTime: '21:00',
      timezone: 'UTC+7',
    },
    
    capacity: 20,
    enrolledCount: 18,
    waitlistCount: 5,
    
    status: CLASS_STATUS.ACTIVE,
    visibility: CLASS_VISIBILITY.PUBLIC,
    
    syllabus: '<h2>Data Science Journey</h2><p>Week 1-2: Python Basics<br>Week 3-4: Data Analysis<br>Week 5-6: Visualization<br>Week 7-8: Machine Learning</p>',
    materials: [
      {
        type: 'document',
        title: 'Python Cheat Sheet',
        url: '/documents/python-cheatsheet.pdf',
        size: 2097152, // 2MB
      },
      {
        type: 'link',
        title: 'Course Jupyter Notebooks',
        url: 'https://colab.research.google.com/drive/course-notebooks',
      },
    ],
    
    instructor: {
      id: 'inst-004',
      name: 'Dr. Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      avatar: '/images/instructors/ahmed-hassan.jpg',
      bio: 'PhD in Computer Science, Data Science Researcher',
    },
    
    price: 1500,
    currency: 'USD',
    location: 'Online',
    tags: ['data-science', 'python', 'statistics', 'ml'],
    
    analytics: {
      viewCount: 720,
      applicationCount: 35,
      completionRate: 75,
      averageRating: 4.7,
      feedbackCount: 14,
    },
    
    createdBy: 'admin-001',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-08-01'),
  },
];

// Statistics for dashboard
export const mockClassStats = {
  total: mockClasses.length,
  active: mockClasses.filter(c => c.status === CLASS_STATUS.ACTIVE).length,
  scheduled: mockClasses.filter(c => c.status === CLASS_STATUS.SCHEDULED).length,
  completed: mockClasses.filter(c => c.status === CLASS_STATUS.COMPLETED).length,
  totalStudents: mockClasses.reduce((sum, c) => sum + c.enrolledCount, 0),
  totalCapacity: mockClasses.reduce((sum, c) => sum + c.capacity, 0),
  averageRating: mockClasses.reduce((sum, c) => sum + c.analytics.averageRating, 0) / mockClasses.length,
  totalRevenue: mockClasses.reduce((sum, c) => sum + (c.price * c.enrolledCount), 0),
};

// Mock Class Service
export const mockClassService = {
  // Get all classes with optional filtering
  getClasses: async (filters = {}) => {
    await simulateNetworkDelay();
    
    let filteredClasses = [...mockClasses];
    
    // Apply filters
    if (filters.subjectId && filters.subjectId !== 'all') {
      filteredClasses = filteredClasses.filter(c => c.subjectId === filters.subjectId);
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredClasses = filteredClasses.filter(c => c.status === filters.status);
    }
    
    if (filters.instructorId && filters.instructorId !== 'all') {
      filteredClasses = filteredClasses.filter(c => c.instructor.id === filters.instructorId);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredClasses = filteredClasses.filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm) ||
        c.subjectName.toLowerCase().includes(searchTerm) ||
        c.instructor.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Date range filter
    if (filters.startDate) {
      filteredClasses = filteredClasses.filter(c => 
        new Date(c.startDate) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filteredClasses = filteredClasses.filter(c => 
        new Date(c.endDate) <= new Date(filters.endDate)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredClasses.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'startDate':
            return new Date(a.startDate) - new Date(b.startDate);
          case 'enrolledCount':
            return b.enrolledCount - a.enrolledCount;
          case 'price':
            return b.price - a.price;
          case 'rating':
            return b.analytics.averageRating - a.analytics.averageRating;
          default:
            return 0;
        }
      });
    }
    
    return {
      classes: filteredClasses,
      total: filteredClasses.length,
      stats: mockClassStats,
    };
  },

  // Get single class by ID
  getClass: async (id) => {
    await simulateNetworkDelay();
    const classItem = mockClasses.find(c => c.id === id);
    if (!classItem) {
      throw new Error(`Class with ID ${id} not found`);
    }
    
    // Include subject information
    const subject = mockSubjects.find(s => s.id === classItem.subjectId);
    return {
      ...classItem,
      subject,
    };
  },

  // Create new class
  createClass: async (classData) => {
    await simulateNetworkDelay();
    
    // Validate subject exists
    const subject = mockSubjects.find(s => s.id === classData.subjectId);
    if (!subject) {
      throw new Error('Subject not found');
    }
    
    const newClass = {
      ...classData,
      id: generateId('class'),
      slug: classData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subjectName: subject.name,
      enrolledCount: 0,
      waitlistCount: 0,
      analytics: {
        viewCount: 0,
        applicationCount: 0,
        completionRate: 0,
        averageRating: 0,
        feedbackCount: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockClasses.push(newClass);
    return newClass;
  },

  // Update existing class
  updateClass: async (id, classData) => {
    await simulateNetworkDelay();
    
    const index = mockClasses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Class with ID ${id} not found`);
    }
    
    // If subject changed, update subject name
    let updatedData = { ...classData };
    if (classData.subjectId && classData.subjectId !== mockClasses[index].subjectId) {
      const subject = mockSubjects.find(s => s.id === classData.subjectId);
      if (!subject) {
        throw new Error('Subject not found');
      }
      updatedData.subjectName = subject.name;
    }
    
    const updatedClass = {
      ...mockClasses[index],
      ...updatedData,
      updatedAt: new Date(),
    };
    
    mockClasses[index] = updatedClass;
    return updatedClass;
  },

  // Delete class
  deleteClass: async (id) => {
    await simulateNetworkDelay();
    
    const index = mockClasses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Class with ID ${id} not found`);
    }
    
    // Check if class has enrolled students
    const hasStudents = mockClasses[index].enrolledCount > 0;
    if (hasStudents) {
      throw new Error('Cannot delete class with enrolled students');
    }
    
    mockClasses.splice(index, 1);
    return { success: true, message: 'Class deleted successfully' };
  },

  // Get classes by subject
  getClassesBySubject: async (subjectId) => {
    await simulateNetworkDelay();
    return mockClasses.filter(c => c.subjectId === subjectId);
  },

  // Enroll student in class
  enrollStudent: async (classId, studentId) => {
    await simulateNetworkDelay();
    
    const classIndex = mockClasses.findIndex(c => c.id === classId);
    if (classIndex === -1) {
      throw new Error('Class not found');
    }
    
    const classItem = mockClasses[classIndex];
    
    // Check capacity
    if (classItem.enrolledCount >= classItem.capacity) {
      // Add to waitlist
      mockClasses[classIndex].waitlistCount += 1;
      return { success: true, waitlisted: true, message: 'Added to waitlist' };
    }
    
    // Enroll student
    mockClasses[classIndex].enrolledCount += 1;
    return { success: true, enrolled: true, message: 'Successfully enrolled' };
  },

  // Unenroll student from class
  unenrollStudent: async (classId, studentId) => {
    await simulateNetworkDelay();
    
    const classIndex = mockClasses.findIndex(c => c.id === classId);
    if (classIndex === -1) {
      throw new Error('Class not found');
    }
    
    mockClasses[classIndex].enrolledCount = Math.max(0, mockClasses[classIndex].enrolledCount - 1);
    
    // Move student from waitlist to enrolled if available
    if (mockClasses[classIndex].waitlistCount > 0) {
      mockClasses[classIndex].waitlistCount -= 1;
      mockClasses[classIndex].enrolledCount += 1;
    }
    
    return { success: true, message: 'Successfully unenrolled' };
  },

  // Get class statistics
  getClassStats: async () => {
    await simulateNetworkDelay();
    return mockClassStats;
  },

  // Get class schedule (calendar view)
  getClassSchedule: async (startDate, endDate) => {
    await simulateNetworkDelay();
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return mockClasses
      .filter(c => {
        const classStart = new Date(c.startDate);
        const classEnd = new Date(c.endDate);
        return classStart <= end && classEnd >= start;
      })
      .map(c => ({
        id: c.id,
        title: c.name,
        start: c.startDate,
        end: c.endDate,
        schedule: c.schedule,
        instructor: c.instructor.name,
        status: c.status,
        enrolledCount: c.enrolledCount,
        capacity: c.capacity,
      }));
  },

  // Bulk operations
  bulkUpdateClasses: async (ids, updateData) => {
    await simulateNetworkDelay();
    
    const updatedClasses = [];
    for (const id of ids) {
      const index = mockClasses.findIndex(c => c.id === id);
      if (index !== -1) {
        mockClasses[index] = {
          ...mockClasses[index],
          ...updateData,
          updatedAt: new Date(),
        };
        updatedClasses.push(mockClasses[index]);
      }
    }
    
    return {
      success: true,
      updated: updatedClasses.length,
      classes: updatedClasses,
    };
  },
};

export default mockClassService;
