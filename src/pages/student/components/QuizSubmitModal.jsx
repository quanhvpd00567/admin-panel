import { FaTree, FaSun, FaFeather, FaHeart, FaExclamationTriangle } from "react-icons/fa"
import Button from "../../../components/ui/Button"


const QuizSubmitModal = ({ stats, onCancel, onConfirm }) => {
  return (
    <div className="text-center relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border-1 border-green-200">
      <div className="absolute top-4 right-4 text-green-200">
        <FaFeather className="text-4xl animate-bounce" />
      </div>
      <div className="absolute bottom-4 left-4 text-green-200">
        <FaHeart className="text-3xl" />
      </div>

      <div className="relative z-10">

        <h3 className="text-3xl font-bold text-green-800 mb-6">Sẵn sàng nộp bài của bạn? 🌱</h3>
        <p className="text-green-700 mb-10 leading-relaxed text-lg">
          Những đáp án của bạn đã sẵn sàng nộp bài. Vui lòng kiểm tra lại tóm tắt bên dưới trước khi xác nhận nộp bài.
        </p>

        {/* Garden Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-10 border-4 border-green-200 shadow-lg">
          <h4 className="font-bold text-green-800 mb-6 text-xl">🌿 Tóm tắt bài làm 🌿</h4>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Tổng số câu", value: stats.total, icon: "🌱", color: "bg-blue-100 border-blue-300" },
              { label: "Đã làm", value: stats.answered, icon: "🌸", color: "bg-green-100 border-green-300" },
              { label: "Chưa làm", value: stats.remaining, icon: "🌿", color: "bg-yellow-100 border-yellow-300" },
              { label: "Đã đánh dấu", value: stats.flagged, icon: "🏷️", color: "bg-orange-100 border-orange-300" },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-2 rounded-2xl border-4 ${item.color} shadow-md transform hover:scale-105 transition-all duration-300`}
              >
                <div className="text-2xl font-bold text-gray-800 mb-1">{item.icon} {item.value}</div>
                <div className="text-gray-700 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <Button
            variant="danger"
            onClick={onCancel}
            className="px-5 py-2 border-1 border-green-300 rounded-full font-bold text-green-700 hover:bg-green-50 hover:text-white transition-all duration-300 hover:scale-105"
          >
            🌱 Tiếp tục làm bài
          </Button>
          <Button
            onClick={onConfirm}
            className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg border-4 border-green-400 transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <FaTree />
              <span>🌺 Nộp bài</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuizSubmitModal
