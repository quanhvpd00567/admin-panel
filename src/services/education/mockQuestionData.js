import { generateId, simulateNetworkDelay } from '../../utils/mockUtils';

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  MULTIPLE_ANSWER: 'multiple_answer',
};

export const QUIZ_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const mockQuestions = [
  {
    id: 'q-001',
    title: 'HTML Document Structure',
    question: 'Which HTML element is used to define the root of an HTML document?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    content: {
      text: 'Which HTML element is used to define the root of an HTML document?',
      media: null,
      code: null,
    },
    answers: [
      {
        id: 'a-001',
        text: '<html>',
        isCorrect: true,
        explanation: 'The <html> element is the root element that contains all other elements.',
        order: 1,
      },
      {
        id: 'a-002',
        text: '<head>',
        isCorrect: false,
        explanation: 'The <head> element contains metadata, not the root.',
        order: 2,
      },
      {
        id: 'a-003',
        text: '<body>',
        isCorrect: false,
        explanation: 'The <body> element contains visible content, but is not the root.',
        order: 3,
      },
      {
        id: 'a-004',
        text: '<document>',
        isCorrect: false,
        explanation: 'There is no <document> element in HTML.',
        order: 4,
      },
    ],
    points: 10,
    difficulty: QUIZ_DIFFICULTY.BEGINNER,
    estimatedTime: 30, // seconds
    subjectId: 'subj-001',
    subjectName: 'Introduction to Web Development',
    tags: ['html', 'structure', 'basic'],
    category: 'HTML Fundamentals',
    topics: ['HTML Document Structure'],
    analytics: {
      timesUsed: 25,
      correctRate: 85, // percentage
      averageTime: 25, // seconds
      discrimination: 0.7, // good discrimination
    },
    explanation: 'The <html> element is the root element of an HTML page and contains all other HTML elements.',
    references: [
      {
        type: 'url',
        title: 'HTML Document Structure - MDN',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html',
      },
    ],
    createdBy: 'instructor-001',
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-09-01'),
    lastUsed: new Date('2025-09-15'),
    status: 'active',
  },
  {
    id: 'q-002',
    title: 'CSS Box Model',
    question: 'Which CSS property controls the space between the content and the border?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    content: {
      text: 'Which CSS property controls the space between the content and the border?',
      media: null,
      code: {
        language: 'css',
        content: `.box {
  border: 1px solid black;
  /* What property controls space here? */
  width: 200px;
  height: 100px;
}`,
      },
    },
    answers: [
      {
        id: 'a-005',
        text: 'margin',
        isCorrect: false,
        explanation: 'Margin controls space outside the border.',
        order: 1,
      },
      {
        id: 'a-006',
        text: 'padding',
        isCorrect: true,
        explanation: 'Padding controls the space between content and border.',
        order: 2,
      },
      {
        id: 'a-007',
        text: 'border-spacing',
        isCorrect: false,
        explanation: 'Border-spacing is used for table elements.',
        order: 3,
      },
      {
        id: 'a-008',
        text: 'gap',
        isCorrect: false,
        explanation: 'Gap is used in flexbox and grid layouts.',
        order: 4,
      },
    ],
    points: 10,
    difficulty: QUIZ_DIFFICULTY.BEGINNER,
    estimatedTime: 45,
    subjectId: 'subj-001',
    subjectName: 'Introduction to Web Development',
    tags: ['css', 'box-model', 'padding'],
    category: 'CSS Fundamentals',
    topics: ['CSS Box Model'],
    analytics: {
      timesUsed: 32,
      correctRate: 78,
      averageTime: 42,
      discrimination: 0.6,
    },
    explanation: 'The padding property controls the space between an element\'s content and its border.',
    references: [
      {
        type: 'url',
        title: 'CSS Box Model - MDN',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model',
      },
    ],
    createdBy: 'instructor-001',
    createdAt: new Date('2025-08-16'),
    updatedAt: new Date('2025-09-02'),
    lastUsed: new Date('2025-09-16'),
    status: 'active',
  },
  {
    id: 'q-003',
    title: 'JavaScript Data Types',
    question: 'Which of the following are primitive data types in JavaScript?',
    type: QUESTION_TYPES.MULTIPLE_ANSWER,
    content: {
      text: 'Which of the following are primitive data types in JavaScript? (Select all that apply)',
      media: null,
      code: null,
    },
    answers: [
      {
        id: 'a-009',
        text: 'string',
        isCorrect: true,
        explanation: 'String is a primitive data type.',
        order: 1,
      },
      {
        id: 'a-010',
        text: 'number',
        isCorrect: true,
        explanation: 'Number is a primitive data type.',
        order: 2,
      },
      {
        id: 'a-011',
        text: 'object',
        isCorrect: false,
        explanation: 'Object is not a primitive data type.',
        order: 3,
      },
      {
        id: 'a-012',
        text: 'boolean',
        isCorrect: true,
        explanation: 'Boolean is a primitive data type.',
        order: 4,
      },
      {
        id: 'a-013',
        text: 'array',
        isCorrect: false,
        explanation: 'Array is an object type, not primitive.',
        order: 5,
      },
      {
        id: 'a-014',
        text: 'undefined',
        isCorrect: true,
        explanation: 'Undefined is a primitive data type.',
        order: 6,
      },
    ],
    points: 15,
    difficulty: QUIZ_DIFFICULTY.INTERMEDIATE,
    estimatedTime: 60,
    subjectId: 'subj-002',
    subjectName: 'Advanced JavaScript Programming',
    tags: ['javascript', 'data-types', 'primitives'],
    category: 'JavaScript Fundamentals',
    topics: ['Data Types', 'Primitives'],
    analytics: {
      timesUsed: 18,
      correctRate: 65,
      averageTime: 58,
      discrimination: 0.8,
    },
    explanation: 'JavaScript has 7 primitive data types: string, number, boolean, undefined, null, symbol, and bigint.',
    references: [
      {
        type: 'url',
        title: 'JavaScript Data Types - MDN',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures',
      },
    ],
    createdBy: 'instructor-002',
    createdAt: new Date('2025-08-20'),
    updatedAt: new Date('2025-09-05'),
    lastUsed: new Date('2025-09-18'),
    status: 'active',
  },
  {
    id: 'q-004',
    title: 'React Hooks Usage',
    question: 'useState hook returns an array with exactly 2 elements.',
    type: QUESTION_TYPES.TRUE_FALSE,
    content: {
      text: 'useState hook returns an array with exactly 2 elements.',
      media: null,
      code: {
        language: 'javascript',
        content: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
      },
    },
    answers: [
      {
        id: 'a-015',
        text: 'True',
        isCorrect: true,
        explanation: 'useState returns an array with the current state value and a setter function.',
        order: 1,
      },
      {
        id: 'a-016',
        text: 'False',
        isCorrect: false,
        explanation: 'This is incorrect. useState does return exactly 2 elements.',
        order: 2,
      },
    ],
    points: 10,
    difficulty: QUIZ_DIFFICULTY.INTERMEDIATE,
    estimatedTime: 30,
    subjectId: 'subj-003',
    subjectName: 'React Framework Development',
    tags: ['react', 'hooks', 'useState'],
    category: 'React Hooks',
    topics: ['State Management', 'Hooks'],
    analytics: {
      timesUsed: 22,
      correctRate: 90,
      averageTime: 28,
      discrimination: 0.5,
    },
    explanation: 'The useState hook returns an array with exactly two elements: the current state value and a function to update it.',
    references: [
      {
        type: 'url',
        title: 'useState Hook - React Docs',
        url: 'https://react.dev/reference/react/useState',
      },
    ],
    createdBy: 'instructor-001',
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-09-10'),
    lastUsed: new Date('2025-09-20'),
    status: 'active',
  },
  {
    id: 'q-005',
    title: 'Database Normalization',
    question: 'What is the primary goal of database normalization?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    content: {
      text: 'What is the primary goal of database normalization?',
      media: null,
      code: null,
    },
    answers: [
      {
        id: 'a-017',
        text: 'To increase database size',
        isCorrect: false,
        explanation: 'Normalization typically reduces redundancy, not increases size.',
        order: 1,
      },
      {
        id: 'a-018',
        text: 'To eliminate data redundancy and dependency',
        isCorrect: true,
        explanation: 'The main goal is to eliminate redundancy and unwanted dependencies.',
        order: 2,
      },
      {
        id: 'a-019',
        text: 'To make queries slower',
        isCorrect: false,
        explanation: 'Normalization aims to improve data integrity, not slow queries.',
        order: 3,
      },
      {
        id: 'a-020',
        text: 'To increase storage costs',
        isCorrect: false,
        explanation: 'Normalization usually reduces storage requirements.',
        order: 4,
      },
    ],
    points: 15,
    difficulty: QUIZ_DIFFICULTY.ADVANCED,
    estimatedTime: 90,
    subjectId: 'subj-004',
    subjectName: 'Database Systems',
    tags: ['database', 'normalization', 'design'],
    category: 'Database Design',
    topics: ['Normalization', 'Data Modeling'],
    analytics: {
      timesUsed: 15,
      correctRate: 72,
      averageTime: 85,
      discrimination: 0.9,
    },
    explanation: 'Database normalization is the process of organizing data to minimize redundancy and dependency.',
    references: [
      {
        type: 'book',
        title: 'Database System Concepts',
        page: 'Chapter 7',
      },
    ],
    createdBy: 'instructor-003',
    createdAt: new Date('2025-08-25'),
    updatedAt: new Date('2025-09-08'),
    lastUsed: new Date('2025-09-22'),
    status: 'active',
  },
  {
    id: 'q-006',
    title: 'Arrow Functions in ES6',
    question: 'Which of the following correctly defines an arrow function in JavaScript?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    content: {
      text: 'Which of the following correctly defines an arrow function in JavaScript?',
      media: null,
      code: null,
    },
    answers: [
      {
        id: 'a-021',
        text: 'const func = () => { return "hello"; }',
        isCorrect: true,
        explanation: 'This is the correct arrow function syntax.',
        order: 1,
      },
      {
        id: 'a-022',
        text: 'const func = function() => { return "hello"; }',
        isCorrect: false,
        explanation: 'This mixes function declaration with arrow syntax incorrectly.',
        order: 2,
      },
      {
        id: 'a-023',
        text: 'const func => () { return "hello"; }',
        isCorrect: false,
        explanation: 'The arrow is in the wrong position.',
        order: 3,
      },
      {
        id: 'a-024',
        text: 'const func = -> { return "hello"; }',
        isCorrect: false,
        explanation: 'This uses incorrect arrow syntax.',
        order: 4,
      },
    ],
    points: 10,
    difficulty: QUIZ_DIFFICULTY.INTERMEDIATE,
    estimatedTime: 45,
    subjectId: 'subj-002',
    subjectName: 'Advanced JavaScript Programming',
    tags: ['javascript', 'es6', 'arrow-functions'],
    category: 'ES6 Features',
    topics: ['Arrow Functions', 'Function Syntax'],
    analytics: {
      timesUsed: 28,
      correctRate: 82,
      averageTime: 40,
      discrimination: 0.7,
    },
    explanation: 'Arrow functions use the => syntax and provide a more concise way to write functions.',
    references: [
      {
        type: 'url',
        title: 'Arrow Functions - MDN',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
      },
    ],
    createdBy: 'instructor-002',
    createdAt: new Date('2025-09-05'),
    updatedAt: new Date('2025-09-12'),
    lastUsed: new Date('2025-09-25'),
    status: 'active',
  },
  {
    id: 'q-007',
    title: 'CSS Flexbox Properties',
    question: 'Which CSS properties are specific to flexbox containers?',
    type: QUESTION_TYPES.MULTIPLE_ANSWER,
    content: {
      text: 'Which CSS properties are specific to flexbox containers? (Select all that apply)',
      media: null,
      code: {
        language: 'css',
        content: `.flex-container {
  display: flex;
  /* Which properties work here? */
}`,
      },
    },
    answers: [
      {
        id: 'a-025',
        text: 'justify-content',
        isCorrect: true,
        explanation: 'justify-content is used to align flex items along the main axis.',
        order: 1,
      },
      {
        id: 'a-026',
        text: 'align-items',
        isCorrect: true,
        explanation: 'align-items is used to align flex items along the cross axis.',
        order: 2,
      },
      {
        id: 'a-027',
        text: 'flex-direction',
        isCorrect: true,
        explanation: 'flex-direction defines the direction of the main axis.',
        order: 3,
      },
      {
        id: 'a-028',
        text: 'float',
        isCorrect: false,
        explanation: 'float is not a flexbox property and is ignored in flex containers.',
        order: 4,
      },
      {
        id: 'a-029',
        text: 'flex-wrap',
        isCorrect: true,
        explanation: 'flex-wrap controls whether flex items wrap to new lines.',
        order: 5,
      },
    ],
    points: 15,
    difficulty: QUIZ_DIFFICULTY.INTERMEDIATE,
    estimatedTime: 75,
    subjectId: 'subj-001',
    subjectName: 'Introduction to Web Development',
    tags: ['css', 'flexbox', 'layout'],
    category: 'CSS Layout',
    topics: ['Flexbox', 'CSS Grid'],
    analytics: {
      timesUsed: 20,
      correctRate: 68,
      averageTime: 72,
      discrimination: 0.8,
    },
    explanation: 'Flexbox provides several properties for controlling layout, alignment, and spacing of flex items.',
    references: [
      {
        type: 'url',
        title: 'CSS Flexbox Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout',
      },
    ],
    createdBy: 'instructor-001',
    createdAt: new Date('2025-09-08'),
    updatedAt: new Date('2025-09-15'),
    lastUsed: new Date('2025-09-28'),
    status: 'active',
  },
  {
    id: 'q-008',
    title: 'SQL JOIN Operations',
    question: 'A LEFT JOIN returns all records from the left table, even if there are no matches in the right table.',
    type: QUESTION_TYPES.TRUE_FALSE,
    content: {
      text: 'A LEFT JOIN returns all records from the left table, even if there are no matches in the right table.',
      media: null,
      code: {
        language: 'sql',
        content: `SELECT customers.name, orders.order_date
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;`,
      },
    },
    answers: [
      {
        id: 'a-030',
        text: 'True',
        isCorrect: true,
        explanation: 'LEFT JOIN returns all records from the left table, with NULLs for unmatched right table records.',
        order: 1,
      },
      {
        id: 'a-031',
        text: 'False',
        isCorrect: false,
        explanation: 'This is incorrect. LEFT JOIN does return all left table records.',
        order: 2,
      },
    ],
    points: 10,
    difficulty: QUIZ_DIFFICULTY.INTERMEDIATE,
    estimatedTime: 40,
    subjectId: 'subj-004',
    subjectName: 'Database Systems',
    tags: ['sql', 'joins', 'database'],
    category: 'SQL Operations',
    topics: ['JOIN Operations', 'Query Optimization'],
    analytics: {
      timesUsed: 24,
      correctRate: 87,
      averageTime: 35,
      discrimination: 0.6,
    },
    explanation: 'LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table and matched records from the right table.',
    references: [
      {
        type: 'url',
        title: 'SQL JOIN Types',
        url: 'https://www.w3schools.com/sql/sql_join.asp',
      },
    ],
    createdBy: 'instructor-003',
    createdAt: new Date('2025-09-10'),
    updatedAt: new Date('2025-09-18'),
    lastUsed: new Date('2025-09-30'),
    status: 'active',
  },
];

