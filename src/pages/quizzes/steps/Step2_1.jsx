import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Pagination from '../../../components/ui/Pagination'; // Import Pagination component
import { CLASS_OPTIONS } from '../../../constants/classes';
import { questionAPI } from '../../../services/questions/questionAPI';
import { subjectAPI } from '../../../services/subjectAPI'; // Import subjectAPI
import QuestionDetailModal from './QuestionDetailModal'; // Import modal component
import { FaSearch, FaTrash, FaEye, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import icons

const Step2_1 = ({ basic, onNext, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState(basic.questions || []); // Initialize with basic.questions
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [subjects, setSubjects] = useState([]);

  const className = CLASS_OPTIONS.find((cls) => cls.code === basic.class)?.name || 'Không xác định';

  // Fetch questions from API
  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const params = {
        class: basic.class,
        subject: selectedSubject || undefined,
        search: searchTerm || undefined,
        page: pagination.current,
        limit: pagination.pageSize,
      };
      const response = await questionAPI.getQuestions(params);
      if (response.success) {
        setQuestions(response.data.questions || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total || 0
        }));
      } else {
        console.error('Failed to fetch questions:', response.error);
        setQuestions([]);
      }
    } catch (error) {
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Fetch subjects based on class
  const fetchSubjects = async () => {
    try {
      const response = await subjectAPI.getSubjectsByClass(basic.class); // Assuming this API exists
      setSubjects([]);
      if (response.success) {
        setSubjects(response.data || []);
      }
    } catch (error) {
      setSubjects([]);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [basic.class, selectedSubject, pagination.current]);

  useEffect(() => {
      fetchSubjects();
  }, [basic.class]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page when search term changes
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page when subject changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total) {
      setPagination(prev => ({ ...prev, current: newPage }));
    }
  };

  const handleSelectQuestion = (question) => {
    // Thêm hoặc xóa câu hỏi khỏi danh sách đã chọn
    setSelectedQuestions((prev) => {
      const isAlreadySelected = prev.some((q) => q._id === question._id);
      if (isAlreadySelected) {
        return prev.filter((q) => q._id !== question._id); // Bỏ chọn nếu đã chọn trước đó
      } else {
        return [...prev, question]; // Thêm vào danh sách nếu chưa chọn
      }
    });
  };

  const handleViewQuestion = async (question) => {
    try {
      const response = await questionAPI.getQuestion(question._id); // Fetch question details from API
      if (response.success) {
        setSelectedQuestion(response.data); // Set detailed question data
        setIsModalOpen(true); // Open modal
      } else {
        console.error('Failed to fetch question details:', response.error);
      }
    } catch (error) {
      console.error('Error fetching question details:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null);
    setIsModalOpen(false);
  };

  const handleNext = () => {
    const updatedBasic = { ...basic, questions: selectedQuestions }; // Cập nhật basic.questions
    onNext(updatedBasic); // Truyền basic đã cập nhật sang Step3
  };

  return (
    <Card title="Bước 2.1: Chọn câu hỏi">
      <div className="space-y-6">
        {/* Class Name */}
        <div className="text-lg font-semibold text-gray-800 dark:text-white">
          Lớp: {className}
        </div>

        {/* Filters */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                Tìm kiếm câu hỏi
              </label>
              <Input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                Lọc theo chủ đề
              </label>
              <Select value={selectedSubject} onChange={handleSubjectChange}>
                <option value="">Tất cả chủ đề</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="primary"
              onClick={fetchQuestions}
              disabled={loadingQuestions}
              className="flex items-center"
            >
              <FaSearch className="w-5 h-5 mr-2" />
              Tìm kiếm
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('');
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
              disabled={loadingQuestions}
              className="flex items-center"
            >
              <FaTrash className="w-5 h-5 mr-2" />
              Xóa
            </Button>
          </div>
        </div>

        {/* Questions List */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          {loadingQuestions ? (
            <p className="text-gray-600 dark:text-gray-400">Đang tải câu hỏi...</p>
          ) : questions.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {questions.map((question, index) => {
                const isSelected = selectedQuestions.some((q) => q._id === question._id);
                return (
                  <li
                    key={question._id}
                    className={`py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div>
                      <h4 className="pl-2 text-lg text-left font-semibold text-gray-800 dark:text-white truncate overflow-hidden whitespace-nowrap">
                        {question.title}
                      </h4>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={isSelected ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleSelectQuestion(question)}
                        className="flex items-center"
                      >
                        {isSelected ? (
                          <>
                            <FaCheck className="w-4 h-4 mr-1" />
                            Bỏ chọn
                          </>
                        ) : (
                          <>
                            <FaCheck className="w-4 h-4 mr-1" />
                            Chọn
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewQuestion(question)}
                        className="flex items-center"
                      >
                        <FaEye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Không có câu hỏi nào.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <Pagination
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={(newPageSize) => {
              setPagination((prev) => ({
                ...prev,
                pageSize: newPageSize,
                current: 1,
              }));
            }}
            showTotal={false}
            showSizeChanger={false}
            showQuickJumper={pagination.total > 100}
            disabled={loadingQuestions}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onBack({ ...basic, questions: selectedQuestions })} className="flex items-center">
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={handleNext} // Gọi handleNext để lưu selectedQuestions vào basic.questions
            disabled={selectedQuestions.length === 0}
            className="flex items-center"
          >
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

export default Step2_1;
