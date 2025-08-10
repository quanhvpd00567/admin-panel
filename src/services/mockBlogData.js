/**
 * Mock Blog Data
 * Sample blog posts, categories, and tags for development
 */

import { ROLES } from '../utils/authUtils';

// Mock categories
export const MOCK_CATEGORIES = [
  {
    id: 1,
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech trends and innovations',
    color: '#3B82F6',
    postCount: 12,
    parent: null
  },
  {
    id: 2,
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend and backend development',
    color: '#10B981',
    postCount: 8,
    parent: 1
  },
  {
    id: 3,
    name: 'Design',
    slug: 'design',
    description: 'UI/UX and graphic design',
    color: '#F59E0B',
    postCount: 6,
    parent: null
  },
  {
    id: 4,
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'iOS and Android development',
    color: '#8B5CF6',
    postCount: 4,
    parent: 1
  },
  {
    id: 5,
    name: 'Marketing',
    slug: 'marketing',
    description: 'Digital marketing strategies',
    color: '#EF4444',
    postCount: 3,
    parent: null
  }
];

// Mock tags
export const MOCK_TAGS = [
  { id: 1, name: 'React', slug: 'react', color: '#61DAFB', postCount: 8 },
  { id: 2, name: 'JavaScript', slug: 'javascript', color: '#F7DF1E', postCount: 12 },
  { id: 3, name: 'TypeScript', slug: 'typescript', color: '#3178C6', postCount: 6 },
  { id: 4, name: 'Node.js', slug: 'nodejs', color: '#339933', postCount: 5 },
  { id: 5, name: 'CSS', slug: 'css', color: '#1572B6', postCount: 7 },
  { id: 6, name: 'HTML', slug: 'html', color: '#E34F26', postCount: 4 },
  { id: 7, name: 'Vue.js', slug: 'vuejs', color: '#4FC08D', postCount: 3 },
  { id: 8, name: 'Angular', slug: 'angular', color: '#DD0031', postCount: 2 },
  { id: 9, name: 'Python', slug: 'python', color: '#3776AB', postCount: 4 },
  { id: 10, name: 'AI', slug: 'ai', color: '#FF6B6B', postCount: 3 }
];

// Mock authors
export const MOCK_AUTHORS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@blog.com',
    role: ROLES.ADMIN,
    avatar: null,
    postCount: 8
  },
  {
    id: 2,
    name: 'Manager User',
    email: 'manager@blog.com',
    role: ROLES.MANAGER,
    avatar: null,
    postCount: 6
  },
  {
    id: 3,
    name: 'John Smith',
    email: 'john@blog.com',
    role: ROLES.USER,
    avatar: null,
    postCount: 4
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    email: 'sarah@blog.com',
    role: ROLES.USER,
    avatar: null,
    postCount: 3
  }
];

