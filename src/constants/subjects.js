/**
 * Subject Constants
 * Defines subjects, topics, and related configurations
 */

// Predefined subjects
export const SUBJECTS = [
  {
    id: 'math',
    name: 'Toán học',
    description: 'Môn học Toán học cơ bản và nâng cao',
    color: '#3b82f6',
    icon: '📐',
    isActive: true,
    topics: [
      'Đại số',
      'Hình học',
      'Giải tích',
      'Xác suất thống kê',
      'Toán rời rạc'
    ]
  },
  {
    id: 'physics',
    name: 'Vật lý',
    description: 'Môn học Vật lý cơ bản và nâng cao',
    color: '#10b981',
    icon: '⚛️',
    isActive: true,
    topics: [
      'Cơ học',
      'Điện học',
      'Quang học',
      'Nhiệt học',
      'Vật lý hạt nhân'
    ]
  },
  {
    id: 'chemistry',
    name: 'Hóa học',
    description: 'Môn học Hóa học cơ bản và nâng cao',
    color: '#f59e0b',
    icon: '🧪',
    isActive: true,
    topics: [
      'Hóa vô cơ',
      'Hóa hữu cơ',
      'Hóa phân tích',
      'Hóa lý',
      'Hóa sinh'
    ]
  },
  {
    id: 'biology',
    name: 'Sinh học',
    description: 'Môn học Sinh học cơ bản và nâng cao',
    color: '#8b5cf6',
    icon: '🧬',
    isActive: true,
    topics: [
      'Sinh học tế bào',
      'Di truyền học',
      'Sinh thái học',
      'Giải phẫu',
      'Sinh lý học'
    ]
  },
  {
    id: 'literature',
    name: 'Ngữ văn',
    description: 'Môn học Ngữ văn Việt Nam',
    color: '#ef4444',
    icon: '📚',
    isActive: true,
    topics: [
      'Văn học cổ điển',
      'Văn học hiện đại',
      'Tiếng Việt',
      'Tác phẩm nổi tiếng',
      'Kỹ năng viết'
    ]
  },
  {
    id: 'history',
    name: 'Lịch sử',
    description: 'Môn học Lịch sử Việt Nam và Thế giới',
    color: '#6b7280',
    icon: '🏛️',
    isActive: true,
    topics: [
      'Lịch sử Việt Nam',
      'Lịch sử thế giới',
      'Lịch sử cận đại',
      'Lịch sử hiện đại',
      'Nhân vật lịch sử'
    ]
  },
  {
    id: 'geography',
    name: 'Địa lý',
    description: 'Môn học Địa lý Việt Nam và Thế giới',
    color: '#059669',
    icon: '🌍',
    isActive: true,
    topics: [
      'Địa lý tự nhiên',
      'Địa lý kinh tế',
      'Địa lý Việt Nam',
      'Địa lý thế giới',
      'Môi trường'
    ]
  },
  {
    id: 'english',
    name: 'Tiếng Anh',
    description: 'Môn học Tiếng Anh cơ bản và nâng cao',
    color: '#dc2626',
    icon: '🇺🇸',
    isActive: true,
    topics: [
      'Grammar',
      'Vocabulary',
      'Reading',
      'Listening',
      'Speaking'
    ]
  },
  {
    id: 'informatics',
    name: 'Tin học',
    description: 'Môn học Tin học và Lập trình',
    color: '#7c3aed',
    icon: '💻',
    isActive: true,
    topics: [
      'Lập trình cơ bản',
      'Cấu trúc dữ liệu',
      'Thuật toán',
      'Mạng máy tính',
      'Cơ sở dữ liệu'
    ]
  }
];

// Helper functions
export const getSubjectById = (id) => {
  return SUBJECTS.find(subject => subject.id === id);
};

export const getSubjectByName = (name) => {
  return SUBJECTS.find(subject => subject.name === name);
};

export const getActiveSubjects = () => {
  return SUBJECTS.filter(subject => subject.isActive);
};

export const getSubjectTopics = (subjectId) => {
  const subject = getSubjectById(subjectId);
  return subject ? subject.topics : [];
};

export const getSubjectColor = (subjectId) => {
  const subject = getSubjectById(subjectId);
  return subject ? subject.color : '#6b7280';
};

export const getSubjectIcon = (subjectId) => {
  const subject = getSubjectById(subjectId);
  return subject ? subject.icon : '📖';
};

// Default subject (Math as requested)
export const DEFAULT_SUBJECT = SUBJECTS[0]; // Toán học
