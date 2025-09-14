/**
 * Question Constants
 * Defines question types, difficulty levels, and related configurations
 */

// Question Types
export const QUESTION_TYPES = [
  { value: 'true_false', label: 'Đúng/Sai' },
  { value: 'multiple_choice', label: 'Chọn nhiều đáp án' },
  { value: 'single_choice', label: 'Chọn 1 đáp án' },
  { value: 'fill_blank', label: 'Điền vào chỗ trống' }
];

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' }
];

// Helper functions
export const getQuestionTypeLabel = (value) => {
  const type = QUESTION_TYPES.find(type => type.value === value);
  return type ? type.label : value;
};

export const getDifficultyLabel = (value) => {
  const difficulty = DIFFICULTY_LEVELS.find(diff => diff.value === value);
  return difficulty ? difficulty.label : value;
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Question validation rules
export const QUESTION_VALIDATION = {
  MIN_TEXT_LENGTH: 10,
  MAX_TEXT_LENGTH: 1000,
  MIN_POINTS: 1,
  MAX_POINTS: 30,
  MAX_ANSWERS: 6,
  MIN_ANSWERS: {
    true_false: 2,
    multiple_choice: 2,
    single_choice: 2,
    fill_blank: 1
  }
};

// Answer initialization templates
export const ANSWER_TEMPLATES = {
  true_false: [
    { text: 'Đúng', isCorrect: true },
    { text: 'Sai', isCorrect: false }
  ],
  multiple_choice: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false }
  ],
  single_choice: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ],
  fill_blank: [
    { text: '', isCorrect: true }
  ]
};
