import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaClock, 
  FaQuestionCircle, 
  FaArrowLeft, 
  FaFlag,
  FaCheck,
  FaExclamationTriangle,
  FaLeaf,
  FaSeedling,
  FaTree,
  FaSun,
  FaFeather,
  FaHeart,
  FaMountain,
  FaPlay
} from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

// Mock data for preview
const mockQuiz = {
  id: '1',
  title: 'Kiểm tra JavaScript Cơ bản',
  description: 'Kiểm tra kiến thức JavaScript của bạn',
  timeLimit: 30, // minutes
  totalQuestions: 10,
  totalPoints: 100
};

const mockQuestions = [
  {
    id: '1',
    title: 'Cách khai báo biến đúng trong JavaScript là gì?',
    type: 'single_choice',
    points: 10,
    answers: [
      { id: 'a1', text: 'var myVar = "hello";' },
      { id: 'a2', text: 'variable myVar = "hello";' },
      { id: 'a3', text: 'v myVar = "hello";' },
      { id: 'a4', text: 'declare myVar = "hello";' }
    ]
  },
  {
    id: '2',
    title: 'Những kiểu dữ liệu nào sau đây hợp lệ trong JavaScript? (Chọn tất cả)',
    type: 'multiple_choice',
    points: 15,
    answers: [
      { id: 'b1', text: 'String' },
      { id: 'b2', text: 'Number' },
      { id: 'b3', text: 'Boolean' },
      { id: 'b4', text: 'Float' },
      { id: 'b5', text: 'Array' }
    ]
  },
  {
    id: '3',
    title: 'Từ khóa "this" trong JavaScript đề cập đến gì?',
    type: 'single_choice',
    points: 10,
    answers: [
      { id: 'c1', text: 'Hàm hiện tại' },
      { id: 'c2', text: 'Đối tượng toàn cục' },
      { id: 'c3', text: 'Đối tượng sở hữu đoạn mã hiện tại' },
      { id: 'c4', text: 'Hàm được gọi trước đó' }
    ]
  },
  {
    id: '4',
    title: 'Làm thế nào để tạo một hàm trong JavaScript?',
    type: 'single_choice',
    points: 10,
    answers: [
      { id: 'd1', text: 'function = myFunction() {}' },
      { id: 'd2', text: 'function myFunction() {}' },
      { id: 'd3', text: 'create myFunction() {}' },
      { id: 'd4', text: 'def myFunction() {}' }
    ]
  },
  {
    id: '5',
    title: 'Cách viết mảng JavaScript đúng là gì?',
    type: 'single_choice',
    points: 10,
    answers: [
      { id: 'e1', text: 'var colors = "red", "green", "blue"' },
      { id: 'e2', text: 'var colors = ["red", "green", "blue"]' },
      { id: 'e3', text: 'var colors = (1:"red", 2:"green", 3:"blue")' },
      { id: 'e4', text: 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")' }
    ]
  },
  // Additional questions to test the grid layout for larger quizzes
  ...Array.from({length: 25}, (_, i) => ({
    id: `q${i + 6}`,
    title: `Câu hỏi ${i + 6}: Khái niệm hoặc cú pháp JavaScript`,
    type: i % 3 === 0 ? 'multiple_choice' : 'single_choice',
    points: 10,
    answers: [
      { id: `q${i + 6}_a1`, text: `Lựa chọn A cho câu hỏi ${i + 6}` },
      { id: `q${i + 6}_a2`, text: `Lựa chọn B cho câu hỏi ${i + 6}` },
      { id: `q${i + 6}_a3`, text: `Lựa chọn C cho câu hỏi ${i + 6}` },
      { id: `q${i + 6}_a4`, text: `Lựa chọn D cho câu hỏi ${i + 6}` }
    ]
  }))
];

const TakeQuizNature = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(mockQuiz.timeLimit * 60); // Convert to seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timer, setTimer] = useState(null);

  // Demo functions
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Start quiz function
  const startQuiz = () => {
    setQuizStarted(true);
    // Start countdown timer
    const intervalId = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          // Auto submit when time runs out
          setShowSubmitModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(intervalId);
  };

  // Cleanup timer on component unmount
  React.useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);
  
  const handleAnswerChange = (questionId, answerId, isMultiple = false) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(answerId)
          ? currentAnswers.filter(id => id !== answerId)
          : [...currentAnswers, answerId];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: answerId };
      }
    });
  };
  
  const goToQuestion = (index) => {
    if (index >= 0 && index < mockQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };
  
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };
  
  const getAnswerStats = () => {
    const answered = Object.values(answers).filter(answer => 
      Array.isArray(answer) ? answer.length > 0 : answer !== ''
    ).length;
    const flagged = flaggedQuestions.size;
    const remaining = mockQuestions.length - answered;
    
    return { answered, flagged, remaining, total: mockQuestions.length };
  };
  
  const currentQuestion = mockQuestions[currentQuestionIndex];
  const stats = getAnswerStats();

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Nature Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-green-300/20 animate-bounce">
          <FaLeaf className="text-6xl transform rotate-12" />
        </div>
        <div className="absolute top-20 right-20 text-emerald-300/20 animate-pulse">
          <FaFeather className="text-5xl" />
        </div>
        <div className="absolute bottom-20 left-20 text-green-400/20 animate-bounce delay-1000">
          <FaHeart className="text-7xl" />
        </div>
        <div className="absolute bottom-10 right-10 text-teal-300/20 animate-pulse delay-500">
          <FaTree className="text-8xl" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300/10">
          <FaSun className="text-9xl animate-spin" style={{ animationDuration: '20s' }} />
        </div>
      </div>

      {/* Organic Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg border-b-4 border-green-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/quizzes')}
                className="text-green-700 hover:text-green-800 hover:bg-green-100 rounded-full px-6 py-3 transition-all duration-300 border-2 border-green-200 hover:border-green-300"
              >
                <FaArrowLeft className="mr-2" />
                Trở về Rừng
              </Button>
              <div className="border-l-4 border-green-300 pl-6">
                <h1 className="text-3xl font-bold text-green-800 flex items-center">
                  <FaSeedling className="mr-3 text-green-600" />
                  {mockQuiz.title}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-green-600 flex items-center bg-green-100 px-4 py-1 rounded-full">
                    <FaQuestionCircle className="mr-2" />
                    Hạt giống {currentQuestionIndex + 1} / {mockQuestions.length}
                  </span>
                  <span className="text-green-500">🌱</span>
                  <span className="text-green-600 bg-green-100 px-4 py-1 rounded-full">{mockQuiz.totalPoints} Điểm Phát triển</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Nature Timer */}
              <div className={`relative p-6 rounded-full border-4 ${
                timeRemaining < 300 
                  ? 'bg-red-100 border-red-300 text-red-700' 
                  : 'bg-green-100 border-green-300 text-green-700'
              } shadow-lg`}>
                <div className="flex items-center space-x-3">
                  <FaClock className="text-2xl" />
                  <div className="text-center">
                    <div className="font-mono text-2xl font-bold">{formatTime(timeRemaining)}</div>
                    <div className="text-xs uppercase tracking-wider">Mùa còn lại</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <FaSun className="text-yellow-400 text-lg animate-pulse" />
                </div>
              </div>
              
              {/* Growth Progress */}
              <div className="relative">
                <div className="w-24 h-24 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#d1fae5"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#growthGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (stats.answered / stats.total))}`}
                      className="transition-all duration-1000"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FaTree className="text-green-600 text-xl mb-1" />
                      <div className="text-sm font-bold text-green-700">{stats.answered}/{stats.total}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {!quizStarted ? (
          /* Welcome Screen */
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-2xl mx-auto text-center">
              <div className="p-8 bg-white/90 backdrop-blur-sm border-4 border-green-200 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 text-green-200">
                  <FaFeather className="text-4xl animate-bounce" />
                </div>
                <div className="absolute bottom-4 left-4 text-green-200">
                  <FaLeaf className="text-3xl transform rotate-45" />
                </div>
                
                <div className="relative z-10">
                  {/* Welcome Icon */}
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-green-400 relative">
                    <FaSeedling className="text-white text-4xl" />
                    <div className="absolute -top-2 -right-2">
                      <FaSun className="text-yellow-400 text-2xl animate-pulse" />
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-green-800 mb-6">
                    🌱 Chào mừng đến với Vườn Kiến thức 🌱
                  </h2>
                  <h3 className="text-2xl font-semibold text-green-700 mb-8">
                    {mockQuiz.title}
                  </h3>
                  
                  {/* Quiz Info */}
                  <div className="bg-green-50 rounded-2xl p-6 mb-8 border-2 border-green-200">
                    <h4 className="font-bold text-green-800 mb-4 text-lg">
                      📋 Thông tin Bài kiểm tra
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-white rounded-xl p-4 border-2 border-green-100">
                        <div className="text-2xl mb-2">⏰</div>
                        <div className="font-bold text-green-800">{mockQuiz.timeLimit} phút</div>
                        <div className="text-sm text-green-600">Thời gian</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-2 border-green-100">
                        <div className="text-2xl mb-2">🌱</div>
                        <div className="font-bold text-green-800">{mockQuestions.length} câu</div>
                        <div className="text-sm text-green-600">Hạt giống</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-2 border-green-100">
                        <div className="text-2xl mb-2">🏆</div>
                        <div className="font-bold text-green-800">{mockQuiz.totalPoints} điểm</div>
                        <div className="text-sm text-green-600">Tổng điểm</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Instructions */}
                  <div className="text-left bg-yellow-50 rounded-2xl p-6 mb-8 border-2 border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-4 text-lg flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      📖 Hướng dẫn
                    </h4>
                    <ul className="space-y-2 text-yellow-700">
                      <li className="flex items-start">
                        <span className="mr-2">🌸</span>
                        <span>Chọn đáp án phù hợp cho mỗi câu hỏi</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">🏷️</span>
                        <span>Sử dụng cờ để đánh dấu câu cần xem lại</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">⏱️</span>
                        <span>Bộ đếm thời gian sẽ bắt đầu khi bạn nhấn &ldquo;Bắt đầu&rdquo;</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">🌻</span>
                        <span>Bài kiểm tra sẽ tự động nộp khi hết thời gian</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Start Button */}
                  <Button
                    onClick={startQuiz}
                    className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-lg border-4 border-green-400 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <FaPlay className="text-lg" />
                      <span>🌱 Bắt đầu Gieo hạt</span>
                      <FaSeedling className="text-lg" />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Quiz Content */
          <div>
        {/* Garden Progress - Moved to Top */}
        <div className="mb-6">
          <div className="p-4 bg-white/90 backdrop-blur-sm border-3 border-green-200 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Progress Title */}
              <div className="lg:col-span-1">
                <h3 className="font-bold text-green-800 mb-2 flex items-center text-base">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                    <FaMountain className="text-white text-sm" />
                  </div>
                  Tiến độ Vườn
                </h3>
              </div>
              
              {/* Stats */}
              <div className="lg:col-span-1">
                <div className="space-y-2">
                  {[
                    { label: 'Nở hoa', value: stats.answered, icon: FaHeart, color: 'bg-green-100 border-green-300 text-green-700' },
                    { label: 'Đánh dấu', value: stats.flagged, icon: FaFlag, color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
                    { label: 'Đang lớn', value: stats.remaining, icon: FaSeedling, color: 'bg-gray-100 border-gray-300 text-gray-700' }
                  ].map((stat, index) => (
                    <div key={index} className={`p-2 rounded-lg border-2 ${stat.color} shadow-sm`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <stat.icon className="text-xs" />
                          <span className="font-medium text-xs">{stat.label}</span>
                        </div>
                        <span className="font-bold text-sm">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Question Grid */}
              <div className="lg:col-span-1">
                <div 
                  className="max-h-32 overflow-y-auto rounded-lg border border-green-100"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#86efac #dcfce7'
                  }}
                >
                  <div className="grid grid-cols-8 gap-1 p-1.5">
                    {mockQuestions.map((question, index) => {
                      const isAnswered = Array.isArray(answers[question.id]) 
                        ? answers[question.id]?.length > 0 
                        : answers[question.id] !== undefined && answers[question.id] !== '';
                      const isFlagged = flaggedQuestions.has(question.id);
                      const isCurrent = index === currentQuestionIndex;
                      
                      return (
                        <button
                          key={question.id}
                          onClick={() => goToQuestion(index)}
                          className={`
                            relative w-6 h-6 rounded-md text-xs font-bold border shadow-sm
                            transition-all duration-300 transform hover:scale-110
                            ${isCurrent
                              ? 'bg-green-500 border-green-600 text-white shadow-green-300 scale-110 z-10'
                              : isAnswered
                              ? 'bg-green-300 border-green-400 text-green-800 shadow-green-200'
                              : 'bg-white border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300'
                            }
                          `}
                          title={`Câu hỏi ${index + 1}${isAnswered ? ' (Đã trả lời)' : ''}${isFlagged ? ' (Đã đánh dấu)' : ''}`}
                        >
                          {isAnswered ? (
                            <FaHeart className="w-full h-full p-0.5" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                          {isFlagged && (
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full flex items-center justify-center border border-white shadow-sm">
                              <FaFlag className="text-white text-xs" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Quick Navigation for Large Quiz */}
                {mockQuestions.length > 20 && (
                  <div className="mt-2 flex justify-between items-center text-xs">
                    <button
                      onClick={() => goToQuestion(0)}
                      className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                    >
                      Đầu
                    </button>
                    <span className="text-green-600 font-medium text-xs">
                      {Math.floor(currentQuestionIndex / 10) + 1}/{Math.ceil(mockQuestions.length / 10)}
                    </span>
                    <button
                      onClick={() => goToQuestion(mockQuestions.length - 1)}
                      className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                    >
                      Cuối
                    </button>
                  </div>
                )}
              </div>
              
              {/* Harvest Button */}
              <div className="lg:col-span-1 flex items-center">
                <Button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-green-400"
                >
                  <div className="flex items-center justify-center space-x-1.5">
                    <FaCheck className="text-sm" />
                    <span className="text-sm">Thu hoạch</span>
                    <FaLeaf className="text-sm" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Question Area - Full Width */}
        <div className="w-full">
          <div className="p-8 bg-white/90 backdrop-blur-sm border-4 border-green-200 rounded-3xl shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 text-green-200">
                <FaFeather className="text-3xl animate-bounce" />
              </div>
              <div className="absolute bottom-4 left-4 text-green-200">
                <FaLeaf className="text-2xl transform rotate-45" />
              </div>
              
              <div className="relative z-10">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-10 pb-6 border-b-4 border-green-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-4">
                      <span className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg border-4 border-green-400">
                        Hạt giống {currentQuestionIndex + 1}
                      </span>
                      <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                        {currentQuestion.points} Điểm Phát triển
                      </span>
                      {currentQuestion.type === 'multiple_choice' && (
                        <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                          Đa hoa
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 border-4 ${
                      flaggedQuestions.has(currentQuestion.id)
                        ? 'bg-yellow-400 text-white shadow-yellow-300 border-yellow-500 scale-110'
                        : 'bg-white text-gray-500 hover:bg-yellow-50 border-gray-200 hover:border-yellow-300'
                    }`}
                    title="Đánh dấu để xem lại"
                  >
                    <FaFlag className="text-xl" />
                  </button>
                </div>
                
                {/* Question Content */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-green-800 leading-relaxed mb-6">
                    {currentQuestion.title}
                  </h2>
                  {currentQuestion.type === 'multiple_choice' && (
                    <div className="flex items-center space-x-3 text-green-700 bg-green-100 px-6 py-3 rounded-2xl inline-flex border-2 border-green-200">
                      <FaSeedling className="text-lg" />
                      <span className="font-medium">Có thể chọn nhiều hoa</span>
                    </div>
                  )}
                </div>
                
                {/* Organic Answer Options */}
                <div className="space-y-5 mb-12">
                  {currentQuestion.answers?.map((answer, index) => {
                    const isSelected = currentQuestion.type === 'multiple_choice'
                      ? (answers[currentQuestion.id] || []).includes(answer.id)
                      : answers[currentQuestion.id] === answer.id;
                    
                    const optionIcons = ['🌸', '🌺', '🌻', '🌷', '🌹'];
                    const optionIcon = optionIcons[index % optionIcons.length];
                    
                    return (
                      <label
                        key={answer.id}
                        className={`
                          group block p-6 rounded-3xl border-4 cursor-pointer transition-all duration-500
                          transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden
                          ${isSelected
                            ? 'border-green-400 bg-green-50 shadow-lg scale-[1.01] shadow-green-200'
                            : 'border-green-200 bg-white hover:border-green-300 hover:bg-green-25'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                              isSelected ? 'border-green-500 bg-green-500' : 'border-green-300 group-hover:border-green-400'
                            }`}>
                              {isSelected && <FaCheck className="text-white text-sm" />}
                            </div>
                            <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center text-2xl transition-all duration-300 ${
                              isSelected 
                                ? 'border-green-500 bg-green-500 shadow-lg' 
                                : 'border-green-300 bg-white group-hover:border-green-400 group-hover:shadow-md'
                            }`}>
                              {optionIcon}
                            </div>
                          </div>
                          <input
                            type={currentQuestion.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                            name={`question-${currentQuestion.id}`}
                            value={answer.id}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(
                              currentQuestion.id, 
                              answer.id, 
                              currentQuestion.type === 'multiple_choice'
                            )}
                            className="sr-only"
                          />
                          <span className="text-green-800 flex-1 text-xl leading-relaxed font-medium">{answer.text}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                
                {/* Nature Navigation */}
                <div className="flex items-center justify-between pt-8 border-t-4 border-green-100">
                  <Button
                    variant="outline"
                    onClick={goToPrevious}
                    disabled={currentQuestionIndex === 0}
                    className="px-8 py-4 rounded-full border-4 border-green-300 font-bold disabled:opacity-30 disabled:cursor-not-allowed bg-white text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-300"
                  >
                    <FaArrowLeft className="mr-2" />
                    Hạt giống trước
                  </Button>
                  
                  <div className="flex items-center space-x-8">
                    <span className="text-green-700 font-medium text-lg flex items-center">
                      <FaSeedling className="mr-2" />
                      {currentQuestionIndex + 1} / {mockQuestions.length}
                    </span>
                    
                    {/* Growth Progress Bar */}
                    <div className="w-64 h-6 bg-green-100 rounded-full overflow-hidden border-4 border-green-200 shadow-inner">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"
                        style={{ width: `${((currentQuestionIndex + 1) / mockQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={goToNext}
                    disabled={currentQuestionIndex === mockQuestions.length - 1}
                    className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed border-4 border-green-400 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Hạt giống sau
                    <FaArrowLeft className="ml-2 transform rotate-180" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>

      {/* Nature Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title=""
      >
        <div className="text-center relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border-4 border-green-200">
          <div className="absolute top-4 right-4 text-green-200">
            <FaFeather className="text-4xl animate-bounce" />
          </div>
          <div className="absolute bottom-4 left-4 text-green-200">
            <FaHeart className="text-3xl" />
          </div>
          
          <div className="relative z-10">
            {/* Harvest Icon */}
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-green-400 relative">
              <FaTree className="text-white text-4xl" />
              <div className="absolute -top-2 -right-2">
                <FaSun className="text-yellow-400 text-2xl animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-green-800 mb-6">
              Sẵn sàng thu hoạch vườn của bạn? 🌱
            </h3>
            <p className="text-green-700 mb-10 leading-relaxed text-lg">
              Những hạt giống kiến thức của bạn đã sẵn sàng nở hoa. Khi thu hoạch, chúng sẽ phát triển thành trí tuệ.
            </p>
            
            {/* Garden Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-10 border-4 border-green-200 shadow-lg">
              <h4 className="font-bold text-green-800 mb-6 text-xl">
                🌿 Tóm tắt Vườn 🌿
              </h4>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Tổng hạt giống', value: stats.total, icon: '🌱', color: 'bg-blue-100 border-blue-300' },
                  { label: 'Đã nở hoa', value: stats.answered, icon: '🌸', color: 'bg-green-100 border-green-300' },
                  { label: 'Đang lớn', value: stats.remaining, icon: '🌿', color: 'bg-yellow-100 border-yellow-300' },
                  { label: 'Đã đánh dấu', value: stats.flagged, icon: '🏷️', color: 'bg-orange-100 border-orange-300' }
                ].map((item, index) => (
                  <div key={index} className={`p-6 rounded-2xl border-4 ${item.color} shadow-md transform hover:scale-105 transition-all duration-300`}>
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">{item.value}</div>
                    <div className="text-gray-700 font-medium">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Warning for unfinished */}
            {stats.remaining > 0 && (
              <div className="bg-yellow-100 border-4 border-yellow-300 rounded-3xl p-6 mb-10">
                <div className="flex items-center justify-center space-x-3 text-yellow-800">
                  <FaExclamationTriangle className="text-2xl" />
                  <p className="font-bold text-lg">
                    🌱 {stats.remaining} hạt giống{stats.remaining !== 1 ? '' : ''} vẫn đang lớn!
                  </p>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-6">
              <Button
                variant="outline"
                onClick={() => setShowSubmitModal(false)}
                className="px-10 py-4 border-4 border-green-300 rounded-full font-bold text-green-700 hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
              >
                🌱 Tiếp tục Phát triển
              </Button>
              <Button
                onClick={() => {
                  alert('🌻 Vườn của bạn đã được thu hoạch! Hạt giống kiến thức giờ đây đang nở hoa! (Xem trước Thiên nhiên)');
                  setShowSubmitModal(false);
                }}
                className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg border-4 border-green-400 transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <FaTree />
                  <span>🌺 Thu hoạch Vườn</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TakeQuizNature;
