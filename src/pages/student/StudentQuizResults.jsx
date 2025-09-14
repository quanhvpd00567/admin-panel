import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { makeQuizAPI } from '../../services/quizzes/index';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaArrowLeft, FaCheck, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaStar, FaLeaf, FaQuestionCircle, FaClock, FaCalendarAlt, FaRedo } from 'react-icons/fa';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui';
import { format } from 'date-fns';

const StudentQuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [listQuestionPassed, setListQuestionPassed] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});
  // list câu hỏi chưa làm
  const [listQuestionUnattempted, setListQuestionUnattempted] = useState([]);
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        setLoading(true);
        const response = await makeQuizAPI.getHistory(id);
        if (response.success) {
          setQuizResults(response.data);
          setQuestions(response.data.student_quiz.quizz.questions || []);
          setListQuestionPassed(response.data.list_question_passed || []);
          setStudentAnswers(response.data.student_answers || {});
          const total = response.data.student_quiz.quizz.questions.reduce((sum, question) => sum + (question.points || 0), 0);
          setTotalPoints(total);

          // Tạo danh sách câu hỏi chưa làm
          if (!response.data.student_answers) {
            setListQuestionUnattempted(response.data.student_quiz.quizz.questions.map((q) => q._id));
          } else {
            if (response.data.student_quiz && response.data.student_quiz.quizz && response.data.student_quiz.quizz.questions) {
              const unattempted = response.data.student_quiz.quizz.questions
                .filter((q) => !Object.prototype.hasOwnProperty.call(response.data.student_answers, q._id))
                .map((q) => q._id);
              setListQuestionUnattempted(unattempted);
            }
          }
        } else {
          showToast.error('Error fetching quiz results');
        }
      } catch (error) {
        showToast.error('Error fetching quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [id]);

  const toggleQuestion = (index) => {
    setExpandedQuestion((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return <LoadingSpinner color="green" />;
  }

  if (!quizResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Không tìm thấy kết quả bài làm.</p>
        <Button variant="primary" onClick={() => navigate('/student/quizzes')}>
          <FaArrowLeft className="mr-2" />
          Quay lại danh sách bài kiểm tra
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-blue-300/20 animate-bounce">
          <FaStar className="text-6xl transform rotate-12" />
        </div>
        <div className="absolute top-20 right-20 text-pink-300/20 animate-pulse">
          <FaLeaf className="text-5xl" />
        </div>
        <div className="absolute bottom-20 left-20 text-yellow-400/20 animate-bounce delay-1000">
          <FaStar className="text-7xl" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-300/20 animate-pulse delay-500">
          <FaLeaf className="text-8xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-8">Kết quả bài làm</h1>

        {/* Thông tin cơ bản */}
        <Card className="mb-8 bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 dark:text-white">{quizResults.student_quiz.quizz.title}</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-sm">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Điểm đạt</p>
                <p className="text-2xl font-bold text-indigo-600">{quizResults.total_score} / {totalPoints}</p>
              </div>
              <FaCheckCircle className="text-indigo-500 w-8 h-8" />
            </div>
            <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-sm">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Trạng thái</p>
                {quizResults.status === 'passed' ? (
                  <p className="text-2xl text-green-600 font-bold">
                    Đạt
                  </p>
                ) : (
                  <p className="text-2xl text-red-600 font-bold">
                    Không đạt
                  </p>
                )}
              </div>
              <FaTimesCircle className={`w-8 h-8 ${quizResults.status === 'passed' ? 'hidden' : 'text-red-500'}`} />
            </div>

            <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-sm">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Thời gian làm bài</p>
                <p className="text-lg font-bold text-gray-800">{Math.floor((quizResults.submissionTime || 0) / 60)} phút</p>
              </div>
              <FaClock className="text-gray-500 w-8 h-8" />
            </div>
            <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-sm">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Ngày làm bài</p>
                <p className="text-lg font-bold text-gray-800">{format(new Date(quizResults.createdAt), 'dd-MM-yyyy')}</p>
              </div>
              <FaCalendarAlt className="text-gray-500 w-8 h-8" />
            </div>
          </div>
          {quizResults.number_of_attempts < quizResults.student_quiz.quizz.max_attempts && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                onClick={() => navigate(`/student/quizzes/${id}/start`)}
                className="px-6 py-3 flex items-center bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-lg"
              >
                <FaRedo className="w-5 h-5 mr-2" />
                Làm lại
              </Button>
            </div>
          )}
        </Card>

        {/* Chi tiết câu hỏi */}
        <Card className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Chi tiết câu hỏi ({questions.length})</h3>
          {/* Thêm mục ghi chú icon nào là đã làm đúng, chưa làm, làm sai */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-600" />
              <span className="ml-2 text-sm text-gray-600 dark:text-white">Làm đúng {listQuestionPassed.length} / {questions.length} câu</span>
            </div>
            <div className="flex items-center">
              <FaTimesCircle className="text-red-600" />
              <span className="ml-2 text-sm text-gray-600 dark:text-white">Làm sai {questions.length - listQuestionPassed.length - listQuestionUnattempted.length} / {questions.length} câu</span>
            </div>
            <div className="flex items-center">
              <FaQuestionCircle className="text-yellow-600" />
              <span className="ml-2 text-sm text-gray-600 dark:text-white">Chưa làm {listQuestionUnattempted.length} / {questions.length} câu</span>
            </div>
          </div>
          <ul className="space-y-6">
            {questions.map((question, index) => (
              <li
                key={question._id}
                className="border border-gray-200 rounded-lg bg-gray-50 shadow-md p-6"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex items-center space-x-3">
                    {listQuestionUnattempted.includes(question._id) ? (
                      <FaQuestionCircle className="text-yellow-600" title="Chưa làm" />
                    ) : listQuestionPassed.includes(question._id) ? (
                      <FaCheckCircle className="text-green-600" title="Đúng" />
                    ) : (
                      <FaTimesCircle className="text-red-600" title="Sai" />
                    )}
                    <p className="text-lg font-medium text-gray-800">
                      Câu {index + 1}: {question.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      {question.points || 0} điểm
                    </span>
                    {expandedQuestion === index ? (
                      <FaChevronUp className="text-gray-600" />
                    ) : (
                      <FaChevronDown className="text-gray-600" />
                    )}
                  </div>
                </div>
                {expandedQuestion === index && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="mb-4 text-left ">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                       {(() => {
                         switch (question.type) {
                           case 'multiple_choice':
                             return 'Chọn nhiều đáp án';
                           case 'single_choice':
                             return 'Chọn một đáp án';
                           case 'true_false':
                             return 'Chọn đáp án đúng/sai';
                           case 'fill_blank':
                             return 'Điền vào chỗ trống';
                           default:
                             return 'Không xác định';
                         }
                       })()}
                      </span>
                    </div>
                    
                    {question.type === 'multiple_choice' && (
                      <p className="text-sm text-left font-medium text-gray-700 mb-2">
                        {/* Số đáp án đúng đã chọn */}
                        Số đáp án đúng đã chọn: {(() => {
                          let correctAnswersCount = 0;
                          if (Array.isArray(studentAnswers[question._id])) {
                            correctAnswersCount = studentAnswers[question._id].filter(ansId => {
                              const ans = question.answers.find(a => a._id === ansId);
                              return ans && ans.isCorrect;
                            }).length;
                          } else if (studentAnswers[question._id]) {
                            const ans = question.answers.find(a => a._id === studentAnswers[question._id]);
                            if (ans && ans.isCorrect) correctAnswersCount = 1;
                          }
                          return correctAnswersCount;
                        })()} / {question.answers.filter(a => a.isCorrect).length}
                      </p>
                    )}

                    {/* Nội dung câu hỏi */}
                    <div className="bg-gray-100 border border-gray-300 rounded-md p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700">Nội dung câu hỏi:</p>
                      <div
                        className="text-gray-700 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: question.content || '<p class="text-gray-400 italic">Không có nội dung</p>',
                        }}
                      />
                    </div>
                    <p className="text-sm text-left font-medium text-gray-700 mb-2">Tất cả đáp án:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {question.answers.map((answer, _idx) => {
                        const isStudentAnswer = studentAnswers[question._id] === answer._id || studentAnswers[question._id] === answer.text || (Array.isArray(studentAnswers[question._id]) && studentAnswers[question._id].includes(answer._id));
                        const isCorrect = answer.isCorrect;
                        return (
                          <li
                            key={answer._id}
                            className={`p-3 rounded-lg border ${isCorrect
                              ? 'bg-green-100 border-green-300 text-green-800 font-bold'
                              : isStudentAnswer
                                ? 'bg-red-100 border-red-300 text-red-800 font-bold'
                                : 'bg-gray-100 border-gray-300 text-gray-800'
                              }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span
                                className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${isCorrect
                                  ? 'bg-green-500 text-white'
                                  : isStudentAnswer
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-300 text-gray-800'
                                  }`}
                              >
                                {_idx + 1}
                              </span>
                              <span>
                                {answer.text} 
                                <span className='text-sm text-yellow-800 font-semibold'>
                                  {isStudentAnswer && " (Câu đã chọn)"}
                                </span>
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default StudentQuizResults;
