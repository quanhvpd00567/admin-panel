import { FaTrophy, FaSmileBeam, FaStar, FaCheckCircle } from "react-icons/fa";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const QuizCompletionModal = ({ quiz, isOpen, onClose, resultData }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio('/assets/sounds/congratulations.mp3');
      audio.play();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="text-center relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border-1 border-green-200">
      <div className="relative bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-8 rounded-3xl border-4 border-yellow-300 shadow-2xl max-w-lg w-full">
        {/* Floating Stars */}
        <div className="absolute top-4 right-4 text-yellow-300">
          <FaStar className="text-4xl animate-spin-slow" />
        </div>
        <div className="absolute bottom-4 left-4 text-yellow-300">
          <FaStar className="text-3xl animate-pulse" />
        </div>
        <div className="absolute top-10 left-10 text-yellow-200">
          <FaStar className="text-2xl animate-bounce" />
        </div>
        <div className="absolute bottom-10 right-10 text-yellow-200">
          <FaStar className="text-2xl animate-bounce" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <FaTrophy className="text-7xl text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-4xl font-extrabold text-yellow-800 mb-4">Chúc mừng! 🎉</h3>
          <p className="text-yellow-700 mb-6 leading-relaxed text-lg">
            Bạn đã hoàn thành bài kiểm tra một cách xuất sắc! Hãy tiếp tục cố gắng và đạt được nhiều thành tích hơn nữa.
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            {/* show button xem chi tiết */}
            {resultData.id && quiz.showResultsImmediately && (
              <Button
                onClick={() => navigate(`/student/quizzes/${resultData.id}/results`)}
                className="mr-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <FaSmileBeam />
                  <span>Xem kết quả</span>
                </div>
              </Button>
            )}
            <Button
              onClick={onClose}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center space-x-2">
                <FaCheckCircle />
                <span>Đóng</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCompletionModal;
