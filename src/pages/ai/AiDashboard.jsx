import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { showToast } from '../../components/ui';
import { FaTrashAlt, FaCheck, FaPlus, FaList } from 'react-icons/fa';
import { SiOpenai, SiGooglegemini } from 'react-icons/si';
import { quizAPI } from '../../services/quizzes';
import { subjectAPI } from '../../services/subjectAPI';
import { AI_MODELS } from '../../constants/common';
import { CLASS_OPTIONS } from '../../constants/classes';

const AiDashboard = () => {
  const navigator = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      subject_text: null,
      subject_id: null,
      model: AI_MODELS[selectedProvider][0].value,
      totalQuestions: 10,
      class: CLASS_OPTIONS[3].code,
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

  // call api get subject list by class
  const fetchSubjectsByClass = async (classCode) => {
    try {
      const response = await subjectAPI.getSubjectsByClass(classCode);
      if (response.success) {
        setSubjectOptions(response.data);
      } else {
        showToast.error(response.error);
      }
    } catch {
      showToast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  // handle change class
  const selectedClass = watch('class');
  useEffect(() => {
    fetchSubjectsByClass(selectedClass);
  }, [selectedClass]);

  const onSubmit = async (data) => {
    if (isDisabled) return;
    setIsDisabled(true);
   try {
     // Thêm provider vào data
     const submitData = { ...data, provider: selectedProvider };
     submitData.subject = data.subject_text;
     if (!isAddingSubject) {
        submitData.subject = subjectOptions.find(option => option._id === data.subject_id)?.name || '' ;
     }
      submitData.subject_id = null;

     const { totalQuestions, easyQuestions, mediumQuestions, hardQuestions, totalPoints } = data;

     if (totalQuestions !== easyQuestions + mediumQuestions + hardQuestions) {
       showToast.error('Tổng số câu hỏi phải bằng tổng số câu dễ, vừa và khó.');
       return;
     }

     if (totalPoints !== 100) {
       showToast.error('Tổng điểm phải bằng 100.');
       return;
     }

     const result = await quizAPI.generateQuizAI(submitData);

     if (result.success) {
       showToast.success('Bài kiểm tra đã được tạo thành công!');
       navigator('/ai/generate-process');
     } else {
       showToast.error(result.error);
     }
   } catch (error) {
     showToast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
   } finally {
     setIsDisabled(false);
   }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
        Tạo bài kiểm tra bằng AI
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
        {/* Tiêu đề */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('title', { required: 'Tiêu đề là bắt buộc', maxLength: { value: 300, message: 'Tiêu đề không được quá 300 ký tự' } })}
            placeholder="Nhập tiêu đề cho bài kiểm tra"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1 text-left">{errors.title.message}</p>
          )}
        </div>

        {/* Mô tả */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Mô tả
          </label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            placeholder="Nhập mô tả cho bài kiểm tra"
            rows={4}
            style={{ resize: 'none' }}
          />
        </div>

        {/* Chọn lớp */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Chọn lớp
          </label>
          <select
            {...register('class', { required: 'Lớp là bắt buộc' })}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          >
            {CLASS_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.class && (
            <p className="text-red-500 text-sm mt-1 text-left">{errors.class.message}</p>
          )}
        </div>

        {/* Card chọn model AI */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Chọn nhà cung cấp AI
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center space-x-2 ${selectedProvider === 'gemini'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              onClick={() => setSelectedProvider('gemini')}
            >
              <SiGooglegemini className="mr-2" />
              Gemini
            </button>
            <button
              type="button"
              disabled
              className={`hidden px-4 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center space-x-2 ${selectedProvider === 'openai'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              onClick={() => setSelectedProvider('openai')}
            >
              <SiOpenai className="mr-2" />
              OpenAI
            </button>
          </div>

          {/* <AI_MODEL_OPTIONS /> */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Chọn mô hình AI
            </label>
            <select
              {...register('model', { required: 'Mô hình là bắt buộc' })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              {AI_MODELS[selectedProvider].map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
            {errors.model && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.model.message}</p>
            )}
          </div>
        </div>
        {/* Chủ đề */}
        <div className="col-span-1 md:col-span-2 flex items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Chủ đề
            </label>
            {!isAddingSubject ? (
              <select
                {...register('subject_id', { required: 'Chủ đề là bắt buộc' })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                defaultValue={subjectOptions[0]}
              >
                {subjectOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                {...register('subject_text', { required: 'Chủ đề là bắt buộc' })}
                placeholder="Nhập chủ đề mới"
              />
            )}
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.subject.message}</p>
            )}
          </div>
          <div className="ml-4 mt-6">
            {!isAddingSubject ? (
              <Button
                type="button"
                variant="outline"
                className="px-3 py-2 border border-blue-500 text-blue-500 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900 flex items-center justify-center rounded transition-all duration-300"
                onClick={() => setIsAddingSubject(true)}
              >
                <FaPlus className="mr-2" />
                Thêm mới
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="px-3 py-2 border border-blue-500 text-blue-500 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900 flex items-center justify-center rounded transition-all duration-300"
                onClick={() => setIsAddingSubject(false)}
              >
                <FaList className="mr-2" />
                Chọn từ danh sách
              </Button>
            )}
          </div>
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
            disabled={isDisabled}
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
