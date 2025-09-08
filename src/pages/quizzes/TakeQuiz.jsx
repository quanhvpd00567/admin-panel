import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaClock, 
  FaQuestionCircle, 
  FaArrowLeft, 
  FaArrowRight, 
  FaFlag,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import mockQuizAPI from '../../services/mockQuizAPI';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Use demo quiz ID if no ID provided (for demo route)
  const quizId = id || 'quiz-001';
  
  // Quiz state
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        
        // Use mock API for testing
        const [quizResult, questionsResult] = await Promise.all([
          mockQuizAPI.getQuiz(quizId),
          mockQuizAPI.getQuestions({ quizId: quizId })
        ]);
        
        if (quizResult.success && questionsResult.success) {
          setQuiz(quizResult.data);
          setQuestions(questionsResult.data.questions);
          
          // Initialize timer
          if (quizResult.data.timeLimit) {
            setTimeRemaining(quizResult.data.timeLimit * 60); // Convert to seconds
            setTimerActive(true);
          }
          
          // Initialize answers object
          const initialAnswers = {};
          questionsResult.data.questions.forEach(q => {
            initialAnswers[q.id] = q.type === 'multiple_choice' ? [] : '';
          });
          setAnswers(initialAnswers);
        } else {
          setError('Failed to load quiz');
        }
      } catch (err) {
        setError('Error loading quiz');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);
  
  // Timer countdown
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, handleSubmitQuiz]);
  
  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle answer selection
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
  
  // Navigation functions
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };
  
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Flag question
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
  
  // Submit quiz
  const handleSubmitQuiz = useCallback(async () => {
    try {
      setSubmitting(true);
      setTimerActive(false);
      
      const submissionData = {
        quizId: quizId,
        answers,
        timeSpent: quiz?.timeLimit ? (quiz.timeLimit * 60 - timeRemaining) : 0,
        flaggedQuestions: Array.from(flaggedQuestions)
      };
      
      // Use mock API for testing
      const result = await mockQuizAPI.submitQuiz(submissionData);
      
      if (result.success) {
        navigate(`/quiz-result/${result.data.attemptId}`, {
          state: { quiz, score: result.data.score }
        });
      } else {
        setError('Failed to submit quiz');
        setSubmitting(false);
      }
    } catch (err) {
      setError('Error submitting quiz');
      setSubmitting(false);
      console.error(err);
    }
  }, [quizId, answers, quiz, timeRemaining, flaggedQuestions, navigate]);
  
  // Get answer statistics
  const getAnswerStats = () => {
    const answered = Object.values(answers).filter(answer => 
      Array.isArray(answer) ? answer.length > 0 : answer !== ''
    ).length;
    const flagged = flaggedQuestions.size;
    const remaining = questions.length - answered;
    
    return { answered, flagged, remaining, total: questions.length };
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </Card>
      </div>
    );
  }
  
  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <FaQuestionCircle className="text-4xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 mb-4">The quiz you&apos;re looking for doesn&apos;t exist or has no questions.</p>
          <Button onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </Card>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const stats = getAnswerStats();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">{quiz.title}</h1>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              {quiz.timeLimit && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                  timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <FaClock />
                  <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
              )}
              
              {/* Progress */}
              <div className="text-sm text-gray-600">
                {stats.answered}/{stats.total} answered
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Questions</h3>
              
              {/* Stats */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-semibold text-green-600">{stats.answered}</span>
                </div>
                <div className="flex justify-between">
                  <span>Flagged:</span>
                  <span className="font-semibold text-yellow-600">{stats.flagged}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-semibold text-gray-600">{stats.remaining}</span>
                </div>
              </div>
              
              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => {
                  const isAnswered = Array.isArray(answers[question.id]) 
                    ? answers[question.id].length > 0 
                    : answers[question.id] !== '';
                  const isFlagged = flaggedQuestions.has(question.id);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={`
                        w-10 h-10 rounded-lg border-2 text-sm font-semibold
                        transition-colors duration-200 relative
                        ${isCurrent
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : isAnswered
                          ? 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {index + 1}
                      {isFlagged && (
                        <FaFlag className="absolute -top-1 -right-1 text-yellow-500 text-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Submit Button */}
              <Button
                onClick={() => setShowSubmitModal(true)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Submit Quiz
                  </>
                )}
              </Button>
            </Card>
          </div>
          
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion.id)
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  title="Flag for review"
                >
                  <FaFlag />
                </button>
              </div>
              
              {/* Question Content */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  {currentQuestion.title}
                </h2>
                
                {currentQuestion.content?.text && (
                  <div 
                    className="prose max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: currentQuestion.content.text }}
                  />
                )}
                
                {currentQuestion.content?.code && (
                  <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <pre className="text-sm overflow-x-auto">
                      <code>{currentQuestion.content.code.content}</code>
                    </pre>
                  </div>
                )}
              </div>
              
              {/* Answer Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.answers?.map((answer) => {
                  const isSelected = currentQuestion.type === 'multiple_choice'
                    ? (answers[currentQuestion.id] || []).includes(answer.id)
                    : answers[currentQuestion.id] === answer.id;
                  
                  return (
                    <label
                      key={answer.id}
                      className={`
                        block p-4 rounded-lg border cursor-pointer transition-colors
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-3">
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
                          className="mt-1"
                        />
                        <span className="text-gray-800">{answer.text}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <FaArrowLeft className="mr-2" />
                  Previous
                </Button>
                
                <span className="text-sm text-gray-500">
                  {currentQuestionIndex + 1} of {questions.length}
                </span>
                
                <Button
                  onClick={goToNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                  <FaArrowRight className="ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Quiz"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to submit your quiz? Once submitted, you cannot make changes.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Summary:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span>{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Answered:</span>
                <span className="text-green-600">{stats.answered}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <span className="text-red-600">{stats.remaining}</span>
              </div>
              <div className="flex justify-between">
                <span>Flagged:</span>
                <span className="text-yellow-600">{stats.flagged}</span>
              </div>
            </div>
          </div>
          
          {stats.remaining > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                <FaExclamationTriangle className="inline mr-1" />
                You have {stats.remaining} unanswered question{stats.remaining !== 1 ? 's' : ''}.
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
              disabled={submitting}
            >
              Continue Quiz
            </Button>
            <Button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TakeQuiz;
