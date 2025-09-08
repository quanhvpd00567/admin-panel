import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { showToast } from '../../components/ui';
import { FaTrashAlt, FaCheck } from 'react-icons/fa';
import { quizAPI } from '../../services/quizzes';

const AiDashboard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      subject: 'Toán lớp 4',
      totalQuestions: 10,
      easyQuestions: 5,
      mediumQuestions: 3,
      hardQuestions: 2,
      totalPoints: 100,
      shuffleQuestions: false,
      shuffleAnswers: false,
      showAnswersImmediately: false,
      instructions: '',
      timeLimit: 60,
      passingScore: 50,
      maxAttempts: 1,
    },
  });

  const onSubmit = async (data) => {
    const { totalQuestions, easyQuestions, mediumQuestions, hardQuestions, totalPoints } = data;

    if (totalQuestions !== easyQuestions + mediumQuestions + hardQuestions) {
      showToast.error('Tổng số câu hỏi phải bằng tổng số câu dễ, vừa và khó.');
      return;
    }

    if (totalPoints !== 100) {
      showToast.error('Tổng điểm phải bằng 100.');
      return;
    }

    const result = await quizAPI.generateQuizAI(data);

    if (result.success) {
      showToast.success('Bài kiểm tra đã được tạo thành công!');
    } else {
      showToast.error(result.error);
    } 
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
        Tạo bài kiểm tra bằng AI
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
        {/* Chủ đề */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Chủ đề
          </label>
          <Input
            {...register('subject', { required: 'Chủ đề là bắt buộc' })}
            placeholder="Nhập chủ đề"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1 text-left">{errors.subject.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tổng số câu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Tổng số câu
            </label>
            <Input
              type="number"
              {...register('totalQuestions', {
                required: 'Tổng số câu là bắt buộc',
                valueAsNumber: true,
                min: { value: 1, message: 'Tổng số câu phải lớn hơn 0' },
              })}
              placeholder="Nhập tổng số câu"
            />
            {errors.totalQuestions && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.totalQuestions.message}</p>
            )}
          </div>

          {/* Số câu dễ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Số câu dễ
            </label>
            <Input
              type="number"
              {...register('easyQuestions', { valueAsNumber: true })}
              placeholder="Nhập số câu dễ"
            />
          </div>

          {/* Số câu vừa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Số câu vừa
            </label>
            <Input
              type="number"
              {...register('mediumQuestions', { valueAsNumber: true })}
              placeholder="Nhập số câu vừa"
            />
          </div>

          {/* Số câu khó */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Số câu khó
            </label>
            <Input
              type="number"
              {...register('hardQuestions', { valueAsNumber: true })}
              placeholder="Nhập số câu khó"
            />
          </div>

          {/* Tổng điểm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Tổng điểm
            </label>
            <Input
              type="number"
              {...register('totalPoints', {
                required: 'Tổng điểm là bắt buộc',
                valueAsNumber: true,
                validate: (value) =>
                  value === 100 || 'Tổng điểm phải bằng 100',
              })}
              placeholder="Tổng điểm (mặc định 100)"
            />
            {errors.totalPoints && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.totalPoints.message}</p>
            )}
          </div>

          {/* Thời gian làm bài */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Thời gian làm bài (phút)
            </label>
            <Input
              type="number"
              {...register('timeLimit', { valueAsNumber: true })}
              placeholder="Nhập thời gian làm bài"
            />
          </div>

          {/* Điểm để đạt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Phần trăm điểm để đạt (%)
            </label>
            <Input
              type="number"
              {...register('passingScore', { valueAsNumber: true })}
              placeholder="Nhập phần trăm điểm để đạt"
            />
          </div>

          {/* Số lần làm tối đa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Số lần làm tối đa
            </label>
            <Input
              type="number"
              {...register('maxAttempts', { valueAsNumber: true })}
              placeholder="Nhập số lần làm tối đa"
            />
          </div>
        </div>

        {/* Checkbox options */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <label className="flex items-center text-left">
            <input
              type="checkbox"
              {...register('showAnswersImmediately')}
              className="mr-2"
            />
            Hiển thị kết quả ngay lập tức
          </label>
          <label className="flex items-center text-left">
            <input
              type="checkbox"
              {...register('shuffleQuestions')}
              className="mr-2"
            />
            Trộn câu hỏi
          </label>
          <label className="flex items-center text-left">
            <input
              type="checkbox"
              {...register('shuffleAnswers')}
              className="mr-2"
            />
            Trộn đáp án
          </label>
        </div>

        {/* Hướng dẫn */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Hướng dẫn
          </label>
          <textarea
            {...register('instructions')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            placeholder="Nhập hướng dẫn cho bài kiểm tra"
            rows={4}
          />
        </div>

        {/* Nút tạo bài kiểm tra và nút xóa */}
        <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-6">
          <Button
            variant="outline"
            className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-100 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900 flex items-center justify-center rounded-lg shadow-sm transition-all duration-300"
            onClick={() => {
              // Reset form to default values
              reset();
              showToast.success('Form đã được xóa!');
            }}
          >
            <FaTrashAlt className="mr-2" />
            Xóa
          </Button>
          <Button
            variant="primary"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md flex items-center justify-center transition-all duration-300"
            type="submit"
          >
            <FaCheck className="mr-2" />
            Tạo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AiDashboard;
