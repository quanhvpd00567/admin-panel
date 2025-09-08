import { FaFlag, FaFeather, FaLeaf, FaSeedling, FaCheck, FaArrowLeft } from "react-icons/fa"
import Button from "../../../components/ui/Button"

const QuestionCard = ({
  question,
  questionIndex,
  totalQuestions,
  shuffledAnswers,
  answers,
  flaggedQuestions,
  onAnswerChange,
  onToggleFlag,
  onPrevious,
  onNext,
}) => {
  const optionIcons = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌿', '', '🍀', '🍃', '🍂', '🍁', '🪴', '🥀']

  return (
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
          <div className="flex items-center justify-between mb-2 pb-2 border-b-4 border-green-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md border-1 border-green-400">
                  Câu {questionIndex + 1}
                </span>
                <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                  {question.points} Điểm
                </span>
                {question.type === "multiple_choice" && (
                  <div className="flex items-center space-x-3 text-green-700 bg-green-100 px-6 py-2 rounded-2xl inline-flex border-2 border-green-200">
                    <FaSeedling className="text-lg" />
                    <span className="font-medium">Có thể chọn nhiều đáp án</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onToggleFlag(question._id)}
              className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 border-4 ${flaggedQuestions.has(question._id)
                ? "bg-yellow-400 text-white shadow-yellow-300 border-yellow-500 scale-110"
                : "bg-white text-gray-500 hover:bg-yellow-50 border-gray-200 hover:border-yellow-300"
                }`}
              title="Đánh dấu để xem lại"
            >
              <FaFlag className="text-xl" />
            </button>
          </div>

          {/* Question Content */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-green-800 leading-relaxed mb-2">{question.title}</h2>
            <div
              className="text-green-600 dark:text-green-600 mt-2"
              dangerouslySetInnerHTML={{
                __html: question.content || '<p class="text-gray-400 italic">Không có nội dung</p>',
              }}
            />

          </div>

          {/* Answer Options */}
          <div className="space-y-5 mb-12">

            {question.type === "fill_blank" ? (
              <input
                type="text"
                name="fill-blank"
                className={`border-2 border-green-300 bg-[#ADD8E6] rounded-md p-2 transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-500`}
                placeholder="Nhập câu trả lời..."
                value={answers[question._id] || ""}
                onChange={(e) => onAnswerChange(question._id, e.target.value, false)}
              />
            ) : (
              shuffledAnswers?.map((answer, index) => {
                const isSelected =
                  question.type === "multiple_choice"
                    ? (answers[question._id] || []).includes(answer._id)
                    : answers[question._id] === answer._id

                const optionIcon = optionIcons[index % optionIcons.length]

                return (
                  <label
                    key={answer._id}
                    className={`
                    group block p-2 rounded-3xl border-4 cursor-pointer transition-all duration-500
                    transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden
                    ${isSelected
                        ? "border-green-400 bg-green-50 shadow-lg scale-[1.01] shadow-green-200"
                        : "border-green-200 bg-white hover:border-green-300 hover:bg-green-25"
                      }
                  `}
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-5 h-5 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${isSelected ? "border-green-500 bg-green-500" : "border-green-300 group-hover:border-green-400"
                            }`}
                        >
                          {isSelected && <FaCheck className="text-white text-sm" />}
                        </div>
                        <div
                          className={`w-10 h-10 rounded-full border-4 flex items-center justify-center text-2xl transition-all duration-300 ${isSelected
                            ? "border-green-500 bg-green-500 shadow-lg"
                            : "border-green-300 bg-white group-hover:border-green-400 group-hover:shadow-md"
                            }`}
                        >
                          {optionIcon}
                        </div>
                      </div>
                      {/* nếu type = fill_blank thì input là text box */}

                      <input
                        type={question.type === "multiple_choice" ? "checkbox" : "radio"}
                        name={`question-${question._id}`}
                        value={answer._id}
                        checked={isSelected}
                        onChange={() => onAnswerChange(question._id, answer._id, question.type === "multiple_choice")}
                        className="sr-only"
                      />
                      <span className="text-green-800 flex-1 text-sm leading-relaxed font-medium">{answer.text}</span>
                    </div>
                  </label>
                )
              })
            )}

          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t-4 border-green-100">
            <Button
              onClick={onPrevious}
              disabled={questionIndex === 0}
              className="px-8 py-4 rounded-full border-4 border-green-300 font-bold disabled:opacity-30 disabled:cursor-not-allowed bg-white text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Câu trước
            </Button>

            <div className="flex items-center space-x-8">
              <span className="text-green-700 font-medium text-lg flex items-center">
                <FaSeedling className="mr-2" />
                {questionIndex + 1} / {totalQuestions}
              </span>

              {/* Progress Bar */}
              <div className="w-64 h-6 bg-green-100 rounded-full overflow-hidden border-4 border-green-200 shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"
                  style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            <Button
              onClick={onNext}
              disabled={questionIndex === totalQuestions - 1}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed border-4 border-green-400 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Câu sau
              <FaArrowLeft className="ml-2 transform rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