// Mock blog posts
export const MOCK_POSTS = [
  {
    id: 1,
    title: 'Getting Started with React 19: Complete Guide',
    slug: 'getting-started-react-19-guide',
    excerpt: 'Learn the new features and improvements in React 19, including Server Components, Concurrent Features, and more.',
    content: '<h2>Introduction to React 19</h2><p>React 19 brings exciting new features...</p>',
    featuredImage: '/images/react-19-guide.jpg',
    status: 'published',
    publishDate: new Date('2024-08-08T10:00:00Z'),
    createdAt: new Date('2024-08-07T14:30:00Z'),
    updatedAt: new Date('2024-08-08T09:45:00Z'),
    author: MOCK_AUTHORS[0],
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[0], MOCK_TAGS[1], MOCK_TAGS[2]],
    seo: {
      metaTitle: 'React 19 Complete Guide - New Features & Migration',
      metaDescription: 'Comprehensive guide to React 19 new features, Server Components, and migration tips for developers.',
      keywords: ['react', 'react 19', 'javascript', 'frontend']
    },
    stats: {
      views: 1250,
      likes: 89,
      comments: 12
    }
  },
  {
    id: 2,
    title: 'Modern CSS Techniques for 2024',
    slug: 'modern-css-techniques-2024',
    excerpt: 'Discover the latest CSS features and best practices for modern web development.',
    content: '<h2>CSS Grid and Flexbox</h2><p>Modern layout techniques...</p>',
    featuredImage: '/images/css-techniques.jpg',
    status: 'published',
    publishDate: new Date('2024-08-06T08:00:00Z'),
    createdAt: new Date('2024-08-05T16:20:00Z'),
    updatedAt: new Date('2024-08-06T07:30:00Z'),
    author: MOCK_AUTHORS[1],
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[4], MOCK_TAGS[5]],
    seo: {
      metaTitle: 'Modern CSS Techniques 2024 - Advanced Styling Guide',
      metaDescription: 'Learn the latest CSS techniques including Grid, Flexbox, and modern layout methods for 2024.',
      keywords: ['css', 'web design', 'frontend', '2024']
    },
    stats: {
      views: 980,
      likes: 67,
      comments: 8
    }
  },
  {
    id: 3,
    title: 'Building Scalable Node.js Applications',
    slug: 'building-scalable-nodejs-applications',
    excerpt: 'Learn how to build and scale Node.js applications for production environments.',
    content: '<h2>Architecture Patterns</h2><p>Microservices and monolithic approaches...</p>',
    featuredImage: '/images/nodejs-scalable.jpg',
    status: 'draft',
    publishDate: null,
    createdAt: new Date('2024-08-09T11:15:00Z'),
    updatedAt: new Date('2024-08-10T10:20:00Z'),
    author: MOCK_AUTHORS[0],
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[3], MOCK_TAGS[1]],
    seo: {
      metaTitle: 'Scalable Node.js Applications - Architecture Guide',
      metaDescription: 'Complete guide to building and scaling Node.js applications with best practices and patterns.',
      keywords: ['nodejs', 'scalability', 'backend', 'javascript']
    },
    stats: {
      views: 0,
      likes: 0,
      comments: 0
    }
  },
  {
    id: 4,
    title: 'UI/UX Design Principles for Developers',
    slug: 'ui-ux-design-principles-developers',
    excerpt: 'Essential design principles every developer should know to create better user interfaces.',
    content: '<h2>Design Fundamentals</h2><p>Color theory, typography, and layout...</p>',
    featuredImage: '/images/ui-ux-principles.jpg',
    status: 'published',
    publishDate: new Date('2024-08-04T12:00:00Z'),
    createdAt: new Date('2024-08-03T09:45:00Z'),
    updatedAt: new Date('2024-08-04T11:30:00Z'),
    author: MOCK_AUTHORS[2],
    category: MOCK_CATEGORIES[2],
    tags: [MOCK_TAGS[4], MOCK_TAGS[5]],
    seo: {
      metaTitle: 'UI/UX Design Principles for Developers - Complete Guide',
      metaDescription: 'Learn essential UI/UX design principles to create better user interfaces and user experiences.',
      keywords: ['ui', 'ux', 'design', 'frontend', 'user interface']
    },
    stats: {
      views: 756,
      likes: 45,
      comments: 6
    }
  },
  {
    id: 5,
    title: 'TypeScript Best Practices and Advanced Features',
    slug: 'typescript-best-practices-advanced',
    excerpt: 'Master TypeScript with advanced features, best practices, and real-world examples.',
    content: '<h2>Advanced Types</h2><p>Utility types, conditional types, and more...</p>',
    featuredImage: '/images/typescript-advanced.jpg',
    status: 'published',
    publishDate: new Date('2024-08-02T15:30:00Z'),
    createdAt: new Date('2024-08-01T13:20:00Z'),
    updatedAt: new Date('2024-08-02T14:45:00Z'),
    author: MOCK_AUTHORS[1],
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[2], MOCK_TAGS[1]],
    seo: {
      metaTitle: 'TypeScript Best Practices - Advanced Features Guide',
      metaDescription: 'Master TypeScript with advanced features, utility types, and best practices for enterprise development.',
      keywords: ['typescript', 'javascript', 'types', 'programming']
    },
    stats: {
      views: 1890,
      likes: 156,
      comments: 23
    }
  },
  {
    id: 6,
    title: 'Mobile App Development with React Native',
    slug: 'mobile-app-development-react-native',
    excerpt: 'Complete guide to building cross-platform mobile apps with React Native.',
    content: '<h2>Getting Started</h2><p>Setting up the development environment...</p>',
    featuredImage: '/images/react-native-guide.jpg',
    status: 'archived',
    publishDate: new Date('2024-07-28T10:00:00Z'),
    createdAt: new Date('2024-07-25T16:30:00Z'),
    updatedAt: new Date('2024-07-28T09:15:00Z'),
    author: MOCK_AUTHORS[3],
    category: MOCK_CATEGORIES[3],
    tags: [MOCK_TAGS[0], MOCK_TAGS[1]],
    seo: {
      metaTitle: 'React Native Mobile Development - Complete Guide',
      metaDescription: 'Learn to build cross-platform mobile apps with React Native from setup to deployment.',
      keywords: ['react native', 'mobile', 'ios', 'android', 'cross-platform']
    },
    stats: {
      views: 2340,
      likes: 198,
      comments: 31
    }
  },
  {
    id: 7,
    title: 'Python for Web Development: Django vs FastAPI',
    slug: 'python-web-development-django-fastapi',
    excerpt: 'Compare Django and FastAPI frameworks for Python web development projects.',
    content: '<h2>Framework Comparison</h2><p>Performance, features, and use cases...</p>',
    featuredImage: '/images/python-web-frameworks.jpg',
    status: 'draft',
    publishDate: null,
    createdAt: new Date('2024-08-09T14:00:00Z'),
    updatedAt: new Date('2024-08-10T11:30:00Z'),
    author: MOCK_AUTHORS[2],
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[8], MOCK_TAGS[3]],
    seo: {
      metaTitle: 'Django vs FastAPI - Python Web Framework Comparison',
      metaDescription: 'Detailed comparison of Django and FastAPI for Python web development with pros and cons.',
      keywords: ['python', 'django', 'fastapi', 'web development', 'backend']
    },
    stats: {
      views: 0,
      likes: 0,
      comments: 0
    }
  },
  {
    id: 8,
    title: 'AI and Machine Learning in Web Development',
    slug: 'ai-machine-learning-web-development',
    excerpt: 'Exploring how AI and ML are transforming modern web development practices.',
    content: '<h2>AI Integration</h2><p>APIs, libraries, and practical applications...</p>',
    featuredImage: '/images/ai-web-development.jpg',
    status: 'published',
    publishDate: new Date('2024-08-01T09:00:00Z'),
    createdAt: new Date('2024-07-30T12:15:00Z'),
    updatedAt: new Date('2024-08-01T08:30:00Z'),
    author: MOCK_AUTHORS[0],
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[9], MOCK_TAGS[1]],
    seo: {
      metaTitle: 'AI in Web Development - Machine Learning Integration',
      metaDescription: 'Learn how to integrate AI and machine learning into web applications with practical examples.',
      keywords: ['ai', 'machine learning', 'web development', 'automation']
    },
    stats: {
      views: 3210,
      likes: 287,
      comments: 45
    }
  }
];

// Helper functions for mock API
export const getPosts = (filters = {}) => {
  let filteredPosts = [...MOCK_POSTS];
  
  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.status === filters.status);
  }
  
  // Filter by author
  if (filters.author && filters.author !== 'all') {
    if (filters.author === 'me') {
      // Assume current user is admin (id: 1)
      filteredPosts = filteredPosts.filter(post => post.author.id === 1);
    } else {
      filteredPosts = filteredPosts.filter(post => post.author.id === parseInt(filters.author));
    }
  }
  
  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category.id === parseInt(filters.category));
  }
  
  // Search in title and content
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort posts
  if (filters.sortBy) {
    filteredPosts.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];
      
      if (filters.sortBy === 'author') {
        aValue = a.author.name;
        bValue = b.author.name;
      } else if (filters.sortBy === 'category') {
        aValue = a.category.name;
        bValue = b.category.name;
      }
      
      if (typeof aValue === 'string') {
        return filters.sortOrder === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      return filters.sortOrder === 'desc' 
        ? new Date(bValue) - new Date(aValue)
        : new Date(aValue) - new Date(bValue);
    });
  }
  
  return filteredPosts;
};

export const getPostById = (id) => {
  return MOCK_POSTS.find(post => post.id === parseInt(id));
};

export const getCategories = () => {
  return MOCK_CATEGORIES;
};

export const getTags = () => {
  return MOCK_TAGS;
};

export const getAuthors = () => {
  return MOCK_AUTHORS;
};

export default {
  MOCK_POSTS,
  MOCK_CATEGORIES,
  MOCK_TAGS,
  MOCK_AUTHORS,
  getPosts,
  getPostById,
  getCategories,
  getTags,
  getAuthors
};
