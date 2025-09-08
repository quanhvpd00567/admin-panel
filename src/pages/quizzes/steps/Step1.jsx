import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { CLASS_OPTIONS } from '../../../constants/classes'; // Import CLASS_OPTIONS
import { subjectAPI } from '../../../services/subjectAPI'; // Import subjectAPI
import { showToast } from '../../../components/ui';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'; // Import icon


const Step1 = ({ basic, setBasic, onNext, DIFFICULTY_OPTIONS }) => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]); // State for subjects
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      ...basic,
      class: basic.class || CLASS_OPTIONS[0].code, // Ensure default class is set
    },
  });

  // Fetch subjects when class changes
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const response = await subjectAPI.getSubjectsByClass(basic.class || CLASS_OPTIONS[0].code);
        setSubjects([]);
        if (response.success) {
          setSubjects(response.data || []);
          setValue('subject', response.data[0]?._id); // Set default subject
        }
      } catch (error) {
        showToast.error('Error fetching subjects');
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [basic.class]);

  const onSubmit = (data) => {
    data.deadline = basic.deadline;
    setBasic({ ...basic, ...data });
    onNext();
  };

  return (
    <Card title="Bước 1: Thông tin cơ bản">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Quiz Title */}
        <div>
          <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">
            Tên Quiz <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('title', { required: 'Tên Quiz là bắt buộc.' })}
            placeholder="Nhập tên quiz"
          />
          {errors.title && <div className="text-red-500 text-sm text-left mt-2">{errors.title.message}</div>}
        </div>

        {/* Quiz Description */}
        <div>
          <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">Mô tả</label>
          <textarea
            {...register('description')} // No validation rule for description
            placeholder="Nhập mô tả cho quiz"
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Class and Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">
              Chọn lớp <span className="text-red-500">*</span>
            </label>
            <Select
              {...register('class', { required: 'Chọn lớp là bắt buộc.' })}
              onChange={(e) => setBasic({ ...basic, class: e.target.value })}
            >
              {CLASS_OPTIONS.map((cls) => (
                <option key={cls.code} value={cls.code}>
                  {cls.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">
              Chọn chủ đề <span className="text-red-500">*</span>
            </label>
            <Select {...register('subject', { required: 'Chọn chủ đề là bắt buộc.' })}>
              {loadingSubjects ? (
                <option>Đang tải...</option>
              ) : (
                subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))
              )}
            </Select>
          </div>
        </div>

        {/* Difficulty and Estimated Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">Mức độ khó</label>
            <Select {...register('difficulty')}>
              {DIFFICULTY_OPTIONS.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">
              Thời gian (phút) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={1}
              {...register('timeLimit', { required: 'Thời gian là bắt buộc.' })}
            />
            {errors.timeLimit && (
              <div className="text-red-500 text-sm text-left mt-2">{errors.timeLimit.message}</div>
            )}
          </div>
        </div>

        {/* Passing Score */}
        <div>
          <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">% Điểm yêu cầu pass</label>
          <Input
            type="number"
            min={0}
            max={100}
            {...register('passingScore', { 
              required: 'Điểm yêu cầu pass là bắt buộc.', 
              min: { value: 0, message: 'Điểm yêu cầu phải lớn hơn hoặc bằng 0.' },
              max: { value: 100, message: 'Điểm yêu cầu phải nhỏ hơn hoặc bằng 100.' }
            })}
          />
          {errors.passingScore && (
            <div className="text-red-500 text-sm text-left mt-2">{errors.passingScore.message}</div>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">Hạn nộp bài</label>
          <DatePicker
            selected={basic.deadline ? new Date(basic.deadline) : null} // Hiển thị giá trị deadline từ basic
            onChange={(date) => {
              if (date) {
                setBasic((prev) => ({ ...prev, deadline: date.toISOString() })); // Lưu deadline dưới dạng ISO string
              }
            }}
            placeholderText="Chọn ngày và giờ"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Thời gian"
            dateFormat="dd/MM/yyyy HH:mm"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {basic.deadline && (
            <div className="text-sm text-gray-600 mt-2">
              Ngày đã chọn: {format(new Date(basic.deadline), "dd/MM/yyyy HH:mm")}
            </div>
          )}
        </div>

        {/* Max Attempts */}
        <div>
          <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">Số lần làm tối đa</label>
          <Input
            type="number"
            min={1}
            {...register('maxAttempts', { required: 'Số lần làm tối đa là bắt buộc.' })}
          />
          {errors.maxAttempts && (
            <div className="text-red-500 text-sm text-left mt-2">{errors.maxAttempts.message}</div>
          )}
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">Hướng dẫn</label>
          <textarea
            {...register('instructions')}
            placeholder="Nhập hướng dẫn cho bài kiểm tra"
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Settings */}
        <div>
          <label className="block text-sm font-medium text-left mb-2 text-gray-800 dark:text-white">Cài đặt</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('shuffleQuestions')}
                className="mr-2"
              />
              Trộn câu hỏi
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('shuffleAnswers')}
                className="mr-2"
              />
              Trộn đáp án
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('showResultsImmediately')}
                className="mr-2"
              />
              Hiển thị kết quả ngay lập tức
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('isPublic')}
                className="mr-2"
              />
              Công khai bài kiểm tra
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => navigate('/quizzes')} className="flex items-center">
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <Button type="submit" variant="primary" disabled={!isValid} className="flex items-center">
            <span className="mr-2">Tiếp tục</span>
            <FaArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Step1;