export const mockQuestionService = {
  getQuestions: async (filters = {}) => {
    await simulateNetworkDelay();
    
    let filteredQuestions = [...mockQuestions];
    
    // Apply filters
    if (filters.subjectId && filters.subjectId !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.subjectId === filters.subjectId);
    }
    
    if (filters.type && filters.type !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.type === filters.type);
    }
    
    if (filters.difficulty && filters.difficulty !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === filters.difficulty);
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.category === filters.category);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => 
        filters.tags.some(tag => q.tags.includes(tag))
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredQuestions = filteredQuestions.filter(q => 
        q.title.toLowerCase().includes(searchTerm) ||
        q.question.toLowerCase().includes(searchTerm) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        q.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sorting
    if (filters.sortBy) {
      filteredQuestions.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'created':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'updated':
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          case 'difficulty':
            const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          case 'usage':
            return b.analytics.timesUsed - a.analytics.timesUsed;
          case 'correctRate':
            return b.analytics.correctRate - a.analytics.correctRate;
          default:
            return 0;
        }
      });
    }
    
    return {
      questions: filteredQuestions,
      total: filteredQuestions.length,
      stats: {
        total: mockQuestions.length,
        byType: {
          multiple_choice: mockQuestions.filter(q => q.type === QUESTION_TYPES.MULTIPLE_CHOICE).length,
          true_false: mockQuestions.filter(q => q.type === QUESTION_TYPES.TRUE_FALSE).length,
          multiple_answer: mockQuestions.filter(q => q.type === QUESTION_TYPES.MULTIPLE_ANSWER).length,
        },
        byDifficulty: {
          beginner: mockQuestions.filter(q => q.difficulty === QUIZ_DIFFICULTY.BEGINNER).length,
          intermediate: mockQuestions.filter(q => q.difficulty === QUIZ_DIFFICULTY.INTERMEDIATE).length,
          advanced: mockQuestions.filter(q => q.difficulty === QUIZ_DIFFICULTY.ADVANCED).length,
        },
        bySubject: mockQuestions.reduce((acc, q) => {
          acc[q.subjectId] = (acc[q.subjectId] || 0) + 1;
          return acc;
        }, {}),
        averageCorrectRate: mockQuestions.reduce((sum, q) => sum + q.analytics.correctRate, 0) / mockQuestions.length,
        totalUsage: mockQuestions.reduce((sum, q) => sum + q.analytics.timesUsed, 0),
      },
    };
  },

  getQuestion: async (id) => {
    await simulateNetworkDelay();
    const question = mockQuestions.find(q => q.id === id);
    if (!question) {
      throw new Error(`Question with ID ${id} not found`);
    }
    return question;
  },

  createQuestion: async (questionData) => {
    await simulateNetworkDelay();
    
    const newQuestion = {
      ...questionData,
      id: generateId('q'),
      analytics: {
        timesUsed: 0,
        correctRate: 0,
        averageTime: 0,
        discrimination: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsed: null,
      status: 'active',
    };
    
    mockQuestions.push(newQuestion);
    return newQuestion;
  },

  updateQuestion: async (id, questionData) => {
    await simulateNetworkDelay();
    
    const index = mockQuestions.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error(`Question with ID ${id} not found`);
    }
    
    const updatedQuestion = {
      ...mockQuestions[index],
      ...questionData,
      updatedAt: new Date(),
    };
    
    mockQuestions[index] = updatedQuestion;
    return updatedQuestion;
  },

  deleteQuestion: async (id) => {
    await simulateNetworkDelay();
    
    const index = mockQuestions.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error(`Question with ID ${id} not found`);
    }
    
    mockQuestions.splice(index, 1);
    return { success: true, message: 'Question deleted successfully' };
  },

  duplicateQuestion: async (id) => {
    await simulateNetworkDelay();
    
    const originalQuestion = mockQuestions.find(q => q.id === id);
    if (!originalQuestion) {
      throw new Error(`Question with ID ${id} not found`);
    }
    
    const duplicatedQuestion = {
      ...originalQuestion,
      id: generateId('q'),
      title: `${originalQuestion.title} (Copy)`,
      analytics: {
        timesUsed: 0,
        correctRate: 0,
        averageTime: 0,
        discrimination: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsed: null,
    };
    
    mockQuestions.push(duplicatedQuestion);
    return duplicatedQuestion;
  },

  bulkImport: async (questions) => {
    await simulateNetworkDelay();
    
    const importedQuestions = questions.map(q => ({
      ...q,
      id: generateId('q'),
      analytics: {
        timesUsed: 0,
        correctRate: 0,
        averageTime: 0,
        discrimination: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsed: null,
      status: 'active',
    }));
    
    mockQuestions.push(...importedQuestions);
    return {
      success: true,
      imported: importedQuestions.length,
      questions: importedQuestions,
    };
  },

  bulkDelete: async (questionIds) => {
    await simulateNetworkDelay();
    
    let deletedCount = 0;
    for (const id of questionIds) {
      const index = mockQuestions.findIndex(q => q.id === id);
      if (index !== -1) {
        mockQuestions.splice(index, 1);
        deletedCount++;
      }
    }
    
    return {
      success: true,
      deleted: deletedCount,
      message: `${deletedCount} questions deleted successfully`,
    };
  },

  getQuestionsBySubject: async (subjectId) => {
    await simulateNetworkDelay();
    return mockQuestions.filter(q => q.subjectId === subjectId);
  },

  getQuestionStats: async () => {
    await simulateNetworkDelay();
    
    return {
      total: mockQuestions.length,
      active: mockQuestions.filter(q => q.status === 'active').length,
      byType: {
        multiple_choice: mockQuestions.filter(q => q.type === QUESTION_TYPES.MULTIPLE_CHOICE).length,
        true_false: mockQuestions.filter(q => q.type === QUESTION_TYPES.TRUE_FALSE).length,
        multiple_answer: mockQuestions.filter(q => q.type === QUESTION_TYPES.MULTIPLE_ANSWER).length,
      },
      byDifficulty: {
        beginner: mockQuestions.filter(q => q.difficulty === QUIZ_DIFFICULTY.BEGINNER).length,
        intermediate: mockQuestions.filter(q => q.difficulty === QUIZ_DIFFICULTY.INTERMEDIATE).length,
        advanced: mockQuestions.filter(q => q.difficulty === QUIZ_DIFFICULTY.ADVANCED).length,
      },
      averageCorrectRate: mockQuestions.reduce((sum, q) => sum + q.analytics.correctRate, 0) / mockQuestions.length,
      totalUsage: mockQuestions.reduce((sum, q) => sum + q.analytics.timesUsed, 0),
      mostUsedTags: Object.entries(
        mockQuestions.reduce((acc, q) => {
          q.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
          });
          return acc;
        }, {})
      ).sort(([,a], [,b]) => b - a).slice(0, 10),
    };
  },
};
