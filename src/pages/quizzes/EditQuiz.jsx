import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import {
  Button,
  Input,
  Select,
  Badge,
} from '../../components/ui';
import TextArea from '../../components/ui/TextArea';
import { useToast } from '../../components/ui/Toast';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';


// Simple UI components for missing exports
const Label = ({ children, htmlFor, ...props }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" {...props}>
    {children}
  </label>
);

const Switch = ({ checked, onCheckedChange, ...props }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    }`}
    onClick={() => onCheckedChange(!checked)}
    {...props}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const SelectTrigger = ({ children, className, ...props }) => (
  <div className={`relative ${className || ''}`} {...props}>
    {children}
  </div>
);

const SelectValue = ({ placeholder, ...props }) => (
  <span className="text-gray-500" {...props}>{placeholder}</span>
);

const SelectContent = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

const SelectItem = ({ children, value, onSelect, ...props }) => (
  <option value={value} {...props}>{children}</option>
);

const Textarea = TextArea;
import { quizAPI } from '../../services/quizzes/quizAPI';
import { subjectAPI } from '../../services/subjectAPI';
import { questionAPI } from '../../services/questions/questionAPI';
import { 
  QUIZ_DIFFICULTY, 
  QUIZ_TYPES, 
  QUIZ_STATUS,
  DEFAULT_QUIZ_SETTINGS,
  QUIZ_VALIDATION
} from '../../constants/quizzes';

const EditQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    type: '',
    difficulty: '',
    timeLimit: DEFAULT_QUIZ_SETTINGS.timeLimit,
    passingScore: DEFAULT_QUIZ_SETTINGS.passingScore,
    status: 'draft',
    isPublic: DEFAULT_QUIZ_SETTINGS.isPublic,
    allowRetake: DEFAULT_QUIZ_SETTINGS.attempts > 1,
    showResults: DEFAULT_QUIZ_SETTINGS.showResults === 'immediate',
    randomizeQuestions: DEFAULT_QUIZ_SETTINGS.randomizeQuestions,
    randomizeAnswers: DEFAULT_QUIZ_SETTINGS.randomizeAnswers,
    instructions: '',
    questions: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [quizResult, subjectsResult, questionsResult] = await Promise.all([
        quizAPI.getQuiz(id),
        subjectAPI.getSubjectList(),
        questionAPI.getQuestions({ limit: 100, isActive: true })
      ]);
      
      if (quizResult.success) {
        const quiz = quizResult.data;
        setFormData({
          title: quiz.title || '',
          description: quiz.description || '',
          subject: quiz.subject?._id || quiz.subject || '',
          type: quiz.type || '',
          difficulty: quiz.difficulty || '',
          timeLimit: quiz.settings?.timeLimit || quiz.timeLimit || DEFAULT_QUIZ_SETTINGS.timeLimit,
          passingScore: quiz.settings?.passingScore || quiz.passingScore || DEFAULT_QUIZ_SETTINGS.passingScore,
          status: quiz.status || 'draft',
          isPublic: quiz.isPublic !== undefined ? quiz.isPublic : DEFAULT_QUIZ_SETTINGS.isPublic,
          allowRetake: quiz.settings?.allowRetake !== undefined ? quiz.settings.allowRetake : DEFAULT_QUIZ_SETTINGS.attempts > 1,
          showResults: quiz.settings?.showResults === 'immediate' || quiz.showResults === true,
          randomizeQuestions: quiz.settings?.randomizeQuestions !== undefined ? quiz.settings.randomizeQuestions : DEFAULT_QUIZ_SETTINGS.randomizeQuestions,
          randomizeAnswers: quiz.settings?.randomizeAnswers !== undefined ? quiz.settings.randomizeAnswers : DEFAULT_QUIZ_SETTINGS.randomizeAnswers,
          instructions: quiz.instructions || '',
          questions: quiz.questions?.map(q => q._id || q) || [],
        });
        setSelectedQuestions(quiz.questions?.map(q => q._id || q) || []);
      }
      
      if (subjectsResult.success) {
        setSubjects(subjectsResult.data.subjects || []);
      }
      
      if (questionsResult.success) {
        setQuestions(questionsResult.data.questions || []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load quiz data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else if (prev.length < formData.totalQuestions) {
        return [...prev, questionId];
      }
      return prev;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tên bài kiểm tra là bắt buộc';
    } else if (formData.title.length < QUIZ_VALIDATION.MIN_TITLE_LENGTH) {
      newErrors.title = `Tên bài kiểm tra phải có ít nhất ${QUIZ_VALIDATION.MIN_TITLE_LENGTH} ký tự`;
    } else if (formData.title.length > QUIZ_VALIDATION.MAX_TITLE_LENGTH) {
      newErrors.title = `Tên bài kiểm tra không được quá ${QUIZ_VALIDATION.MAX_TITLE_LENGTH} ký tự`;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    } else if (formData.description.length < QUIZ_VALIDATION.MIN_DESCRIPTION_LENGTH) {
      newErrors.description = `Mô tả phải có ít nhất ${QUIZ_VALIDATION.MIN_DESCRIPTION_LENGTH} ký tự`;
    }

    if (!formData.subject) {
      newErrors.subject = 'Vui lòng chọn môn học';
    }

    if (!formData.type) {
      newErrors.type = 'Vui lòng chọn loại trắc nghiệm';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Vui lòng chọn độ khó';
    }

    if (formData.timeLimit < QUIZ_VALIDATION.MIN_TIME_LIMIT || formData.timeLimit > QUIZ_VALIDATION.MAX_TIME_LIMIT) {
      newErrors.timeLimit = `Thời gian làm bài phải từ ${QUIZ_VALIDATION.MIN_TIME_LIMIT} đến ${QUIZ_VALIDATION.MAX_TIME_LIMIT} phút`;
    }

    if (formData.passingScore < QUIZ_VALIDATION.MIN_PASSING_SCORE || formData.passingScore > QUIZ_VALIDATION.MAX_PASSING_SCORE) {
      newErrors.passingScore = `Điểm đạt phải từ ${QUIZ_VALIDATION.MIN_PASSING_SCORE} đến ${QUIZ_VALIDATION.MAX_PASSING_SCORE}%`;
    }

    if (selectedQuestions.length < QUIZ_VALIDATION.MIN_QUESTIONS) {
      newErrors.questions = `Vui lòng chọn ít nhất ${QUIZ_VALIDATION.MIN_QUESTIONS} câu hỏi`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const quizData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject,
        type: formData.type,
        difficulty: formData.difficulty,
        timeLimit: formData.timeLimit,
        passingScore: formData.passingScore,
        status: formData.status,
        isPublic: formData.isPublic,
        instructions: formData.instructions.trim(),
        settings: {
          allowRetake: formData.allowRetake,
          showResults: formData.showResults ? 'immediate' : 'never',
          randomizeQuestions: formData.randomizeQuestions,
          randomizeAnswers: formData.randomizeAnswers,
          timeLimit: formData.timeLimit,
          passingScore: formData.passingScore,
        },
        questions: selectedQuestions,
      };

      const result = await quizAPI.updateQuiz(id, quizData);
      
      if (result.success) {
        toast.success('Cập nhật bài kiểm tra thành công');
        navigate('/quizzes');
      } else {
        toast.error(result.error || 'Có lỗi xảy ra khi cập nhật bài kiểm tra');
        if (result.validationErrors) {
          setErrors(result.validationErrors);
        }
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast.error('Có lỗi xảy ra khi cập nhật bài kiểm tra');
    } finally {
      setSaving(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (formData.subject && q.subject?._id !== formData.subject) return false;
    if (formData.difficulty && q.difficulty !== formData.difficulty) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chỉnh sửa bài kiểm tra</h1>
        <p className="text-gray-600">Cập nhật thông tin bài kiểm tra trắc nghiệm</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Cập nhật thông tin cơ bản về bài kiểm tra
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Tên bài kiểm tra *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tên bài kiểm tra"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="difficulty">Độ khó *</Label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.difficulty ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn độ khó</option>
                  {Object.entries(QUIZ_DIFFICULTY).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Mô tả về bài kiểm tra (tùy chọn)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subjectId">Môn học *</Label>
                <select
                  id="subjectId"
                  value={formData.subjectId}
                  onChange={(e) => handleInputChange('subjectId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subjectId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn môn học</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {errors.subjectId && <p className="text-red-500 text-sm mt-1">{errors.subjectId}</p>}
              </div>

              <div>
                <Label htmlFor="classId">Lớp học *</Label>
                <select
                  id="classId"
                  value={formData.classId}
                  onChange={(e) => handleInputChange('classId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.classId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn lớp học</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="text-red-500 text-sm mt-1">{errors.classId}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt bài kiểm tra</CardTitle>
            <CardDescription>
              Cấu hình các thông số cho bài kiểm tra
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Thời gian (phút) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>

              <div>
                <Label htmlFor="totalQuestions">Số câu hỏi *</Label>
                <Input
                  id="totalQuestions"
                  type="number"
                  min="1"
                  value={formData.totalQuestions}
                  onChange={(e) => handleInputChange('totalQuestions', parseInt(e.target.value) || 0)}
                  className={errors.totalQuestions ? 'border-red-500' : ''}
                />
                {errors.totalQuestions && <p className="text-red-500 text-sm mt-1">{errors.totalQuestions}</p>}
              </div>

              <div>
                <Label htmlFor="passingScore">Điểm đạt (%) *</Label>
                <Input
                  id="passingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value) || 0)}
                  className={errors.passingScore ? 'border-red-500' : ''}
                />
                {errors.passingScore && <p className="text-red-500 text-sm mt-1">{errors.passingScore}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                />
                <Label htmlFor="isPublished">Xuất bản</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allowRetake"
                  checked={formData.allowRetake}
                  onCheckedChange={(checked) => handleInputChange('allowRetake', checked)}
                />
                <Label htmlFor="allowRetake">Cho phép làm lại</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showResults"
                  checked={formData.showResults}
                  onCheckedChange={(checked) => handleInputChange('showResults', checked)}
                />
                <Label htmlFor="showResults">Hiển thị kết quả</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="shuffleQuestions"
                  checked={formData.shuffleQuestions}
                  onCheckedChange={(checked) => handleInputChange('shuffleQuestions', checked)}
                />
                <Label htmlFor="shuffleQuestions">Xáo trộn câu hỏi</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="shuffleAnswers"
                  checked={formData.shuffleAnswers}
                  onCheckedChange={(checked) => handleInputChange('shuffleAnswers', checked)}
                />
                <Label htmlFor="shuffleAnswers">Xáo trộn đáp án</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Selection */}
        <Card>
          <CardHeader>
            <CardTitle>
              Chọn câu hỏi ({selectedQuestions.length}/{formData.totalQuestions})
            </CardTitle>
            <CardDescription>
              Cập nhật các câu hỏi cho bài kiểm tra
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.questions && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{errors.questions}</p>
              </div>
            )}
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedQuestions.includes(question.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleQuestionSelect(question.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">
                          {question.type === 'multiple_choice' ? 'Trắc nghiệm' :
                           question.type === 'true_false' ? 'Đúng/Sai' : 'Nhiều đáp án'}
                        </Badge>
                        <Badge variant="outline">
                          {QUIZ_DIFFICULTY[question.difficulty]}
                        </Badge>
                      </div>
                    </div>
                    <div className="ml-3">
                      {selectedQuestions.includes(question.id) ? (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredQuestions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Không có câu hỏi nào phù hợp với tiêu chí đã chọn</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/quizzes')}
          >
            <FaTimes className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={saving}
          >
            <FaSave className="w-4 h-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Cập nhật bài kiểm tra'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditQuiz;
