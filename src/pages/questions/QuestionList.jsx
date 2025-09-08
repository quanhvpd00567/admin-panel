import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaSync,
  FaFilter,
  FaQuestionCircle,
  FaCheck,
  FaList,
  FaCircle
} from 'react-icons/fa';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { ConfirmModal } from '../../components/ui/Modal';
import questionAPI from '../../services/questions/questionAPI';
import { subjectAPI } from '../../services/subjectAPI';
import { CLASS_OPTIONS, getClassNameByCode } from '../../constants/classes';
import { DIFFICULTY_LEVELS, QUESTION_TYPES, getDifficultyColor } from '../../constants/questions';

const QuestionList = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // State management
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, questionId: null });

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    type: '',
    subject: '',
    class: CLASS_OPTIONS[3].code,
    difficulty: '',
    search: ''
  });

  // Load questions with filters
  const loadQuestions = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await questionAPI.getQuestions(params);

      if (response.success) {
        setQuestions(response.data.questions || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total || 0
        }));
      } else {
        toast.error(response.error || 'Failed to load questions');
      }
    } catch (error) {
      toast.error('Error loading questions');
      console.error('Load questions error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load subjects 
  const loadSubjects = async () => {
    try {
      let response;
      if (filters.class === '') {
        response = await subjectAPI.getSubjectsList();
      } else {
        response = await subjectAPI.getSubjectsByClass(filters.class);
      }
      if (response.success) {
        setSubjects(response.data || []);
      }
    } catch (error) {
      console.error('Load subjects error:', error);
    }
  };

  // Load question statistics
  const loadStats = useCallback(async () => {
    try {
      // const response = await questionAPI.getQuestionStats();
      // if (response.success) {
      //   setStats(response.data || {});
      // }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadStats();
  }, [loadStats]);


  // Load questions when pagination changes (not filters)
  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize]);

  // Load subjects when class filter changes
  useEffect(() => {
    loadSubjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.class]);

  // Handle delete question
  const handleDelete = async (id) => {
    try {
      const response = await questionAPI.deleteQuestion(id);
      if (response.success) {
        toast.success('Question deleted successfully');
        loadQuestions();
        loadStats();
      } else {
        toast.error(response.error || 'Failed to delete question');
      }
    } catch (error) {
      toast.error('Error deleting question');
      console.error('Delete question error:', error);
    }
    setDeleteModal({ show: false, questionId: null });
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: '',
      subject: '',
      class: CLASS_OPTIONS[0].code,
      difficulty: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  // Get difficulty configuration
  const getDifficultyConfig = (difficulty) => {
    const colorMap = {
      'bg-green-100 text-green-800': 'green',
      'bg-yellow-100 text-yellow-800': 'yellow',
      'bg-red-100 text-red-800': 'red',
      'bg-gray-100 text-gray-800': 'gray'
    };
    
    const config = DIFFICULTY_LEVELS.find(d => d.value === difficulty);
    const colorClass = getDifficultyColor(difficulty);
    
    return config ? {
      ...config,
      color: colorMap[colorClass] || 'gray'
    } : { 
      label: difficulty, 
      color: 'gray' 
    };
  };

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaQuestionCircle className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Questions
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.total || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaCheck className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                True/False
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.byType?.true_false || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaList className="w-8 h-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Multiple Choice
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.byType?.multiple_choice || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaCircle className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Single Choice
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.byType?.single_choice || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header with title and create button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Questions Management</h2>
        <Button
          variant="primary"
          onClick={() => navigate('/questions/create')}
        >
          <FaPlus className="mr-2" />
          Create Question
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          {/* Row 1: Search, Difficulty, Question Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <Input
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setPagination(prev => ({ ...prev, current: 1 }));
                    loadQuestions();
                  }
                }}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 bottom-3 text-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange('difficulty', value)}>
                <option value="">All Difficulties</option>
                {DIFFICULTY_LEVELS.map((difficulty, index) => (
                  <option key={index} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question Type
              </label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <option value="">All Types</option>
                {QUESTION_TYPES.map((type, index) => (
                  <option key={index} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Row 2: Class, Subject, Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Class
              </label>
              <Select value={filters.class} onValueChange={(value) => handleFilterChange('class', value)}>
                <option value="">All Classes</option>
                {CLASS_OPTIONS.map((classItem, index) => (
                  <option key={index} value={classItem.code}>
                    {classItem.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <Select value={filters.subject} onValueChange={(value) => handleFilterChange('subject', value)}>
                <option value="">All Subjects</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Actions
              </label>
              <div className="flex gap-2 h-10">
                <Button variant="outline" onClick={clearFilters} className="flex-1 h-full">
                  <FaFilter className="mr-1" />
                  Clear
                </Button>
                <Button variant="primary" onClick={() => { setPagination(prev => ({ ...prev, current: 1 })); loadQuestions(); }} className="flex-1 h-full">
                  <FaSearch className="mr-1" />
                  Search
                </Button>
                <Button variant="outline" onClick={loadQuestions} className="flex-1 h-full">
                  <FaSync className="mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Questions Table */}
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Questions List</h3>
            <div className="text-sm text-gray-500">
              {pagination.total} questions found
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <FaQuestionCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or create a new question.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Question title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Subject</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Class</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Difficulty</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => {
                      const diffConfig = getDifficultyConfig(question.difficulty);
                      const typeLabel = QUESTION_TYPES.find(t => t.value === question.type)?.label || question.type;

                      return (
                        <tr key={question._id} className="border-b text-left border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4">
                            <div className="max-w-xs">
                              <div className="truncate font-medium text-gray-900 dark:text-white" title={question.title}>
                                {question.title}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge color="blue" variant="soft">
                              {typeLabel}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">
                              {question.subject?.name || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge color="green" variant="soft">
                              {getClassNameByCode(question.class)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge color={diffConfig.color || 'gray'} variant="soft">
                              {diffConfig.label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex gap-1 justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/questions/${question._id}`)}
                                title="View Question"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <FaEye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/questions/${question._id}/edit`)}
                                title="Edit Question"
                                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                              >
                                <FaEdit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteModal({ show: true, questionId: question._id })}
                                title="Delete Question"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <FaTrash className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={(newPageSize) => {
                  setPagination(prev => ({ 
                    ...prev, 
                    pageSize: newPageSize, 
                    current: 1 
                  }));
                }}
                showSizeChanger={true}
                showQuickJumper={pagination.total > 100}
                disabled={loading}
              />
            </>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, questionId: null })}
        onConfirm={() => handleDelete(deleteModal.questionId)}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default QuestionList;
