/**
 * Mock Quiz API Service
 * Provides mock data for testing quiz functionality
 */

// Mock quiz data
export const mockQuizData = {
  id: 'quiz-001',
  title: 'JavaScript Fundamentals Assessment',
  description: 'Test your understanding of core JavaScript concepts including variables, functions, objects, and control flow.',
  timeLimit: 45, // minutes
  totalQuestions: 8,
  totalPoints: 100,
  status: 'published',
  difficulty: 'medium',
  type: 'exam',
  subject: {
    id: 'js-101',
    name: 'JavaScript Programming'
  },
  instructions: 'Read each question carefully. You can flag questions for review and navigate between them. Submit when ready.',
  allowRetake: true,
  showCorrectAnswers: false,
  randomizeQuestions: false,
  passingScore: 70
};

// Mock questions data
export const mockQuestionsData = [
  {
    id: 'q1',
    title: 'Which of the following is the correct way to declare a variable in JavaScript?',
    content: {
      text: 'Choose the most appropriate method for declaring a variable in modern JavaScript.',
    },
    type: 'single_choice',
    points: 10,
    answers: [
      { id: 'q1a1', text: 'var myVariable = "hello";', isCorrect: false },
      { id: 'q1a2', text: 'let myVariable = "hello";', isCorrect: true },
      { id: 'q1a3', text: 'variable myVariable = "hello";', isCorrect: false },
      { id: 'q1a4', text: 'declare myVariable = "hello";', isCorrect: false }
    ]
  },
  {
    id: 'q2',
    title: 'Which of the following are valid JavaScript data types?',
    content: {
      text: 'Select all valid primitive data types in JavaScript. Multiple answers are correct.',
    },
    type: 'multiple_choice',
    points: 15,
    answers: [
      { id: 'q2a1', text: 'string', isCorrect: true },
      { id: 'q2a2', text: 'number', isCorrect: true },
      { id: 'q2a3', text: 'boolean', isCorrect: true },
      { id: 'q2a4', text: 'integer', isCorrect: false },
      { id: 'q2a5', text: 'undefined', isCorrect: true },
      { id: 'q2a6', text: 'float', isCorrect: false }
    ]
  },
  {
    id: 'q3',
    title: 'What is the output of the following code?',
    content: {
      text: 'Analyze the following JavaScript code and determine its output:',
      code: {
        language: 'javascript',
        content: `console.log(typeof null);
console.log(typeof undefined);
console.log(typeof []);`
      }
    },
    type: 'single_choice',
    points: 15,
    answers: [
      { id: 'q3a1', text: '"null", "undefined", "array"', isCorrect: false },
      { id: 'q3a2', text: '"object", "undefined", "object"', isCorrect: true },
      { id: 'q3a3', text: '"null", "undefined", "object"', isCorrect: false },
      { id: 'q3a4', text: '"object", "undefined", "array"', isCorrect: false }
    ]
  },
  {
    id: 'q4',
    title: 'How do you create a function in JavaScript?',
    content: {
      text: 'Choose the correct syntax for creating a function in JavaScript.',
    },
    type: 'single_choice',
    points: 10,
    answers: [
      { id: 'q4a1', text: 'function myFunction() {}', isCorrect: true },
      { id: 'q4a2', text: 'create function myFunction() {}', isCorrect: false },
      { id: 'q4a3', text: 'def myFunction() {}', isCorrect: false },
      { id: 'q4a4', text: 'func myFunction() {}', isCorrect: false }
    ]
  },
  {
    id: 'q5',
    title: 'What are the different ways to define a function in JavaScript?',
    content: {
      text: 'Select all valid ways to define a function in JavaScript.',
    },
    type: 'multiple_choice',
    points: 20,
    answers: [
      { id: 'q5a1', text: 'Function declaration: function myFunc() {}', isCorrect: true },
      { id: 'q5a2', text: 'Function expression: const myFunc = function() {}', isCorrect: true },
      { id: 'q5a3', text: 'Arrow function: const myFunc = () => {}', isCorrect: true },
      { id: 'q5a4', text: 'Method definition: myFunc() {}', isCorrect: false },
      { id: 'q5a5', text: 'Constructor function: new Function("return true")', isCorrect: true }
    ]
  },
  {
    id: 'q6',
    title: 'What is the difference between == and === in JavaScript?',
    content: {
      text: 'Choose the correct explanation of the difference between loose and strict equality operators.',
    },
    type: 'single_choice',
    points: 10,
    answers: [
      { id: 'q6a1', text: '== compares values only, === compares values and types', isCorrect: true },
      { id: 'q6a2', text: '== compares types only, === compares values only', isCorrect: false },
      { id: 'q6a3', text: 'They are exactly the same', isCorrect: false },
      { id: 'q6a4', text: '== is for numbers, === is for strings', isCorrect: false }
    ]
  },
  {
    id: 'q7',
    title: 'Which statements about JavaScript arrays are true?',
    content: {
      text: 'Select all correct statements about JavaScript arrays.',
    },
    type: 'multiple_choice',
    points: 15,
    answers: [
      { id: 'q7a1', text: 'Arrays can hold mixed data types', isCorrect: true },
      { id: 'q7a2', text: 'Array indices start at 0', isCorrect: true },
      { id: 'q7a3', text: 'Arrays have a fixed size once created', isCorrect: false },
      { id: 'q7a4', text: 'Arrays are objects in JavaScript', isCorrect: true },
      { id: 'q7a5', text: 'You can only store primitives in arrays', isCorrect: false }
    ]
  },
  {
    id: 'q8',
    title: 'What will be the output of this code?',
    content: {
      text: 'Analyze this JavaScript code and predict the output:',
      code: {
        language: 'javascript',
        content: `let x = 5;
let y = "5";
console.log(x == y);
console.log(x === y);
console.log(x + y);`
      }
    },
    type: 'single_choice',
    points: 15,
    answers: [
      { id: 'q8a1', text: 'true, false, 10', isCorrect: false },
      { id: 'q8a2', text: 'true, false, "55"', isCorrect: true },
      { id: 'q8a3', text: 'false, false, "55"', isCorrect: false },
      { id: 'q8a4', text: 'true, true, 10', isCorrect: false }
    ]
  }
];

