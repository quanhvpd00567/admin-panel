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
  Badge,
  Select,
  Label,
} from '../../components/ui';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaCheckCircle,
  FaTimes,
  FaFile,
  FaBook
} from 'react-icons/fa';
import { mockQuestionService, QUESTION_TYPES, QUIZ_DIFFICULTY } from '../../services/questions/mockQuestionData';
import { mockSubjectService } from '../../services/education/mockSubjectData';

const QuestionBank = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, questionId: null });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [questionsResponse, subjectsResponse] = await Promise.all([
        mockQuestionService.getQuestions(),
        mockSubjectService.getSubjects()
      ]);
      setQuestions(questionsResponse.questions || []);
      setSubjects(subjectsResponse.subjects || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await mockQuestionService.deleteQuestion(questionId);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  // Filter questions based on search criteria
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || question.subjectId === selectedSubject;
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;
    const matchesType = !selectedType || question.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Không xác định';
  };

  const getTypeLabel = (type) => {
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedDifficulty('');
    setSelectedType('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ngân hàng câu hỏi</h1>
        <p className="text-gray-600">Quản lý tất cả câu hỏi trắc nghiệm</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate('/questions/create')}>
            <FaPlus className="w-4 h-4 mr-2" />
            Tạo câu hỏi mới
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/questions/import')}>
            <FaFile className="w-4 h-4 mr-2" />
            Import câu hỏi
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          Tổng: <span className="font-medium">{filteredQuestions.length}</span> câu hỏi
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaFilter className="w-5 h-5 mr-2" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Môn học</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <option value="">Tất cả môn học</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <option value="">Tất cả độ khó</option>
                {Object.entries(QUIZ_DIFFICULTY).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Loại câu hỏi</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <option value="">Tất cả loại</option>
                {Object.entries(QUESTION_TYPES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {getTypeLabel(key)}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {currentQuestions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{startIndex + index + 1}
                    </span>
                    <Badge variant="outline">
                      {getTypeLabel(question.type)}
                    </Badge>
                    <Badge variant="outline">
                      {QUIZ_DIFFICULTY[question.difficulty]}
                    </Badge>
                    <Badge variant="outline">
                      {getSubjectName(question.subjectId)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {question.question}
                  </h3>
                  
                  <div className="space-y-2 mb-3">
                    {question.options?.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-center p-2 rounded text-sm ${
                          question.correctAnswers?.includes(optIndex)
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <span className="font-medium mr-2 min-w-[20px]">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span className="flex-1">{option}</span>
                        {question.correctAnswers?.includes(optIndex) && (
                          <FaCheckCircle className="w-4 h-4 text-green-600 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {question.explanation && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Giải thích:</span> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/questions/view/${question.id}`)}
                  >
                    <FaEye className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/questions/edit/${question.id}`)}
                  >
                    <FaEdit className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setDeleteConfirm({ isOpen: true, questionId: question.id })}
                  >
                    <FaTrash className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {currentQuestions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy câu hỏi nào
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedSubject || selectedDifficulty || selectedType
                  ? 'Thử thay đổi tiêu chí tìm kiếm của bạn'
                  : 'Chưa có câu hỏi nào trong hệ thống'}
              </p>
              {!searchTerm && !selectedSubject && !selectedDifficulty && !selectedType && (
                <Button onClick={() => navigate('/questions/create')}>
                  <FaPlus className="w-4 h-4 mr-2" />
                  Tạo câu hỏi đầu tiên
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredQuestions.length)} trong tổng số {filteredQuestions.length} câu hỏi
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Trước
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, questionId: null })}
        onConfirm={() => {
          handleDeleteQuestion(deleteConfirm.questionId);
          setDeleteConfirm({ isOpen: false, questionId: null });
        }}
        title="Xóa câu hỏi"
        message="Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default QuestionBank;
