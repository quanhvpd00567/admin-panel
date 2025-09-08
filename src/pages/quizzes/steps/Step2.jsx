import React from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge'; // Assuming Badge is a reusable component
import Button from '../../../components/ui/Button';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Step2 = ({ basic, questionSource, setQuestionSource, onNext, onBack }) => {
  console.log(basic);

  const handleOptionClick = (source) => {
    setQuestionSource(source);
    if (source === 'manual') {
      onNext(); // Chuyển đến màn hình tiếp theo nếu chọn "Tạo thủ công"
    }
  };

  return (
    <Card title="Chọn phương thức tạo câu hỏi">
      <div className="space-y-8">
        <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
          Lựa chọn cách thức phù hợp nhất để tạo ra bài kiểm tra hoàn hảo của bạn
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* AI Tự động */}
          <div
            className={`p-6 rounded-lg shadow-md transition-all duration-300 transform ${
              'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">AI Tự động</h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-3">
              Nhập chủ đề, AI sẽ tự động tạo câu hỏi chất lượng cao trong vài giây với độ chính xác tuyệt đối.
            </p>
            <div className="flex justify-center mt-6">
              <Badge variant="purple">Được đề xuất</Badge>
            </div>
          </div>

          {/* Upload File */}
          <div
            className={`p-6 rounded-lg shadow-md transition-all duration-300 transform ${
              'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <span className="text-2xl">📤</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">Upload File</h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-3">
              Tải lên tài liệu PDF, Word để AI trích xuất và tạo câu hỏi tự động với độ chính xác cao.
            </p>
            <div className="flex justify-center mt-6">
              <Badge variant="green">Thông minh</Badge>
            </div>
          </div>

          {/* Tạo thủ công */}
          <div
            className={`p-6 rounded-lg shadow-md transition-all duration-300 transform cursor-pointer ${
              questionSource === 'manual'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-lg hover:border-green-400'
            }`}
            onClick={() => handleOptionClick('manual')}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="text-2xl">✍️</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">Tạo thủ công</h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-3">
              Tự tạo từng câu hỏi với sự kiểm soát hoàn toàn về nội dung và chất lượng.
            </p>
            <div className="flex justify-center mt-6">
              <Badge variant="blue">Tùy chỉnh</Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <Button variant="primary" onClick={onNext} className="flex items-center">
            <span className="mr-2">Tiếp tục</span>
            <FaArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Step2;
