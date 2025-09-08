import { FaClock, FaQuestionCircle, FaSeedling, FaSun, FaTree } from "react-icons/fa"

const QuizHeader = ({ quiz, currentQuestionIndex, totalPoints, timeRemaining, formatTime, stats }) => {
  return (
    <div className="relative z-10 bg-white/80 backdrop-blur-lg border-b-4 border-green-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="border-l-4 border-green-300 pl-6">
              <h1 className="text-3xl font-bold text-green-800 flex items-center">
                <FaSeedling className="mr-3 text-green-600" />
                {quiz.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-green-500">🌱</span>
                <span className="text-green-600 bg-green-100 px-4 py-1 rounded-full">
                  {totalPoints} Điểm
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Nature Timer */}
            <div
              className={`relative p-6 rounded-full border-4 ${
                timeRemaining < 300
                  ? "bg-red-100 border-red-300 text-red-700"
                  : "bg-green-100 border-green-300 text-green-700"
              } shadow-lg`}
            >
              <div className="flex items-center space-x-3">
                <FaClock className="text-2xl" />
                <div className="text-center">
                  <div className="font-mono text-2xl font-bold">{formatTime(timeRemaining)}</div>
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
                  <circle cx="48" cy="48" r="40" stroke="#d1fae5" strokeWidth="8" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#growthGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.answered / stats.total)}`}
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
                    <div className="text-sm font-bold text-green-700">
                      {stats.answered}/{stats.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizHeader
