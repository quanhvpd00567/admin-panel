import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { getDifficultyColor, getQuestionTypeLabel } from '../../../constants/questions';
import { FaEdit, FaTimes, FaTrophy, FaListAlt, FaStar } from 'react-icons/fa'; // Import icons

const QuestionDetailModal = ({ isOpen, question, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Chi tiết câu hỏi"
      onClose={onClose}
      className="w-full max-w-4xl"
      style={{ maxWidth: '50rem' }}
    >
      <div className="space-y-6 p-6 max-h-[80vh] overflow-y-auto">
        {/* Question Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${getDifficultyColor(question.difficulty)}`}>
            <strong className="font-medium flex items-center">
              <FaTrophy className="w-5 h-5 mr-2" />
              Độ khó:
            </strong>
            <p className="font-semibold mt-1">{question.difficulty}</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900">
            <strong className="text-blue-700 dark:text-blue-300 flex items-center">
              <FaListAlt className="w-5 h-5 mr-2" />
              Loại:
            </strong>
            <p className="text-blue-800 dark:text-blue-400 font-semibold mt-1">
              {getQuestionTypeLabel(question.type)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900">
            <strong className="text-yellow-700 dark:text-yellow-300 flex items-center">
              <FaStar className="w-5 h-5 mr-2" />
              Điểm:
            </strong>
            <p className="text-yellow-800 dark:text-yellow-400 font-semibold mt-1">
              {question.points}
            </p>
          </div>
        </div>

        {/* Question Title */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {question.title}
          </h3>
        </div>

        {/* Question Content */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-white">Nội dung:</h4>
          <div
            className="text-gray-600 dark:text-gray-300 mt-2"
            dangerouslySetInnerHTML={{
              __html: question.content || '<p class="text-gray-400 italic">Không có nội dung</p>',
            }}
          />
        </div>

        {/* Answers */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-800 dark:text-white">Đáp án:</h4>
          <ul className="space-y-2">
            {question.answers.map((answer, idx) => (
              <li
                key={idx}
                className={`p-3 rounded-md border flex items-center ${
                  answer.isCorrect
                    ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="mr-3 flex-shrink-0">
                  {answer.isCorrect ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FaTrophy className="text-white w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <FaTimes className="text-white w-4 h-4" />
                    </div>
                  )}
                </div>
                <span>{answer.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-white">Giải thích:</h4>
            <div
              className="text-gray-600 dark:text-gray-300 mt-2"
              dangerouslySetInnerHTML={{
                __html: question.explanation || '<p class="text-gray-400 italic">Không có giải thích</p>',
              }}
            />
          </div>
        )}

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-gray-800 dark:text-white">Thẻ:</h4>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => window.open(`/questions/${question._id}/edit`, '_blank')}
            className="flex items-center"
          >
            <FaEdit className="w-5 h-5 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="primary" onClick={onClose} className="flex items-center">
            <FaTimes className="w-5 h-5 mr-2" />
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionDetailModal;
