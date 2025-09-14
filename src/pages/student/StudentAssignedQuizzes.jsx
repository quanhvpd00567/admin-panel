import React, { useEffect, useState, useRef } from 'react';
import { studentQuizAPI } from '../../services/quizzes/index';
import { format } from 'date-fns';
import Card from '../../components/ui/Card';
import { FaEye, FaSpinner, FaHourglassStart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner, showToast } from '../../components/ui';

const StudentAssignedQuizzes = () => {
  const [studentQuizzes, setStudentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const calledRef = useRef(false);

  useEffect(() => {
    const fetchAssignedQuizzes = async () => {
      try {
        if (calledRef.current) return;
        calledRef.current = true;
        setLoading(true);
        const response = await studentQuizAPI.getStudentQuizzes('68a04f99b40ee20a436cf0d9');
        console.log(response.data);

        if (response.success) {
          setStudentQuizzes(response.data);
        } else {
          showToast.error('Không thể lấy danh sách bài kiểm tra được giao.');
        }
      } catch {
        showToast.error('Đã xảy ra lỗi khi lấy danh sách bài kiểm tra.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedQuizzes();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
        Danh sách bài kiểm tra được giao
      </h1>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                <FaSpinner className="inline w-6 h-6 mr-2 animate-spin" />
                Đang tải...
              </span>
            </div>
          ) : studentQuizzes.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                Không có bài kiểm tra nào được giao.
              </span>
            </div>
          ) : (
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tên bài kiểm tra
                </th>
                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Số lần làm bài
                </th>
                 <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Điểm số
                </th>
                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày nộp bài
                </th>
                <th className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hoạt động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {studentQuizzes.map((studentQuiz) => (
                <tr key={studentQuiz._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="text-left px-6 py-4 whitespace-nowrap">
                    {studentQuiz.quizz.title}
                  </td>
                  <td className="text-center px-6 py-4 whitespace-nowrap">
                    {studentQuiz.number_of_attempts || 0} / {studentQuiz.quizz.maxAttempts === 0 ? '∞' : studentQuiz.quizz.maxAttempts}
                  </td>
                  <td className="text-left px-6 py-4 whitespace-nowrap">
                    <span className='font-mono font-semibold text-lg'>
                      {!studentQuiz.last_history ? (
                        <span className='text-yellow-500'>Chưa làm</span>
                      ) : (
                        <>
                          {studentQuiz.last_history.status === 'passed' ? (
                            <span className='text-green-500'>Đạt</span>
                          ) : (
                            <span className='text-red-500'>Không đạt</span>
                          )}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="text-center px-6 py-4 whitespace-nowrap">
                    {studentQuiz.last_history ? studentQuiz.last_history.total_score : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {studentQuiz.last_history?.createdAt
                      ? format(new Date(studentQuiz.last_history.createdAt), 'dd/MM/yyyy HH:mm')
                      : 'Chưa nộp'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {studentQuiz.status === 'not_started' || (studentQuiz.status === 'completed' &&
                      studentQuiz.number_of_attempts < studentQuiz.quizz.maxAttempts) ? (
                      <button
                        onClick={() => navigate(`/student/quizzes/${studentQuiz._id}`)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-all duration-300 shadow-md flex items-center justify-center"
                      >
                        {/* Thay đổi icon */}
                        <FaHourglassStart className="inline w-4 h-4 mr-2" />
                        Làm bài
                      </button>
                    ) : studentQuiz.status === 'in_progress' ? (
                      <button
                        onClick={() => navigate(`/student/quizzes/${studentQuiz._id}`)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all duration-300 shadow-md flex items-center justify-center"
                      >
                        <FaEye className="inline w-4 h-4 mr-2" />
                        Tiếp tục
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/student/quizzes/${studentQuiz.last_history._id}/results`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center justify-center"
                      >
                          <FaEye className="inline w-4 h-4 mr-2" />
                      Xem lịch sử
                    </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentAssignedQuizzes;
