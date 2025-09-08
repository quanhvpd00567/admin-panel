import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaEye,
  FaEdit
} from 'react-icons/fa';
import { Editor } from '@tinymce/tinymce-react';
import { showToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  Select,
  SelectContent,
  SelectItem
} from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Switch from '../../components/ui/Switch';
import questionAPI from '../../services/questions/questionAPI';
import { subjectAPI } from '../../services/subjectAPI';
import QuestionPreview from '../../components/questions/QuestionPreview';
import { CLASS_OPTIONS } from '../../constants/classes';
import { 
  QUESTION_TYPES, 
  DIFFICULTY_LEVELS, 
  QUESTION_VALIDATION,
  ANSWER_TEMPLATES 
} from '../../constants/questions';
import {
  getTinyMCEConfig,
  TINYMCE_API_KEY,
} from '../../config/tinymceConfig';

const QuestionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const editorRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [questionType, setQuestionType] = useState('true_false');
  const [answers, setAnswers] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  
  // Form data state
  const [formData, setFormData, setValue] = useState({
    title: '',
    content: '',
    type: 'true_false',
    subject: '',
    class: CLASS_OPTIONS[0].code,
    difficulty: DIFFICULTY_LEVELS[0].value,
    explanation: '',
    points: 1
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Load subjects for selected class
  const loadSubjects = useCallback(async (selectedClass) => {
    try {
      let response;
      if (!selectedClass) {
        response = await subjectAPI.getSubjects();
      } else {
        response = await subjectAPI.getSubjectsByClass(selectedClass);
      }
      if (response.success) {
        const subjectsList = response.data.subjects || response.data || [];
        setSubjects(subjectsList);
        if (subjectsList.length > 0) {
          setFormData(prev => ({ ...prev, subject: subjectsList[0]._id }));
        } else {
          setFormData(prev => ({ ...prev, subject: '' }));
        }
      }
    } catch (error) {
      console.error('Load subjects error:', error);
    }
  }, []);

  // Load question for editing
  const loadQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const response = await questionAPI.getQuestion(id);
      if (response.success) {
        const question = response.data;
        setQuestionType(question.type);
        setAnswers(question.answers || []);
        
        setFormData({
          title: question.title || '',
          content: question.content,
          type: question.type,
          subject: question.subject?._id || '',
          class: question.class || '',
          difficulty: question.difficulty,
          explanation: question.explanation || '',
          points: question.points
        });
        
      } else {
        showToast.error(response.error || 'Failed to load question');
        navigate('/questions');
      }
    } catch (error) {
      showToast.error('Error loading question');
      console.error('Load question error:', error);
      navigate('/questions');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Load data on component mount
  useEffect(() => {
    loadSubjects(formData.class);
    if (isEdit) {
      loadQuestion();
    } else {
      initializeAnswers('true_false');
    }
  }, [isEdit, loadSubjects, loadQuestion]);

  // Reload subjects when class changes
  useEffect(() => {
    loadSubjects(formData.class);
  }, [formData.class, loadSubjects]);

  // Initialize answers based on question type
  const initializeAnswers = (type) => {
    const template = ANSWER_TEMPLATES[type];
    if (template) {
      setAnswers([...template]);
    } else {
      setAnswers([]);
    }
  };

  // Handle question type change
  const handleTypeChange = (type) => {
    setQuestionType(type);
    setFormData(prev => ({ ...prev, type }));
    initializeAnswers(type);
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // If class changes, clear subject so it will be set by loadSubjects
    if (field === 'class') {
      setFormData(prev => ({ ...prev, subject: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter the question title';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Please enter the question content';
    } else if (formData.content.trim().length < QUESTION_VALIDATION.MIN_TEXT_LENGTH) {
      newErrors.content = `Question must be at least ${QUESTION_VALIDATION.MIN_TEXT_LENGTH} characters long`;
    }
    
    if (!formData.type) {
      newErrors.type = 'Please select question type';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }
    
    if (!formData.class) {
      newErrors.class = 'Please select a class';
    }
    
    if (!formData.difficulty) {
      newErrors.difficulty = 'Please select difficulty';
    }
    
    if (!formData.points || formData.points < QUESTION_VALIDATION.MIN_POINTS || formData.points > QUESTION_VALIDATION.MAX_POINTS) {
      newErrors.points = `Points must be between ${QUESTION_VALIDATION.MIN_POINTS} and ${QUESTION_VALIDATION.MAX_POINTS}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle answer text change
  const handleAnswerTextChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], text: value };
    setAnswers(newAnswers);
  };

  // Handle answer correct status change
  const handleAnswerCorrectChange = (index, isCorrect) => {
    const newAnswers = [...answers];
    
    // For single choice, only one answer can be correct
    if (questionType === 'single_choice' && isCorrect) {
      newAnswers.forEach((answer, i) => {
        newAnswers[i] = { ...answer, isCorrect: i === index };
      });
    } else {
      newAnswers[index] = { ...newAnswers[index], isCorrect };
    }
    
    setAnswers(newAnswers);
  };

  // Add new answer
  const addAnswer = () => {
    if (answers.length < QUESTION_VALIDATION.MAX_ANSWERS) {
      setAnswers([...answers, { text: '', isCorrect: false }]);
    }
  };

  // Remove answer
  const removeAnswer = (index) => {
    if (answers.length > 2) {
      const newAnswers = answers.filter((_, i) => i !== index);
      setAnswers(newAnswers);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // Validate answers
      const validAnswers = answers.filter(answer => answer.text.trim() !== '');
      
      if (validAnswers.length < 2 && questionType !== 'fill_blank') {
        showToast.error('Please provide at least 2 answers');
        setLoading(false);
        return;
      }

      if (questionType === 'fill_blank' && validAnswers.length === 0) {
        showToast.error('Please provide at least 1 correct answer');
        setLoading(false);
        return;
      }

      const hasCorrectAnswer = validAnswers.some(answer => answer.isCorrect);
      if (!hasCorrectAnswer) {
        showToast.error('Please mark at least one answer as correct');
        setLoading(false);
        return;
      }

      const questionData = {
        ...formData,
        answers: validAnswers
      };

      let response;
      if (isEdit) {
        response = await questionAPI.updateQuestion(id, questionData);
      } else {
        response = await questionAPI.createQuestion(questionData);
      }

      if (response.success) {
        showToast.success(`Question ${isEdit ? 'updated' : 'created'} successfully`);
        // Navigate to question detail page after successful submission
        const questionId = isEdit ? id : response.data?.id || response.id;
        navigate(`/questions/${questionId}`);
      } else {
        showToast.error(response.error || `Failed to ${isEdit ? 'update' : 'create'} question`);
        // DO NOT clear form data or answers on error
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach(error => {
            showToast.error(error.message || error);
          });
        }
      }
    } catch (error) {
      showToast.error(`Error ${isEdit ? 'updating' : 'creating'} question`);
      // DO NOT clear form data or answers on error
    } finally {
      setLoading(false);
    }
  };

  // Render answer inputs based on question type
  const renderAnswerInputs = () => {
    if (questionType === 'fill_blank') {
      return (
        <Card title="Correct Answers" className="bg-white">
          {answers.map((answer, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <div className="flex-1">
                <Input
                  placeholder={`Correct answer ${index + 1}`}
                  value={answer.text}
                  onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                />
              </div>
              <div className="w-12">
                {answers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAnswer(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addAnswer}
            className="w-full mt-2"
            disabled={answers.length >= QUESTION_VALIDATION.MAX_ANSWERS}
          >
            <FaPlus className="mr-2" />
            Add Answer
          </Button>
        </Card>
      );
    }

    return (
      <Card title="Answer Options" className="bg-white">
        {answers.map((answer, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <div className="flex-1">
              <Input
                placeholder={`Answer ${index + 1}`}
                value={answer.text}
                onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                disabled={questionType === 'true_false'}
              />
            </div>
            <div className="w-20 flex justify-center">
              {questionType === 'single_choice' ? (
                <Button
                  variant={answer.isCorrect ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleAnswerCorrectChange(index, !answer.isCorrect)}
                  className="min-w-16"
                >
                  {answer.isCorrect ? <FaCheck /> : <FaTimes />}
                </Button>
              ) : (
                <Switch
                  checked={answer.isCorrect}
                  onCheckedChange={(checked) => handleAnswerCorrectChange(index, checked)}
                />
              )}
            </div>
            <div className="w-12">
              {questionType !== 'true_false' && answers.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAnswer(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FaTrash />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {questionType !== 'true_false' && answers.length < QUESTION_VALIDATION.MAX_ANSWERS && (
          <Button
            variant="outline"
            onClick={addAnswer}
            className="w-full mt-2"
          >
            <FaPlus className="mr-2" />
            Add Answer Option
          </Button>
        )}
      </Card>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/questions')}
            className="mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">
            {isEdit ? 'Edit Question' : 'Create New Question'}
          </h2>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'edit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaEdit className="mr-2 inline" />
            Edit Question
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaEye className="mr-2 inline" />
            Preview
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'edit' ? (
        /* Form */
        <form onSubmit={handleSubmit}>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Question Details Card */}
            <Card title="Question Details" className="bg-white">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-left">
                    Question Title *
                  </label>
                  <Input
                    placeholder="Enter a short, descriptive title for this question"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    A brief title that summarizes what this question is about
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-left">
                      Question Text *
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={!showPreview ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setShowPreview(false)}
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant={showPreview ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setShowPreview(true)}
                      >
                        <FaEye className="mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                    
                    {!showPreview ? (
                      <div className="border rounded-lg overflow-hidden bg-white">
                        <Editor
                          apiKey={TINYMCE_API_KEY}
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          value={formData.content}
                          onEditorChange={(content) => handleFieldChange('content', content)}
                          init={{
                            ...getTinyMCEConfig(),
                            height: 300,
                            menubar: false,
                            toolbar: 'bold italic underline | bullist numlist | link image | code | removeformat | align lineheight',
                            plugins: 'lists link image code',
                            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; }',
                          }}
                        />
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 bg-gray-50 min-h-[300px]">
                        <h4 className="text-sm font-medium text-gray-600 mb-3">Preview:</h4>
                        <div 
                          className="text-gray-900"
                          style={{ textAlign: 'left' }}
                          dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-400 italic">No content to preview</p>' }}
                        />
                      </div>
                    )}
                    
                    {errors.text && (
                      <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                    )}
                  </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-left">
                    Question Type *
                  </label>
                  <Select placeholder="Select question type" value={formData.type} onValueChange={handleTypeChange}>
                    <SelectContent>
                      {QUESTION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-left">
                      Subject *
                    </label>
                    <Select 
                      value={formData.subject} 
                      onValueChange={(value) => handleFieldChange('subject', value)}
                    >
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject._id} value={subject._id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-left">
                      Class *
                    </label>
                    <Select 
                      value={formData.class} 
                      onValueChange={(value) => handleFieldChange('class', value)}
                    >
                      <SelectContent>
                        {CLASS_OPTIONS.map(cls => (
                          <SelectItem key={cls.code} value={cls.code}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.class && (
                      <p className="text-red-500 text-sm mt-1">{errors.class}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-left">
                      Difficulty *
                    </label>
                    <Select 
                      value={formData.difficulty} 
                      onValueChange={(value) => handleFieldChange('difficulty', value)}
                    >
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.difficulty && (
                      <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-left">
                      Points *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Points for correct answer"
                      value={formData.points}
                      onChange={(e) => handleFieldChange('points', parseInt(e.target.value) || 1)}
                      className={errors.points ? 'border-red-500' : ''}
                    />
                    {errors.points && (
                      <p className="text-red-500 text-sm mt-1">{errors.points}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-left">
                    Explanation (Optional)
                  </label>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <Editor
                      apiKey={TINYMCE_API_KEY}
                      value={formData.explanation}
                      onEditorChange={(content) => handleFieldChange('explanation', content)}
                      init={{
                        ...getTinyMCEConfig(),
                        height: 200,
                        menubar: false,
                        toolbar: 'bold italic underline | bullist numlist | link | removeformat | align lineheight',
                        plugins: 'lists link',
                        placeholder: 'Explain the correct answer...',
                        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; }',
                      }}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Provide an explanation to help students understand the correct answer
                  </p>
                </div>
              </div>
            </Card>

            {/* Answer Options Card */}
            {renderAnswerInputs()}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/questions')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="min-w-32"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {isEdit ? 'Update Question' : 'Create Question'}
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        /* Preview Tab */
        <div>
          <QuestionPreview 
            formData={formData}
            answers={answers}
            subjects={subjects}
          />
          <div className="mt-6 flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab('edit')}
            >
              <FaEdit className="mr-2" />
              Back to Edit
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-32"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {isEdit ? 'Update Question' : 'Create Question'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;
