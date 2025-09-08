import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../../services/quizzes/quizAPI';
import { format } from 'date-fns'; // Import format từ date-fns
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CLASS_OPTIONS, getClassNameByCode } from '../../constants/classes';

import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const QuizListV1 = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    class: CLASS_OPTIONS[3].code,
    status: '',
    createFrom: null,
    createTo: null,
  });
  const [quizzes, setQuizzes] = useState([]); // State for quizzes
  const [loading, setLoading] = useState(true); // State for loading
  const calledRef = useRef(false);

 const fetchQuizzes = async (searchFilters = filters) => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuizzes(searchFilters);
      if (response.success) {
        setQuizzes(response.data.quizzes);
      } else {
        console.error('Failed to fetch quizzes:', response.error);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // 1. Auto fetch khi filters thay đổi
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    fetchQuizzes();
  }, []);

  // 2. Fetch khi click nút Search
  const handleSearch = () => {
    fetchQuizzes();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý bài kiểm tra</h1>
        <Button variant="primary" onClick={() => navigate('/quizzes/create-v1')} className="flex items-center">
          <FaPlus className="w-4 h-4 mr-2" />
          Tạo mới
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Input Tên */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Tên</label>
            <Input
              name="search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Nhập tên bài kiểm tra"
            />
          </div>

          {/* Select Lớp */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Lớp</label>
            <Select
              name="class"
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
            >
              {CLASS_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Select Trạng thái */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Trạng thái</label>
            <Select
              name="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={[
                { value: '', label: 'Tất cả' },
                { value: 'active', label: 'Hoạt động' },
                { value: 'inactive', label: 'Không hoạt động' },
              ]}
            />
          </div>

          {/* Create From */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Ngày tạo từ</label>
            <DatePicker
              selected={filters.createFrom}
              onChange={(date) => handleFilterChange('createFrom', date)}
              placeholderText="Chọn ngày bắt đầu"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              dateFormat="dd/MM/yyyy"
              showTimeSelect={false}
              timeIntervals={15}
              timeCaption="Thời gian"
            />
          </div>

          {/* Create To */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Ngày tạo đến</label>
            <DatePicker
              selected={filters.createTo}
              onChange={(date) => handleFilterChange('createTo', date)}
              placeholderText="Chọn ngày kết thúc"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              dateFormat="dd/MM/yyyy"
              showTimeSelect={false}
              timeIntervals={15}
              timeCaption="Thời gian"
            />
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <Button
            variant="primary"
            className="flex items-center px-6 py-2"
            onClick={handleSearch} // Trigger search on button click
          >
            <FaSearch className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
          <Button
            variant="outline"
            className="flex items-center px-6 py-2 text-red-500 border-red-500 hover:bg-red-100"
            onClick={() => setFilters({ name: '', class: '', status: '', createFrom: null, createTo: null })}
          >
            <FaTimes className="w-4 h-4 mr-2" />
            Xóa bộ lọc
          </Button>
        </div>
      </Card>

      {/* Quiz List */}
      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-6">Đang tải...</div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-6">Không có bài kiểm tra nào.</div>
          ) : (
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 w-1/3">
                    Title
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 w-1/4">
                    Subject
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 w-24 whitespace-nowrap">
                    Class
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 w-44 whitespace-nowrap">
                    Status
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 px-2 py-3 text-left font-medium text-gray-700 dark:text-gray-300 w-40 whitespace-nowrap">
                    Ngày tạo
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 px-2 py-3 text-center font-medium text-gray-700 dark:text-gray-300 w-32">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr
                    key={quiz._id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                    }`}
                  >
                    <td className="border border-gray-300 text-left dark:border-gray-700 px-4 py-3 text-gray-800 dark:text-gray-300">
                      {quiz.title}
                    </td>
                    <td className="border border-gray-300 text-left dark:border-gray-700 px-4 py-3 text-gray-800 dark:text-gray-300">
                      {quiz.subject.name}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-center text-gray-800 dark:text-gray-300 whitespace-nowrap">
                      {getClassNameByCode(quiz.class)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex justify-center items-center">
                        {quiz.isActive ? (
                          <FaCheckCircle className="text-green-800 dark:text-green-300" />
                        ) : (
                          <FaTimesCircle className="text-red-800 dark:text-red-300" />
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-2 py-3 text-gray-800 dark:text-gray-300 text-sm whitespace-nowrap">
                      {quiz.createdAt
                        ? format(new Date(quiz.createdAt), 'dd/MM/yyyy HH:mm')
                        : 'Không xác định'}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-2 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <FaEye onClick={() => navigate('/quizzes/' + quiz._id)} className="w-4 h-4 mr-1 cursor-pointer" />
                        <FaEdit onClick={() => navigate('/quizzes/edit/' + quiz._id)} className="w-4 h-4 mr-1 cursor-pointer" />
                        <FaTrash className="w-4 h-4 mr-1 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuizListV1;
