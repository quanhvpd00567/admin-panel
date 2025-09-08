import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Label,
  Select,
  Textarea,
  Badge,
} from '../../components/ui';
import { FaSave, FaTimes, FaPlus, FaTrash, FaEye, FaUpload, FaQuestionCircle } from 'react-icons/fa';
import { questionAPI } from '../../services/questions/questionAPI';
import { subjectAPI } from '../../services/subjectAPI';
import { 
  QUESTION_TYPES, 
  DIFFICULTY_LEVELS as QUIZ_DIFFICULTY,
  QUESTION_VALIDATION,
  getQuestionTypeLabel
} from '../../constants/questions';
import { 
  SUBJECTS,
  getActiveSubjects,
  getSubjectTopics,
  DEFAULT_SUBJECT
} from '../../constants/subjects';
import MediaUpload from '../../components/MediaUpload';
import RichTextEditor from '../../components/RichTextEditor';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState(getActiveSubjects());
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    type: 'multiple_choice',
    subjectId: DEFAULT_SUBJECT.id, // Mặc định là Toán học
    difficulty: 'easy',
    points: 10,
    estimatedTime: 60, // seconds
    category: '',
    tags: [],
    explanation: '',
    answers: [
      { id: '1', text: '', isCorrect: false, explanation: '', order: 1 },
      { id: '2', text: '', isCorrect: false, explanation: '', order: 2 },
      { id: '3', text: '', isCorrect: false, explanation: '', order: 3 },
      { id: '4', text: '', isCorrect: false, explanation: '', order: 4 },
    ],
    content: {
      text: '',
      media: null,
      code: null,
    },
    references: [],
    selectedQuestions: [], // Danh sách câu hỏi đã chọn
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const result = await questionAPI.getQuestions({ limit: 100, isActive: true });
      if (result.success) {
        setAllQuestions(result.data.questions || []);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
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

  const handleAnswerChange = (answerId, field, value) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map(answer =>
        answer.id === answerId
          ? { ...answer, [field]: value }
          : answer
      )
    }));
  };

  const handleCorrectAnswerChange = (answerId) => {
    if (formData.type === 'multiple_choice' || formData.type === 'true_false') {
      // Single correct answer
      setFormData(prev => ({
        ...prev,
        answers: prev.answers.map(answer => ({
          ...answer,
          isCorrect: answer.id === answerId
        }))
      }));
    } else {
      // Multiple correct answers
      setFormData(prev => ({
        ...prev,
        answers: prev.answers.map(answer =>
          answer.id === answerId
            ? { ...answer, isCorrect: !answer.isCorrect }
            : answer
        )
      }));
    }
  };

  const addAnswer = () => {
    // Giới hạn tối đa 6 đáp án
    if (formData.answers.length >= 6) {
      return;
    }
    
    const newAnswer = {
      id: Date.now().toString(),
      text: '',
      isCorrect: false,
      explanation: '',
      order: formData.answers.length + 1,
    };
    
    setFormData(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer]
    }));
  };

  const removeAnswer = (answerId) => {
    if (formData.answers.length <= 2) return; // Minimum 2 answers
    
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.filter(answer => answer.id !== answerId)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addReference = () => {
    const newReference = {
      id: Date.now().toString(),
      type: 'url',
      title: '',
      url: '',
      page: '',
    };
    
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, newReference]
    }));
  };

  const updateReference = (refId, field, value) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map(ref =>
        ref.id === refId ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const removeReference = (refId) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter(ref => ref.id !== refId)
    }));
  };

  // Question selection functions
  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const clearSelectedQuestions = () => {
    setSelectedQuestions([]);
  };

  const addSelectedQuestionsToForm = () => {
    setFormData(prev => ({
      ...prev,
      selectedQuestions: [...new Set([...prev.selectedQuestions, ...selectedQuestions])]
    }));
    setSelectedQuestions([]);
    setShowQuestionBank(false);
  };

  const removeQuestionFromForm = (questionId) => {
    setFormData(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.filter(id => id !== questionId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề câu hỏi là bắt buộc';
    }

    if (!formData.question.trim()) {
      newErrors.question = 'Nội dung câu hỏi là bắt buộc';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Vui lòng chọn môn học';
    }

    if (formData.points < 1) {
      newErrors.points = 'Điểm số phải lớn hơn 0';
    }

    if (formData.estimatedTime < 10) {
      newErrors.estimatedTime = 'Thời gian ước tính phải ít nhất 10 giây';
    }

    // Validate answers
    const filledAnswers = formData.answers.filter(a => a.text.trim());
    if (filledAnswers.length < 2) {
      newErrors.answers = 'Phải có ít nhất 2 đáp án';
    }

    const correctAnswers = formData.answers.filter(a => a.isCorrect && a.text.trim());
    if (correctAnswers.length === 0) {
      newErrors.correctAnswers = 'Phải có ít nhất 1 đáp án đúng';
    }

    if (formData.type === 'true_false' && filledAnswers.length !== 2) {
      newErrors.truefalse = 'Câu hỏi Đúng/Sai phải có đúng 2 đáp án';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare question data
      const questionData = {
        ...formData,
        content: {
          text: formData.question,
          media: formData.content.media,
          code: formData.content.code,
        },
        answers: formData.answers
          .filter(a => a.text.trim())
          .map((answer, index) => ({
            ...answer,
            order: index + 1,
          })),
        subject: formData.subjectId,
        subjectName: subjects.find(s => s.id === formData.subjectId)?.name || '',
        topics: [formData.category].filter(Boolean),
        status: 'active',
        isActive: true,
      };

      const result = await questionAPI.createQuestion(questionData);
      
      if (result.success) {
        navigate('/questions');
      } else {
        console.error('Error creating question:', result.error);
      }
    } catch (error) {
      console.error('Error creating question:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyLabel = (difficulty) => {
    const difficultyObj = QUIZ_DIFFICULTY.find(d => d.value === difficulty);
    return difficultyObj ? difficultyObj.label : difficulty;
  };

  // Remove duplicate getQuestionTypeLabel since we import it from constants

  // Filter questions for selection
  const filteredQuestions = allQuestions.filter(q => {
    if (formData.subjectId && q.subject?.id !== formData.subjectId && q.subject !== formData.subjectId) return false;
    if (formData.difficulty && q.difficulty !== formData.difficulty) return false;
    return true;
  });

  const selectedQuestionObjects = formData.selectedQuestions.map(id => 
    allQuestions.find(q => q._id === id || q.id === id)
  ).filter(Boolean);

  // Adjust answers based on question type
  useEffect(() => {
    const currentType = formData.type;
    const currentAnswers = formData.answers;
    
    console.log('Question type changed to:', currentType, 'Current answers:', currentAnswers.length);
    
    if (currentType === 'true_false') {
      // Always set to true/false format when switching to true_false
      if (currentAnswers.length !== 2 || 
          currentAnswers[0].text !== 'Đúng' || 
          currentAnswers[1].text !== 'Sai') {
        console.log('Switching to true/false format');
        setFormData(prev => ({
          ...prev,
          answers: [
            { id: '1', text: 'Đúng', isCorrect: false, explanation: '', order: 1 },
            { id: '2', text: 'Sai', isCorrect: false, explanation: '', order: 2 },
          ]
        }));
      }
    } else if (currentType === 'multiple_choice' || currentType === 'multiple_answer') {
      // Check if we're coming from true_false format and need to reset
      if (currentAnswers.length === 2 && 
          currentAnswers[0].text === 'Đúng' && 
          currentAnswers[1].text === 'Sai') {
        console.log('Switching from true/false to', currentType);
        // Reset to multiple choice format
        setFormData(prev => ({
          ...prev,
          answers: [
            { id: '1', text: '', isCorrect: false, explanation: '', order: 1 },
            { id: '2', text: '', isCorrect: false, explanation: '', order: 2 },
            { id: '3', text: '', isCorrect: false, explanation: '', order: 3 },
            { id: '4', text: '', isCorrect: false, explanation: '', order: 4 },
          ]
        }));
      } else if (currentAnswers.length < 2) {
        console.log('Ensuring minimum answers for', currentType);
        // Ensure minimum 2 answers for multiple choice/answer
        const defaultAnswers = [
          { id: '1', text: '', isCorrect: false, explanation: '', order: 1 },
          { id: '2', text: '', isCorrect: false, explanation: '', order: 2 },
          { id: '3', text: '', isCorrect: false, explanation: '', order: 3 },
          { id: '4', text: '', isCorrect: false, explanation: '', order: 4 },
        ];
        
        setFormData(prev => ({
          ...prev,
          answers: defaultAnswers
        }));
      }
      
      // For multiple_choice, ensure only one correct answer
      if (currentType === 'multiple_choice') {
        const correctAnswers = currentAnswers.filter(a => a.isCorrect);
        if (correctAnswers.length > 1) {
          console.log('Ensuring single correct answer for multiple choice');
          // Keep only the first correct answer
          setFormData(prev => ({
            ...prev,
            answers: prev.answers.map((answer, index) => ({
              ...answer,
              isCorrect: index === 0 && correctAnswers.includes(answer) ? true : false
            }))
          }));
        }
      }
    }
  }, [formData.type]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tạo câu hỏi mới</h1>
        <p className="text-gray-600">Tạo câu hỏi trắc nghiệm cho ngân hàng câu hỏi</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Nhập thông tin cơ bản về câu hỏi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Tiêu đề câu hỏi *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề ngắn gọn cho câu hỏi"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="type">Loại câu hỏi *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <option value="">Chọn loại câu hỏi</option>
                  {QUESTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="subjectId">Môn học *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) => handleInputChange('subjectId', value)}
                  className={errors.subjectId ? 'border-red-500' : ''}
                >
                  <option value="">Chọn môn học</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </option>
                  ))}
                </Select>
                {errors.subjectId && <p className="text-red-500 text-sm mt-1">{errors.subjectId}</p>}
              </div>

              <div>
                <Label htmlFor="difficulty">Độ khó *</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange('difficulty', value)}
                >
                  <option value="">Chọn độ khó</option>
                  {QUIZ_DIFFICULTY.map((difficulty) => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Chủ đề</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <option value="">Chọn chủ đề</option>
                  {getSubjectTopics(formData.subjectId).map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </Select>
                <Input
                  className="mt-2"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Hoặc nhập chủ đề tùy chỉnh..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="points">Điểm số *</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 1)}
                  className={errors.points ? 'border-red-500' : ''}
                />
                {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points}</p>}
              </div>

              <div>
                <Label htmlFor="estimatedTime">Thời gian ước tính (giây) *</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  min="10"
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value) || 60)}
                  className={errors.estimatedTime ? 'border-red-500' : ''}
                />
                {errors.estimatedTime && <p className="text-red-500 text-sm mt-1">{errors.estimatedTime}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <Card>
          <CardHeader>
            <CardTitle>Đáp án</CardTitle>
            <CardDescription>
              {formData.type === 'true_false' && 'Câu hỏi Đúng/Sai - Chọn 1 trong 2 đáp án là đúng.'}
              {formData.type === 'multiple_choice' && 'Câu hỏi trắc nghiệm - Chọn 1 đáp án đúng duy nhất.'}
              {formData.type === 'multiple_answer' && 'Câu hỏi nhiều đáp án - Có thể chọn nhiều đáp án đúng.'}
              {!formData.type && 'Chọn loại câu hỏi để xem hướng dẫn về đáp án.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.answers && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{errors.answers}</p>
              </div>
            )}
            
            {errors.correctAnswers && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{errors.correctAnswers}</p>
              </div>
            )}

            {errors.truefalse && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{errors.truefalse}</p>
              </div>
            )}

            <div className="space-y-4">
              {formData.answers.map((answer, index) => (
                <div key={answer.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center">
                      <input
                        type={formData.type === 'multiple_answer' ? 'checkbox' : 'radio'}
                        name="correctAnswer"
                        checked={answer.isCorrect}
                        onChange={() => handleCorrectAnswerChange(answer.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700 min-w-[20px]">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <Input
                          value={answer.text}
                          onChange={(e) => handleAnswerChange(answer.id, 'text', e.target.value)}
                          placeholder={`Nhập đáp án ${String.fromCharCode(65 + index)}...`}
                          className="flex-1"
                          disabled={formData.type === 'true_false'}
                        />
                        {formData.answers.length > 2 && formData.type !== 'true_false' && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeAnswer(answer.id)}
                          >
                            <FaTrash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor={`explanation-${answer.id}`}>Giải thích (tùy chọn)</Label>
                        <Textarea
                          id={`explanation-${answer.id}`}
                          value={answer.explanation}
                          onChange={(e) => handleAnswerChange(answer.id, 'explanation', e.target.value)}
                          placeholder="Giải thích tại sao đáp án này đúng/sai..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.type !== 'true_false' && formData.type && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAnswer}
                    className="w-full"
                    disabled={formData.answers.length >= 6} // Giới hạn tối đa 6 đáp án
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Thêm đáp án {formData.answers.length >= 6 ? '(Tối đa 6 đáp án)' : ''}
                  </Button>
                  {formData.type === 'multiple_choice' && (
                    <p className="text-sm text-gray-600 text-center">
                      💡 Trắc nghiệm: Chỉ được chọn 1 đáp án đúng
                    </p>
                  )}
                  {formData.type === 'multiple_answer' && (
                    <p className="text-sm text-gray-600 text-center">
                      💡 Nhiều đáp án: Có thể chọn nhiều đáp án đúng
                    </p>
                  )}
                </div>
              )}
              
              {formData.type === 'true_false' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    💡 Câu hỏi Đúng/Sai: Chọn 1 trong 2 đáp án cố định
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Bank Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaQuestionCircle className="mr-2" />
              Ngân hàng câu hỏi ({formData.selectedQuestions.length} đã chọn)
            </CardTitle>
            <CardDescription>
              Chọn câu hỏi có sẵn từ ngân hàng để thêm vào bài tập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Selected Questions Display */}
              {formData.selectedQuestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Câu hỏi đã chọn:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedQuestionObjects.map((question, index) => (
                      <div key={question._id || question.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {index + 1}. {question.title || question.question}
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getQuestionTypeLabel(question.type)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getDifficultyLabel(question.difficulty)}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {question.points || 1} điểm
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeQuestionFromForm(question._id || question.id)}
                        >
                          <FaTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Bank Toggle */}
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuestionBank(!showQuestionBank)}
                >
                  <FaQuestionCircle className="w-4 h-4 mr-2" />
                  {showQuestionBank ? 'Ẩn ngân hàng câu hỏi' : 'Chọn từ ngân hàng câu hỏi'}
                </Button>
                
                {selectedQuestions.length > 0 && (
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSelectedQuestions}
                    >
                      Xóa lựa chọn
                    </Button>
                    <Button
                      type="button"
                      onClick={addSelectedQuestionsToForm}
                      size="sm"
                    >
                      Thêm {selectedQuestions.length} câu hỏi
                    </Button>
                  </div>
                )}
              </div>

              {/* Question Bank List */}
              {showQuestionBank && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Hiển thị câu hỏi phù hợp với môn học: <strong>{subjects.find(s => s.id === formData.subjectId)?.name}</strong>
                    </p>
                    {selectedQuestions.length > 0 && (
                      <p className="text-sm text-blue-600">
                        Đã chọn {selectedQuestions.length} câu hỏi để thêm
                      </p>
                    )}
                  </div>

                  {filteredQuestions.length === 0 ? (
                    <div className="text-center py-8">
                      <FaQuestionCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        Không có câu hỏi nào phù hợp với bộ lọc hiện tại
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredQuestions.map(question => (
                        <div 
                          key={question._id || question.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedQuestions.includes(question._id || question.id)
                              ? 'border-blue-500 bg-blue-50'
                              : formData.selectedQuestions.includes(question._id || question.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleQuestionSelect(question._id || question.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-2">
                                {question.title || question.question}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Badge variant="outline">
                                  {getQuestionTypeLabel(question.type)}
                                </Badge>
                                <Badge variant="outline">
                                  {getDifficultyLabel(question.difficulty)}
                                </Badge>
                                <span>{question.points || 1} điểm</span>
                                {question.estimatedTime && (
                                  <span>{question.estimatedTime}s</span>
                                )}
                              </div>
                              {question.tags && question.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {question.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {question.tags.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{question.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="ml-4 flex flex-col items-center space-y-2">
                              <input
                                type="checkbox"
                                checked={selectedQuestions.includes(question._id || question.id)}
                                onChange={() => handleQuestionSelect(question._id || question.id)}
                                className="h-5 w-5 text-blue-600"
                              />
                              {formData.selectedQuestions.includes(question._id || question.id) && (
                                <Badge variant="success" className="text-xs">
                                  Đã thêm
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Media & Content */}
        <MediaUpload
          onMediaChange={(media) => handleInputChange('content', { ...formData.content, media })}
          initialMedia={formData.content.media}
          allowedTypes={['image', 'video', 'audio', 'document']}
          maxFileSize={10 * 1024 * 1024}
        />

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin bổ sung</CardTitle>
            <CardDescription>
              Thêm giải thích, tags và tài liệu tham khảo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="explanation">Giải thích chung</Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => handleInputChange('explanation', e.target.value)}
                placeholder="Giải thích chung về câu hỏi và đáp án..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Nhập tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag}>
                  Thêm
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Tài liệu tham khảo</Label>
                <Button type="button" variant="outline" size="sm" onClick={addReference}>
                  <FaPlus className="w-4 h-4 mr-1" />
                  Thêm tham khảo
                </Button>
              </div>
              
              {formData.references.map((ref) => (
                <div key={ref.id} className="border rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <Select
                      value={ref.type}
                      onValueChange={(value) => updateReference(ref.id, 'type', value)}
                      className="w-32"
                    >
                      <option value="url">URL</option>
                      <option value="book">Sách</option>
                      <option value="document">Tài liệu</option>
                    </Select>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeReference(ref.id)}
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Input
                    value={ref.title}
                    onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                    placeholder="Tiêu đề tài liệu tham khảo..."
                  />
                  
                  <Input
                    value={ref.url}
                    onChange={(e) => updateReference(ref.id, 'url', e.target.value)}
                    placeholder={ref.type === 'url' ? 'https://...' : 'Nguồn/Đường dẫn...'}
                  />
                  
                  {ref.type === 'book' && (
                    <Input
                      value={ref.page}
                      onChange={(e) => updateReference(ref.id, 'page', e.target.value)}
                      placeholder="Trang (VD: 123-125)"
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <FaEye className="w-4 h-4 mr-2" />
            {showPreview ? 'Ẩn xem trước' : 'Xem trước'}
          </Button>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/questions')}
            >
              <FaTimes className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              <FaSave className="w-4 h-4 mr-2" />
              {loading ? 'Đang lưu...' : 'Lưu câu hỏi'}
            </Button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Xem trước câu hỏi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">{formData.title || 'Tiêu đề câu hỏi'}</h3>
                  <p className="text-gray-700 mb-4">{formData.question || 'Nội dung câu hỏi...'}</p>
                </div>
                
                <div className="space-y-2">
                  {formData.answers.filter(a => a.text.trim()).map((answer, index) => (
                    <div
                      key={answer.id}
                      className={`p-3 rounded border ${
                        answer.isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium mr-2 min-w-[20px]">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span>{answer.text}</span>
                        {answer.isCorrect && (
                          <Badge variant="success" className="ml-2">Đúng</Badge>
                        )}
                      </div>
                      {answer.explanation && (
                        <p className="text-sm text-gray-600 mt-1 ml-6">
                          {answer.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                {formData.explanation && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Giải thích:</span> {formData.explanation}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};

export default CreateQuestion;
