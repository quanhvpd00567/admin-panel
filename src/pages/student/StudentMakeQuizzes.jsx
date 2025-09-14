import { useState, useEffect, useRef } from "react"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { useParams, useNavigate } from "react-router-dom"
import { FaLeaf, FaTree, FaSun, FaFeather, FaHeart } from "react-icons/fa"

import Modal from "../../components/ui/Modal"
import { makeQuizAPI, studentQuizAPI } from "../../services/quizzes/index"
import { useQuizTimer } from "../../hooks/useQuizTimer"
import { useQuizState } from "../../hooks/useQuizState"

import QuizWelcomeScreen from "./components/QuizWelcomeScreen"
import QuizHeader from "./components/QuizHeader"
import QuizProgress from "./components/QuizProgress"
import QuestionCard from "./components/QuestionCard"
import QuizSubmitModal from "./components/QuizSubmitModal"
import QuizCompletionModal from "./components/QuizCompletionModal"
import { showToast } from "../../components/ui"

const StudentMakeQuizzes = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [quiz, setQuiz] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingStart, setLoadingStart] = useState(false)
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false)
  const calledRef = useRef(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [questions, setQuestions] = useState([])
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);

  const defaultTimer = { timeRemaining: null, quizStarted: false, startTimer: () => {}, formatTime: () => 'N/A' };
  const quizTimer = useQuizTimer(() => setShowSubmitModal(true));
  const timer = quiz && quiz.timeLimit ? quizTimer : defaultTimer;
  const { timeRemaining, quizStarted, startTimer, formatTime } = timer;
  const [resultData, setResultData] = useState(null);

  const {
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    shuffledAnswers,
    handleAnswerChange,
    goToQuestion,
    goToPrevious,
    goToNext,
    toggleFlag,
    getAnswerStats,
  } = useQuizState(questions, quiz.shuffleAnswers)
  // Fetch quiz data
  useEffect(() => {
    const fetchQuizDetail = async () => {
      if (calledRef.current) return
      calledRef.current = true
      try {
        setLoading(true)
        const response = await studentQuizAPI.getStudentQuiz(id)
        if (response.success) {
          setQuiz(response.data)
        } else {
          showToast.error('Error fetching quiz details');
        }
      } catch (error) {
        showToast.error("Error fetching quiz details:" + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizDetail()
  }, [id])

  // Process quiz data
  useEffect(() => {
    if (quiz && quiz.questions) {
      const total = quiz.questions.reduce((sum, question) => sum + (question.points || 0), 0)
      setTotalPoints(total)

      let processedQuestions = quiz.questions
      if (quiz.shuffleQuestions) {
        processedQuestions = [...quiz.questions].sort(() => Math.random() - 0.5)
      }
      setQuestions(processedQuestions)
    }
  }, [quiz])

  const handleStartQuiz = async () => {
    // call api update status quiz to in_progress if it's not already
    try {
      setLoadingStart(true);
      const response = await studentQuizAPI.updateStatus(id)
      if (!response.success) {
        showToast.error(response.error || 'Bắt đầu quiz thất bại. Vui lòng thử lại.');
        return;
      }
      startTimer(quiz.timeLimit)
    } catch (error) {
      showToast.error("Error starting quiz:" + error.message)
    } finally {
      setLoadingStart(false);
    }
  }

  const handleSubmit = () => {
    setShowSubmitModal(true)
  }

  const closeAndBackToList = () => {
    setShowCongratulationsModal(false);
    navigate('/student/assigned-quizzes');
  }

  const handleConfirmSubmit = async () => {
    // thời gian nộp bài
    const submissionTime = (quiz.timeLimit * 60) - timeRemaining;
    const dataSubmission = { answers, submissionTime };
    // show loading state if needed
    setLoading(true);
    try {
      const response = await makeQuizAPI.studentSubmissions(id, dataSubmission)
      if (response.success) {
        showToast.success("Hoàn thành bài kiểm tra thành công!");
        setShowCongratulationsModal(true);
        setResultData(response.data);
        setIsDisabledSubmit(true);
      } else {
        showToast.error('Error submitting quiz');
      }
    } catch (error) {
      showToast.error("Error submitting quiz:" + error.message)
      setIsDisabledSubmit(false);
    } finally {
      setLoading(false);
    }
    // Here you can send dataSubmission to your backend if needed
    setShowSubmitModal(false)
  }

  const stats = getAnswerStats()
  const currentQuestion = questions[currentQuestionIndex]

  if (loading) {
    return <LoadingSpinner color="green" />
  }

  if (!quiz || Object.keys(quiz).length === 0 || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Bài kiểm tra không tồn tại</h2>
          <button
            onClick={() => navigate('/student/quizzes')}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Quay lại danh sách bài kiểm tra
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Background Elements */}
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
            <FaSun className="text-9xl animate-spin" style={{ animationDuration: "20s" }} />
          </div>
        </div>

        {/* Header */}
        {quizStarted && (
          <QuizHeader
            quiz={quiz}
            currentQuestionIndex={currentQuestionIndex}
            totalPoints={totalPoints}
            timeRemaining={timeRemaining}
            formatTime={formatTime}
            stats={stats}
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {!quizStarted ? (
            <QuizWelcomeScreen loadingStart={loadingStart} quiz={quiz} totalPoints={totalPoints} onStartQuiz={handleStartQuiz} />
          ) : (
            <div>
              <QuizProgress
                stats={stats}
                questions={questions}
                answers={answers}
                flaggedQuestions={flaggedQuestions}
                currentQuestionIndex={currentQuestionIndex}
                goToQuestion={goToQuestion}
                onSubmit={handleSubmit}
                isDisabledSubmit={isDisabledSubmit}
              />

              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  questionIndex={currentQuestionIndex}
                  totalQuestions={questions.length}
                  shuffledAnswers={shuffledAnswers}
                  answers={answers}
                  flaggedQuestions={flaggedQuestions}
                  onAnswerChange={handleAnswerChange}
                  onToggleFlag={toggleFlag}
                  onPrevious={goToPrevious}
                  onNext={goToNext}
                  isDisabledSubmit={isDisabledSubmit}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submit Modal */}
      <Modal isOpen={showSubmitModal} size="lg" onClose={() => setShowSubmitModal(false)} title="">
        <QuizSubmitModal stats={stats} onCancel={() => setShowSubmitModal(false)} onConfirm={handleConfirmSubmit} />
      </Modal>

      {/* Congratulations Modal */}
      <Modal isOpen={showCongratulationsModal} size="md" onClose={closeAndBackToList} title="">
        <QuizCompletionModal quiz={quiz} isOpen={showCongratulationsModal} resultData={resultData} onClose={() => setShowCongratulationsModal(false)} />
      </Modal>
    </>
  )
}

export default StudentMakeQuizzes
