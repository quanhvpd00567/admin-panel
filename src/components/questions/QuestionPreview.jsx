import React, { useState } from 'react';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaPaperPlane } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import { feedbackAPI } from '../../services/questions/feedbackAPI';

const QuestionPreview = ({ question, isOpen, onClose }) => {
  const { addToast } = useToast();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('error'); // error, suggestion, other
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  if (!isOpen || !question) return null;

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      addToast('Vui lòng nhập nội dung phản hồi', 'error');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const result = await feedbackAPI.submitQuestionFeedback(question._id, {
        type: feedbackType,
        content: feedbackText.trim(),
        questionTitle: question.title
      });
      
      if (result.success) {
        addToast('Cảm ơn phản hồi của bạn! Chúng tôi sẽ xem xét và cập nhật câu hỏi này.', 'success');
        setFeedbackText('');
        setShowFeedback(false);
      } else {
        addToast(result.error || 'Có lỗi xảy ra khi gửi phản hồi', 'error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      addToast('Có lỗi xảy ra khi gửi phản hồi', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setFeedbackText('');
    setFeedbackType('error');
  };

  const renderAnswer = (answer, index) => {
    const isCorrect = answer.isCorrect;
    
    return (
      <div 
        key={index}
        className={`p-3 rounded-lg border-2 ${
          isCorrect 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {String.fromCharCode(65 + index)}.
            </span>
            <span 
              className="text-gray-900 dark:text-white"
              dangerouslySetInnerHTML={{ __html: answer.text }}
            />
          </div>
          {isCorrect && (
            <FaCheckCircle className="text-green-500 h-5 w-5" />
          )}
        </div>
        {answer.explanation && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 ml-6">
            <strong>Giải thích:</strong> 
            <span 
              className="ml-1"
              dangerouslySetInnerHTML={{ __html: answer.explanation }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Xem trước câu hỏi
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <FaTimes className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <Card className="p-6">
              {/* Question info */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {question.type}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {question.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {question.points || 1} điểm
                  </span>
                </div>
                
                {question.subject && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Môn học:</strong> {question.subject.name || question.subject}
                  </div>
                )}
                
                {question.topic && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <strong>Chủ đề:</strong> {question.topic}
                  </div>
                )}
              </div>

              {/* Question text */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Câu hỏi:
                </h4>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div 
                    className="text-gray-900 dark:text-white"
                    dangerouslySetInnerHTML={{ __html: question.title }}
                  />
                  {question.content && (
                    <div 
                      className="mt-2 text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: question.content }}
                    />
                  )}
                </div>
              </div>

              {/* Answers */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Đáp án:
                </h4>
                <div className="space-y-3">
                  {question.answers && question.answers.map((answer, index) => 
                    renderAnswer(answer, index)
                  )}
                </div>
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Giải thích:
                  </h4>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div 
                      className="text-gray-900 dark:text-white"
                      dangerouslySetInnerHTML={{ __html: question.explanation }}
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Thẻ:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Feedback Section */}
            <Card className="mt-4">
              <div className="p-4">
                {!showFeedback ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <FaExclamationTriangle className="h-4 w-4" />
                      <span className="text-sm">Phát hiện lỗi trong câu hỏi này?</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowFeedback(true)}
                    >
                      <FaExclamationTriangle className="mr-2 h-4 w-4" />
                      Báo cáo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Báo cáo vấn đề với câu hỏi
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCloseFeedback}
                      >
                        <FaTimes className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Loại vấn đề:
                      </label>
                      <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="error">Lỗi trong câu hỏi hoặc đáp án</option>
                        <option value="suggestion">Đề xuất cải thiện</option>
                        <option value="unclear">Câu hỏi không rõ ràng</option>
                        <option value="difficulty">Độ khó không phù hợp</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mô tả chi tiết vấn đề: *
                      </label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Vui lòng mô tả cụ thể vấn đề bạn phát hiện hoặc đề xuất cải thiện..."
                        rows={4}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Phản hồi của bạn giúp chúng tôi cải thiện chất lượng câu hỏi
                      </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleCloseFeedback}
                        disabled={submittingFeedback}
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSubmitFeedback}
                        disabled={submittingFeedback || !feedbackText.trim()}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {submittingFeedback ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="mr-2 h-4 w-4" />
                            Gửi phản hồi
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPreview;
