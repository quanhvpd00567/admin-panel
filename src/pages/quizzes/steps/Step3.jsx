import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { CLASS_OPTIONS } from '../../../constants/classes';
import QuestionDetailModal from './QuestionDetailModal'; // Import modal
import { FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import icons
import { subjectAPI } from '../../../services/subjectAPI'; // Import subjectAPI
import { format } from 'date-fns';
import { showToast } from '../../../components/ui';

const Step3 = ({ basic, onNext, onBack }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null); // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [subjectName, setSubjectName] = useState(basic.subject || 'Không có'); // State for subject name
  const isFormValid = basic.questions.length > 0; // Ensure at least one question is selected

  // Fetch subject details if subject ID exists
  useEffect(() => {
    const fetchSubjectDetails = async () => {
      if (basic.subject) {
        try {
          const response = await subjectAPI.getSubject(basic.subject);
          if (response.success) {
            setSubjectName(response.data.subject.name || 'Không có');
          } else {
            console.error('Failed to fetch subject details:', response.error);
            setSubjectName('Không có');
          }
        } catch (error) {
          showToast.error('Error fetching subject details');
          setSubjectName('Không có');
        }
      }
    };

    fetchSubjectDetails();
  }, [basic.subject]);

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question); // Set the selected question
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null); // Clear the selected question
    setIsModalOpen(false); // Close the modal
  };

  const totalPoints = basic.questions.reduce((sum, question) => sum + (question.points || 0), 0); // Tính tổng điểm

  return (
    <Card title="Bước 3: Xem trước">
      <div className="space-y-8">
        {/* Thông tin Quiz */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Thông tin Quiz</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            <div className="col-span-2 flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Tên Quiz:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.title}</p>
            </div>
            <div className="col-span-2 flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Chủ đề:</strong>
              <p className="text-gray-800 dark:text-gray-200">{subjectName}</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Lớp:</strong>
              <p className="text-gray-800 dark:text-gray-200">
                {CLASS_OPTIONS.find((c) => c.code === basic.class)?.name || 'Không xác định'}
              </p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Thời gian:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.timeLimit} phút</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Số câu hỏi đã chọn:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.questions.length}</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Điểm đạt:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.passingScore}%</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Số lần làm tối đa:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.maxAttempts}</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Trạng thái:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.isActive ? 'Hoạt động' : 'Không hoạt động'}</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Công khai:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.isPublic ? 'Có' : 'Không'}</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Hạn chót:</strong>
              <p className="text-gray-800 dark:text-gray-200">
                {basic.deadline
                  ? format(new Date(basic.deadline), 'yyyy-MM-dd HH:mm')
                  : 'Không có'}
              </p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Trộn câu hỏi:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.shuffleQuestions ? 'Có' : 'Không'}</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Trộn đáp án:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.shuffleAnswers ? 'Có' : 'Không'}</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Hiển thị kết quả ngay:</strong>
              <p className="text-gray-800 dark:text-gray-200">{basic.showResultsImmediately ? 'Có' : 'Không'}</p>
            </div>
            <div className="flex">
              <strong className="text-left text-gray-700 dark:text-gray-300 w-48">Tổng điểm:</strong>
              <p className="text-gray-800 dark:text-gray-200">{totalPoints}</p>
            </div>
            <div className="col-span-2">
              <strong className="text-left text-gray-700 dark:text-gray-300 block mb-2">Hướng dẫn:</strong>
              <p className="text-left text-gray-800 dark:text-gray-200">{basic.instructions || 'Không có'}</p>
            </div>
          </div>
        </div>

        {/* Xem trước câu hỏi */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Danh sách câu hỏi</h3>
          {basic.questions.length > 0 ? (
            <ul className="space-y-4">
              {basic.questions.map((question, index) => (
                <li
                  key={index}
                  className="p-4 border rounded-lg bg-white dark:bg-gray-700 shadow-sm flex items-start"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200 mr-4">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="text-gray-800 dark:text-gray-200 font-medium text-left">{question.title}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span className="mr-6">
                        <strong>Độ khó:</strong> {question.difficulty}
                      </span>
                      <span>
                        <strong>Điểm:</strong> {question.points}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewQuestion(question)}
                      className="flex items-center text-sm"
                    >
                      <FaEye className="w-4 h-4 mr-2" />
                      Xem
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Chưa có câu hỏi nào được chọn.</p>
          )}
        </div>

        {/* Nút điều hướng */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onBack(basic)} className="px-6 py-2 flex items-center">
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <Button variant="primary" onClick={onNext} disabled={!isFormValid} className="px-6 py-2 flex items-center">
            <FaArrowRight className="w-5 h-5 mr-2" />
            Tiếp tục
          </Button>
        </div>
      </div>

      {/* Question Detail Modal */}
      {isModalOpen && selectedQuestion && (
        <QuestionDetailModal
          isOpen={isModalOpen}
          question={selectedQuestion}
          onClose={handleCloseModal}
        />
      )}
    </Card>
  );
};

export default Step3;
