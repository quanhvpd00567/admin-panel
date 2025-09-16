import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { parentAPI } from '../../services/parentAPI';
import Card from '../../components/ui/Card';
import { LoadingSpinner, showToast } from '../../components/ui';
import Pagination from '../../components/ui/Pagination';
import { FaEye, FaSearch, FaTimes } from 'react-icons/fa';

const ChildResults = () => {
  const navigator = useNavigate();
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const paramUrl = new URLSearchParams({ child_id: id });

  const fetchChildResults = async () => {
    try {
      setLoading(true);
      const resultsResponse = await parentAPI.getChildResults(id, {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm, // Add search parameter if needed
      });

      if (resultsResponse.success) {
        setResults(resultsResponse.data);
        // only set child name once
        if (!child) {
          setChild({ fullName: resultsResponse.childName });
        }
        setPagination(prev => ({
          ...prev,
          total: resultsResponse.pagination.total,
          totalPages: resultsResponse.pagination.totalPages,
        }));
      } else {
        showToast.error('Không thể lấy kết quả học tập.');
      }
    } catch {
      showToast.error('Đã xảy ra lỗi khi lấy dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildResults();
    console.log(pagination);

  }, [id, pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  }

  const handleSearch = () => {
    fetchChildResults();
  }

  const handleResetFilters = () => {
    setSearchTerm('');
    fetchChildResults();
  }

  return (
    // content area
    <div className="max-w-full mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
          Kết quả học tập của <span className="text-green-500">{child?.fullName || ''}</span>
        </h1>
      </div>

      {/* Filter Card */}
      <Card className="mb-6 shadow-lg rounded-lg w-full">
        <div className="flex items-center space-x-4 p-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Tìm kiếm bài kiểm tra..."
            className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center"
          >
            <FaSearch className="w-4 h-4 mr-2" />
            Tìm kiếm
          </button>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 shadow-md flex items-center"
          >
            <FaTimes className="w-4 h-4 mr-2" />
            Xóa bộ lọc
          </button>
        </div>
      </Card>

      {/* Results Table */}
      <Card className="shadow-lg rounded-lg w-full">
        <div className="overflow-x-auto">
          {loading ? (
            <LoadingSpinner />
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                Không có kết quả học tập nào.
              </span>
            </div>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Bài kiểm tra
                  </th>
                  <th className="text-center px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-28">
                    Số lần làm
                  </th>
                  <th className="text-center px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-28">
                    Điểm
                  </th>
                  <th className="text-center px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-32">
                    Thời gian làm bài
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-40">
                    Ngày làm bài
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-28">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result, index) => (
                  <tr
                    key={result._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="line-clamp-1 align-middle text-left px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-300">
                      {result.quizz?.title || 'N/A'}
                    </td>
                    <td className="text-center px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {result.number_of_attempts || 0} / {result.quizz?.maxAttempts}
                    </td>
                    <td className="text-center px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {result.last_history?.total_score || 0} / {result.quizz.totalPoints || 0}
                      <p>
                        {result.last_history?.status === 'passed' ? (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Đạt
                          </span>
                        ) : result.last_history?.status === 'failed' ? (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                            Không đạt
                          </span>
                        ) : (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            Chưa hoàn thành
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="text-center px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {Math.floor((result.last_history?.submissionTime || 0) / 60)} phút
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {result.last_history?.createdAt ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {new Date(result.last_history?.createdAt || 0).toLocaleDateString('vi-VN')}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                          Chưa có
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {result.last_history?._id && (
                        <button
                          onClick={() => navigator(`/children/quizzes/${result.last_history?._id}/results?${paramUrl.toString()}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center justify-center"
                        >
                          <FaEye className="w-4 h-4 mr-2" />
                          Xem
                          {/* {`/children/${result.last_history?._id}/results?${paramUrl.toString()}`} */}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          current={pagination.page}
          total={pagination.total}
          pageSize={pagination.limit || 5}
          onPageChange={handlePageChange}
          onPageSizeChange={(newPageSize) => {
            setPagination((prev) => ({
              ...prev,
              limit: newPageSize,
              page: 1,
            }));
          }}
          showSizeChanger={true}
          showQuickJumper={pagination.total > 100}
          disabled={loading}
        />
      </Card>
    </div>
  );
};

export default ChildResults;
