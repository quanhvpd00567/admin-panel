import { FaPlay, FaSeedling, FaSun, FaFeather, FaLeaf, FaExclamationTriangle } from "react-icons/fa"
import Button from "../../../components/ui/Button"

const QuizWelcomeScreen = ({ loadingStart, quiz, totalPoints, onStartQuiz }) => {
  return (
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

            <h2 className="text-4xl font-bold text-green-800 mb-6">🌱 Chào mừng đến với Vườn Kiến thức 🌱</h2>
            <h3 className="text-2xl font-semibold text-green-700 mb-8">
              {quiz.title || "Bài kiểm tra không có tiêu đề"}
            </h3>

            {/* Quiz Info */}
            <div className="bg-green-50 rounded-2xl p-6 mb-8 border-2 border-green-200">
              <h4 className="font-bold text-green-800 mb-4 text-lg">📋 Thông tin Bài kiểm tra</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-xl p-4 border-2 border-green-100">
                  <div className="text-2xl mb-2">⏰</div>
                  <div className="font-bold text-green-800">{quiz.timeLimit} phút</div>
                  <div className="text-sm text-green-600">Thời gian</div>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-green-100">
                  <div className="text-2xl mb-2">🌱</div>
                  <div className="font-bold text-green-800">{quiz.questions?.length || 0} câu</div>
                  <div className="text-sm text-green-600">Hạt giống</div>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-green-100">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-bold text-green-800">{totalPoints} điểm</div>
                  <div className="text-sm text-green-600">Tổng điểm</div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-left bg-yellow-50 rounded-2xl p-6 mb-8 border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-4 text-lg flex items-center">
                <FaExclamationTriangle className="mr-2" />📖 Hướng dẫn
              </h4>
            </div>

            {/* Start Button */}
            <Button
              onClick={onStartQuiz}
              disabled={loadingStart}
              className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-lg border-4 border-green-400 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                {loadingStart ? (
                  <>
                    <FaSun className="animate-spin text-lg" />
                    <span>Đang chuẩn bị...</span>
                  </>
                ) : (
                  <>
                    <FaPlay className="text-lg" />
                    <span>Bắt đầu làm bài</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizWelcomeScreen
