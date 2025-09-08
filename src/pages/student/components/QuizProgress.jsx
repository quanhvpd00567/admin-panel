import { FaMountain, FaHeart, FaFlag, FaSeedling, FaCheck } from "react-icons/fa"
import Button from "../../../components/ui/Button"

const QuizProgress = ({
  stats,
  questions,
  answers,
  flaggedQuestions,
  currentQuestionIndex,
  goToQuestion,
  onSubmit,
}) => {
  return (
    <div className="mb-6">
      <div className="p-4 bg-white/90 backdrop-blur-sm border-3 border-green-200 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Progress Title */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-green-800 mb-2 flex items-center text-base">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                <FaMountain className="text-white text-sm" />
              </div>
              Tiến độ làm bài
            </h3>
          </div>

          {/* Stats */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {[
                {
                  label: "Đã làm",
                  value: stats.answered,
                  icon: FaHeart,
                  color: "bg-green-100 border-green-300 text-green-700",
                },
                {
                  label: "Đánh dấu xem lại",
                  value: stats.flagged,
                  icon: FaFlag,
                  color: "bg-yellow-100 border-yellow-300 text-yellow-700",
                },
                {
                  label: "Chưa làm",
                  value: stats.remaining,
                  icon: FaSeedling,
                  color: "bg-gray-100 border-gray-300 text-gray-700",
                },
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
                scrollbarWidth: "thin",
                scrollbarColor: "#86efac #dcfce7",
              }}
            >
              <div className="grid grid-cols-8 gap-1 p-1.5">
                {questions.map((question, index) => {
                  const isAnswered = Array.isArray(answers[question._id])
                    ? answers[question._id]?.length > 0
                    : answers[question._id] !== undefined && answers[question._id] !== ""
                  const isFlagged = flaggedQuestions.has(question._id)
                  const isCurrent = index === currentQuestionIndex

                  return (
                    <button
                      key={question._id}
                      onClick={() => goToQuestion(index)}
                      className={`
                        relative w-6 h-6 rounded-md text-xs font-bold border shadow-sm
                        transition-all duration-300 transform hover:scale-110
                        ${
                          isCurrent
                            ? "bg-green-500 border-green-600 text-white shadow-green-300 scale-110 z-10"
                            : isAnswered
                              ? "bg-green-300 border-green-400 text-green-800 shadow-green-200"
                              : "bg-white border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                        }
                      `}
                      title={`Câu hỏi ${index + 1}${isAnswered ? " (Đã trả lời)" : ""}${isFlagged ? " (Đã đánh dấu)" : ""}`}
                    >
                      {isAnswered ? (
                        <FaHeart className="w-full h-full p-0.5" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                      {isFlagged && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full flex items-center justify-center border border-white shadow-sm">
                          <FaFlag className="text-red text-xs" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Navigation for Large Quiz */}
            {questions.length > 20 && (
              <div className="mt-2 flex justify-between items-center text-xs">
                <button
                  onClick={() => goToQuestion(0)}
                  className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                >
                  Đầu
                </button>
                <span className="text-green-600 font-medium text-xs">
                  {Math.floor(currentQuestionIndex / 10) + 1}/{Math.ceil(questions.length / 10)}
                </span>
                <button
                  onClick={() => goToQuestion(questions.length - 1)}
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
              onClick={onSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-green-400"
            >
              <div className="flex items-center justify-center space-x-1.5">
                <FaCheck className="text-sm" />
                <span className="text-sm">Nộp bài</span>
                <FaSeedling className="text-sm" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizProgress
