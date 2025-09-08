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
  Badge,
} from '../../components/ui';
import { 
  FaEdit, 
  FaArrowLeft, 
  FaClock, 
  FaUsers, 
  FaFile, 
  FaCheckCircle,
  FaTimes,
  FaCalendar,
  FaCog,
  FaSpinner,
  FaPlay
} from 'react-icons/fa';
import { quizAPI } from '../../services/quizzes/quizAPI';
import { 
  QUIZ_DIFFICULTY, 
  QUIZ_STATUS,
  getQuizStatusColor
} from '../../constants/quizzes';

const ViewQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizResult = await quizAPI.getQuiz(id);
        
        if (quizResult.success) {
          const quizData = quizResult.data;
          setQuiz(quizData);

          // Set subject data (already populated in quiz response)
          if (quizData.subject) {
            setSubject(quizData.subject);
          }

          // Get quiz questions with details
          if (quizData.questions && quizData.questions.length > 0) {
            setQuestions(quizData.questions);
          }
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Không giới hạn';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (quiz) => {
    const statusObj = QUIZ_STATUS.find(s => s.value === quiz.status);
    if (statusObj) {
      const colorClass = getQuizStatusColor(quiz.status);
      return <Badge className={colorClass}>{statusObj.label}</Badge>;
    }
    return <Badge variant="secondary">Không xác định</Badge>;
  };

  const Label = ({ children, className = "" }) => (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FaTimes className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy bài kiểm tra
          </h2>
          <p className="text-gray-600 mb-4">
            Bài kiểm tra bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => navigate('/quizzes')}>
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/quizzes')}
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusBadge(quiz)}
              <Badge variant="outline">
                {QUIZ_DIFFICULTY[quiz.difficulty]}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {/* Take Quiz Button - Only show for published quizzes */}
          {quiz.status === 'published' && (
            <Button 
              onClick={() => navigate(`/quizzes/take/${quiz.id}`)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FaPlay className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
          )}
          
          <Button onClick={() => navigate(`/quizzes/edit/${quiz.id}`)}>
            <FaEdit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Quiz Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaFile className="w-5 h-5 mr-2" />
                  Thông tin bài kiểm tra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quiz.description && (
                  <div>
                    <Label>Mô tả</Label>
                    <p className="text-gray-600 mt-1">{quiz.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Môn học</Label>
                    <p className="text-gray-900 mt-1">{subject?.name || 'Không xác định'}</p>
                  </div>
                  
                  <div>
                    <Label>Lớp học</Label>
                    <p className="text-gray-900 mt-1">{quiz?.class?.name || 'Không xác định'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaCog className="w-5 h-5 mr-2" />
                  Cài đặt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <FaClock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="text-lg font-semibold">{quiz.duration} phút</p>
                  </div>
                  
                  <div className="text-center">
                    <FaFile className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Số câu hỏi</p>
                    <p className="text-lg font-semibold">{quiz.totalQuestions}</p>
                  </div>
                  
                  <div className="text-center">
                    <FaCheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Điểm đạt</p>
                    <p className="text-lg font-semibold">{quiz.passingScore}%</p>
                  </div>
                  
                  <div className="text-center">
                    <FaUsers className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Lượt thi</p>
                    <p className="text-lg font-semibold">{quiz.attemptCount || 0}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Cho phép làm lại:</span>
                      {quiz.allowRetake ? (
                        <FaCheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <FaTimes className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Hiển thị kết quả:</span>
                      {quiz.showResults ? (
                        <FaCheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <FaTimes className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Xáo trộn câu hỏi:</span>
                      {quiz.shuffleQuestions ? (
                        <FaCheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <FaTimes className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Xáo trộn đáp án:</span>
                      {quiz.shuffleAnswers ? (
                        <FaCheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <FaTimes className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách câu hỏi ({questions.length})</CardTitle>
                <CardDescription>
                  Xem trước các câu hỏi trong bài kiểm tra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questions.slice(0, 3).map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {question.type === 'multiple_choice' ? 'Trắc nghiệm' :
                               question.type === 'true_false' ? 'Đúng/Sai' : 'Nhiều đáp án'}
                            </Badge>
                            <Badge variant="outline">
                              {QUIZ_DIFFICULTY[question.difficulty]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {question.options?.slice(0, 2).map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="p-2 rounded text-sm bg-gray-50 border border-gray-200"
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            {option}
                          </div>
                        ))}
                        {question.options?.length > 2 && (
                          <p className="text-sm text-gray-500 italic">
                            ... và {question.options.length - 2} tùy chọn khác
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {questions.length > 3 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">
                        ... và {questions.length - 3} câu hỏi khác
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => navigate('/questions')}
                      >
                        Xem tất cả câu hỏi
                      </Button>
                    </div>
                  )}
                  
                  {questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaFile className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Chưa có câu hỏi nào được thêm vào bài kiểm tra</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaCalendar className="w-5 h-5 mr-2" />
                Thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Ngày tạo</Label>
                <p className="text-sm text-gray-600">{formatDate(quiz.createdAt)}</p>
              </div>
              
              <div>
                <Label>Cập nhật cuối</Label>
                <p className="text-sm text-gray-600">{formatDate(quiz.updatedAt)}</p>
              </div>
              
              {quiz.startDate && (
                <div>
                  <Label>Bắt đầu</Label>
                  <p className="text-sm text-gray-600">{formatDate(quiz.startDate)}</p>
                </div>
              )}
              
              {quiz.endDate && (
                <div>
                  <Label>Kết thúc</Label>
                  <p className="text-sm text-gray-600">{formatDate(quiz.endDate)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => navigate(`/quizzes/edit/${quiz.id}`)}
              >
                <FaEdit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              
              <Button variant="outline" className="w-full">
                <FaUsers className="w-4 h-4 mr-2" />
                Xem kết quả
              </Button>
              
              <Button variant="outline" className="w-full">
                <FaFile className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz;
