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
  Label,
  Select,
  Textarea,
  Badge,
} from '../../components/ui';
import { FaSave, FaTimes, FaPlus, FaTrash, FaEye, FaCopy, FaHistory } from 'react-icons/fa';
import { mockQuestionService, QUESTION_TYPES, QUIZ_DIFFICULTY } from '../../services/questions/mockQuestionData';
import { mockSubjectService } from '../../services/education/mockSubjectData';
import MediaUpload from '../../components/MediaUpload';
import RichTextEditor from '../../components/RichTextEditor';
import QuestionAnalytics from '../../components/questions/QuestionAnalytics';

const EditQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    type: 'multiple_choice',
    subjectId: '',
    difficulty: 'beginner',
    points: 10,
    estimatedTime: 60,
    category: '',
    tags: [],
    explanation: '',
    answers: [],
    content: {
      text: '',
      media: null,
      code: null,
    },
    references: [],
  });

  const [originalQuestion, setOriginalQuestion] = useState(null);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const [questionResponse, subjectsResponse] = await Promise.all([
        mockQuestionService.getQuestion(id),
        mockSubjectService.getSubjects()
      ]);
      
      const question = questionResponse;
      setOriginalQuestion(question);
      setSubjects(subjectsResponse.data || []);
      
      // Populate form with existing data
      setFormData({
        title: question.title || '',
        question: question.question || '',
        type: question.type || 'multiple_choice',
        subjectId: question.subjectId || '',
        difficulty: question.difficulty || 'beginner',
        points: question.points || 10,
        estimatedTime: question.estimatedTime || 60,
        category: question.category || '',
        tags: question.tags || [],
        explanation: question.explanation || '',
        answers: question.answers?.map(answer => ({
          ...answer,
          id: answer.id || Date.now().toString() + Math.random(),
        })) || [],
        content: question.content || {
          text: '',
          media: null,
          code: null,
        },
        references: question.references?.map(ref => ({
          ...ref,
          id: ref.id || Date.now().toString() + Math.random(),
        })) || [],
      });
      
    } catch (error) {
      console.error('Error fetching question:', error);
      navigate('/questions');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
      setFormData(prev => ({
        ...prev,
        answers: prev.answers.map(answer => ({
          ...answer,
          isCorrect: answer.id === answerId
        }))
      }));
    } else {
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
    if (formData.answers.length <= 2) return;
    
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
        subjectName: subjects.find(s => s.id === formData.subjectId)?.name || '',
        topics: [formData.category].filter(Boolean),
        status: 'active',
      };

      await mockQuestionService.updateQuestion(id, questionData);
      navigate('/questions');
    } catch (error) {
      console.error('Error updating question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicatedData = {
        ...formData,
        title: `${formData.title} (Copy)`,
        content: {
          text: formData.question,
          media: formData.content.media,
          code: formData.content.code,
        },
        answers: formData.answers
          .filter(a => a.text.trim())
          .map((answer, index) => ({
            ...answer,
            id: Date.now().toString() + index,
            order: index + 1,
          })),
        subjectName: subjects.find(s => s.id === formData.subjectId)?.name || '',
        topics: [formData.category].filter(Boolean),
        status: 'active',
      };

      const newQuestion = await mockQuestionService.createQuestion(duplicatedData);
      navigate(`/questions/edit/${newQuestion.id}`);
    } catch (error) {
      console.error('Error duplicating question:', error);
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'multiple_choice':
        return 'Trắc nghiệm';
      case 'true_false':
        return 'Đúng/Sai';
      case 'multiple_answer':
        return 'Nhiều đáp án';
      default:
        return type;
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'Dễ';
      case 'intermediate':
        return 'Trung bình';
      case 'advanced':
        return 'Khó';
      default:
        return difficulty;
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải câu hỏi...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chỉnh sửa câu hỏi</h1>
        <p className="text-gray-600">Cập nhật thông tin câu hỏi trong ngân hàng câu hỏi</p>
      </div>

      {/* Analytics Card */}
      {originalQuestion?.analytics && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaHistory className="w-5 h-5 mr-2" />
              Thống kê sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {originalQuestion.analytics.timesUsed}
                </div>
                <div className="text-sm text-gray-600">Lần sử dụng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {originalQuestion.analytics.correctRate}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ đúng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {originalQuestion.analytics.averageTime}s
                </div>
                <div className="text-sm text-gray-600">Thời gian TB</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {originalQuestion.analytics.discrimination.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Chỉ số phân biệt</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Chỉnh sửa thông tin cơ bản về câu hỏi
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
                  {Object.entries(QUESTION_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {getQuestionTypeLabel(key)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="question">Nội dung câu hỏi *</Label>
              <RichTextEditor
                value={formData.question}
                onChange={(value) => handleInputChange('question', value)}
                placeholder="Nhập nội dung câu hỏi chi tiết..."
                minHeight="150px"
                className={errors.question ? 'border-red-500' : ''}
              />
              {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="subjectId">Môn học *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) => handleInputChange('subjectId', value)}
                >
                  
                    
                  
                  
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
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
                  
                    
                  
                  
                    {Object.entries(QUIZ_DIFFICULTY).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {getDifficultyLabel(key)}
                      </SelectItem>
                    ))}
                  
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="VD: HTML Fundamentals"
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
              Chỉnh sửa các đáp án cho câu hỏi. Đánh dấu đáp án đúng.
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
              
              {formData.type !== 'true_false' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAnswer}
                  className="w-full"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Thêm đáp án
                </Button>
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
              Chỉnh sửa giải thích, tags và tài liệu tham khảo
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
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <FaEye className="w-4 h-4 mr-2" />
              {showPreview ? 'Ẩn xem trước' : 'Xem trước'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleDuplicate}
            >
              <FaCopy className="w-4 h-4 mr-2" />
              Nhân bản
            </Button>
          </div>

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
              {loading ? 'Đang cập nhật...' : 'Cập nhật câu hỏi'}
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

      {/* Full Analytics Section */}
      {originalQuestion?.analytics && (
        <div className="mt-8">
          <QuestionAnalytics 
            questionId={id} 
            questionData={originalQuestion} 
          />
        </div>
      )}
    </div>
  );
};

export default EditQuestion;
