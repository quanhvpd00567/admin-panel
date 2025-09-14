import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../../services/quizzes/index';
import { questionAPI } from '../../services/questions/questionAPI';
import { format } from 'date-fns';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaArrowLeft, FaEye, FaCopy, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import QRCode from 'react-qr-code';
import QuestionDetailModal from './steps/QuestionDetailModal';
import ModalChild from './components/ModalChild';
import { LoadingSpinner, showToast } from '../../components/ui';
import { getClassNameByCode } from '../../constants/classes'; // Import CLASS_OPTIONS
import { getDifficultyLabel } from '../../constants/questions'; // Import DIFFICULTY_LEVELS


const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSelectChildOpen, setIsModalSelectChildOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const calledRef = useRef(false);

  useEffect(() => {
    const fetchQuizDetail = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      try {
        setLoading(true);
        const response = await quizAPI.getQuiz(id);
        if (response.success) {
          setQuiz(response.data);
        } else {
          showToast.error('Không thể lấy thông tin bài kiểm tra');
        }
      } catch {
        showToast.error('Đã xảy ra lỗi khi lấy thông tin bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetail();
  }, [id]);

  useEffect(() => {
    if (quiz && quiz.questions) {
      const total = quiz.questions.reduce((sum, question) => sum + (question.points || 0), 0);
      setTotalPoints(total);
    }
  }, [quiz]);

  const openModal = (question) => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await questionAPI.getQuestion(question._id);
        if (response.success) {
          setSelectedQuestion(response.data);
          setIsModalOpen(true);
        } else {
          showToast.error('Không thể lấy thông tin câu hỏi');
        }
      } catch {
        showToast.error('Đã xảy ra lỗi khi lấy thông tin câu hỏi');
      }
    };
    fetchQuestionDetails();
  };

  const closeModal = () => {
    setSelectedQuestion(null);
    setIsModalOpen(false);
  };

  const closeModalSelectChild = () => {
    setIsModalSelectChildOpen(false);
  }

  const openModalSelectChild = () => {
    setIsModalSelectChildOpen(true);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!quiz) {
    return <div className="text-center py-6">Không tìm thấy bài kiểm tra.</div>;
  }

  // function copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast.success('Đã sao chép vào clipboard');
    }).catch(() => {
      showToast.error('Không thể sao chép vào clipboard');
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/quizzes')} className="flex items-center">
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Danh sach bài kiểm tra
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Chi tiết bài kiểm tra</h1>
      </div>

      {/* Thông tin cơ bản */}
      <Card className="mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">{quiz.title}</h2>
        {/* button giao bài tập */}
        <div className="mb-4 flex justify-end">
          <Button
            variant="primary"
            onClick={() => openModalSelectChild()}
            disabled={isModalSelectChildOpen}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 rounded-lg shadow-lg transition-all duration-300 flex items-center"
          >
            <FaEye className="w-5 h-5 mr-2" /> Giao bài tập
          </Button>
        </div>
        
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 text-left">
            Mô tả
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"
            rows="4"
            value={quiz.description || 'Không có mô tả'}
            readOnly
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 text-left">
            Chủ đề : <span className='font-bold text-green-800 dark:text-green-200'>{quiz.subject.name || 'Chưa xác định'}</span>
          </label>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 text-left">
            Ngày tạo: <span className="font-bold text-green-800 dark:text-green-200">
              {quiz.createdAt
                ? format(new Date(quiz.createdAt), 'dd/MM/yyyy HH:mm')
                : 'Không xác định'
              }
            </span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Tổng điểm:</span>
            <span className="text-lg font-bold text-red-500 dark:text-red-400">{totalPoints || 0}</span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Số câu hỏi:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{quiz.questions.length}</span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Thời gian:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{quiz.timeLimit} phút</span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Lớp:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{getClassNameByCode(quiz.class)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Độ khó:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{getDifficultyLabel(quiz.difficulty)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Số lần tối đa:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{quiz.maxAttempts}</span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Điểm đạt:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{quiz.passingScore}%</span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Xáo trộn câu hỏi:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {quiz.shuffleQuestions ? 'Có' : 'Không'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Xáo trộn đáp án:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {quiz.shuffleAnswers ? 'Có' : 'Không'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Hiển thị đáp án:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {quiz.showCorrectAnswers ? 'Có' : 'Không'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Hiển thị kết quả ngay lập tức:</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {quiz.showResultsImmediately ? 'Có' : 'Không'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-left w-32 text-sm font-medium text-gray-600 dark:text-gray-300">Mật khẩu:</span>
            <div className="flex items-center space-x-2">
              {quiz.password ? (
                <>
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {showPassword ? quiz.password : '*******'}
                  </span>
                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4" title="Hiện mật khẩu" />
                    ) : (
                      <FaEye className="w-4 h-4" title="Ẩn mật khẩu" />
                    )}
                  </button>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Không có</span>
              )}
            </div>
          </div>
        </div>
        {quiz.isQrCode && (
          <div className="flex justify-center mt-6">
            {/* Button show icon QR Code */}
            <Button
              variant="primary"
              onClick={() => setShowQRCode(!showQRCode)}
              className="px-4 py-2 flex items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 rounded-md shadow-md transition-all duration-300"
            >
              {showQRCode ? (<FaEyeSlash className="w-4 h-4 mr-2" title="Ẩn QR" />) : (<FaEye className="w-4 h-4 mr-2" title="Hiện QR" />)}
              {showQRCode ? 'Ẩn QR' : 'Hiển thị QR'}
            </Button>
          </div>
        )}

        {showQRCode && (
          <div className="mt-6 flex justify-center">
            <QRCode className='w-32 h-32' value={`${window.location.origin}/quizzes/${id}`} />
          </div>
        )}
        
        {quiz.dataQrCode && (
          <div className="mt-4 text-center">
            {/* Add button copy */}
            <div className="w-full flex justify-center items-center">
              <input
                type="text"
                className="w-full text-gray-800 border border-gray-300 rounded-l-md p-2  dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={`${window.location.origin}/quizzes/${id}`}
                readOnly
              />
              <button
                onClick={() => copyToClipboard(`${window.location.origin}/quizzes/${id}`)}
                className="bg-purple-600 text-white px-4 rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ height: '40px' }} // Đảm bảo chiều cao của nút bằng với input
              >
                <FaCopy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Danh sách câu hỏi */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Danh sách câu hỏi</h3>
        {quiz.questions.length > 0 ? (
          <ul className="space-y-4">
            {quiz.questions.map((question, index) => {
              let typeBg = 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
              if (question.type === 'essay') typeBg = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
              if (question.type === 'true_false') typeBg = 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
              if (question.type === 'fill_blank') typeBg = 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
              if (question.type === 'multiple_choice') typeBg = 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';
              return (
                <li
                  key={question._id}
                  className="p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      Câu {index + 1}: {question.title}
                    </span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
                      {question.points || 0} điểm
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${typeBg}`}>
                      {question.type}
                    </span>
                    <Button
                      variant="outline"
                      className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 hover:from-blue-200 hover:via-purple-200 hover:to-pink-200 text-blue-900 font-bold rounded shadow transition-all duration-300 border border-blue-300 dark:bg-gradient-to-r dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 dark:text-white dark:border-blue-800"
                      onClick={() => openModal(question)}
                    >
                      <FaEye className="w-3 h-3 mr-1" title="Xem chi tiết" />
                      Xem chi tiết
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-left">Không có câu hỏi nào.</p>
        )}
      </Card>

      {isModalOpen && selectedQuestion && (
        <QuestionDetailModal
          isOpen={isModalOpen}
          question={selectedQuestion}
          onClose={closeModal}
        />
      )}

      <ModalChild id={id} isOpen={isModalSelectChildOpen} onClose={closeModalSelectChild} />
    </div>
  );
};

export default QuizDetail;