// Mock API functions
export const mockQuizAPI = {
  async getQuiz(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (id === mockQuizData.id || id === '1' || id === 'quiz-001') {
      return {
        success: true,
        data: mockQuizData,
        message: 'Quiz loaded successfully'
      };
    }
    
    return {
      success: false,
      error: 'Quiz not found'
    };
  },

  async getQuestions(params) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const { quizId } = params || {};
    
    if (quizId === mockQuizData.id || quizId === '1' || quizId === 'quiz-001') {
      return {
        success: true,
        data: {
          questions: mockQuestionsData,
          total: mockQuestionsData.length
        },
        message: 'Questions loaded successfully'
      };
    }
    
    return {
      success: false,
      error: 'Questions not found'
    };
  },

  async submitQuiz(submissionData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const { answers, timeSpent, flaggedQuestions } = submissionData;
    
    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    
    const questionResults = mockQuestionsData.map(question => {
      const userAnswer = answers[question.id];
      const correctAnswerIds = question.answers.filter(a => a.isCorrect).map(a => a.id);
      
      let isCorrect = false;
      
      if (question.type === 'single_choice') {
        isCorrect = correctAnswerIds.includes(userAnswer);
      } else if (question.type === 'multiple_choice') {
        const userAnswerArray = userAnswer || [];
        isCorrect = correctAnswerIds.length === userAnswerArray.length &&
                   correctAnswerIds.every(id => userAnswerArray.includes(id));
      }
      
      if (isCorrect) {
        correctAnswers++;
        totalPoints += question.points;
      }
      
      return {
        questionId: question.id,
        question: {
          title: question.title,
          points: question.points
        },
        userAnswer: userAnswer,
        correctAnswer: question.type === 'single_choice' 
          ? correctAnswerIds[0] 
          : correctAnswerIds,
        isCorrect: isCorrect,
        points: isCorrect ? question.points : 0
      };
    });
    
    const attemptId = 'attempt-' + Date.now();
    
    return {
      success: true,
      data: {
        attemptId: attemptId,
        score: totalPoints,
        totalPoints: mockQuizData.totalPoints,
        correctAnswers: correctAnswers,
        totalQuestions: mockQuestionsData.length,
        timeSpent: timeSpent,
        flaggedQuestions: flaggedQuestions,
        questionResults: questionResults,
        percentage: Math.round((totalPoints / mockQuizData.totalPoints) * 100)
      },
      message: 'Quiz submitted successfully'
    };
  },

  async getQuizResult(attemptId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock result data - normally this would be stored after submission
    return {
      success: true,
      data: {
        attemptId: attemptId,
        quiz: mockQuizData,
        score: 75,
        totalPoints: 100,
        correctAnswers: 6,
        totalQuestions: 8,
        timeSpent: 1800, // 30 minutes
        percentage: 75,
        submittedAt: new Date().toISOString(),
        questionResults: mockQuestionsData.slice(0, 6).map((q, index) => ({
          questionId: q.id,
          question: { title: q.title, points: q.points },
          userAnswer: q.answers[index % 2].id,
          correctAnswer: q.answers.find(a => a.isCorrect).id,
          isCorrect: index < 4, // First 4 correct, rest incorrect
          points: index < 4 ? q.points : 0
        })),
        feedback: 'Good job! You have a solid understanding of JavaScript fundamentals. Review the concepts you missed and try again.',
        breakdown: {
          'Variables & Types': { correct: 2, total: 3 },
          'Functions': { correct: 2, total: 2 },
          'Operators': { correct: 1, total: 2 },
          'Arrays': { correct: 1, total: 1 }
        }
      }
    };
  }
};

export default mockQuizAPI;
