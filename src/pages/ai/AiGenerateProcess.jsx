import React, { useEffect, useState, useRef } from 'react';
import { aiAPI } from '../../services/quizzes';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaSearch, FaTimes, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/ui';

const STATUS_OPTIONS = [
    { label: 'Tất cả', value: '' },
    { label: 'Chưa bắt đầu', value: 'not_started' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đang xử lý', value: 'in_progress' },
    { label: 'Lỗi', value: 'failed' },
];
const MODEL_OPTIONS = [
    { label: 'Tất cả', value: '' },
    { label: 'Gemini', value: 'gemini' },
    { label: 'OpenAI', value: 'openai' },
];

const AiGenerateProcess = () => {
    const navigate = useNavigate();
    const [processList, setProcessList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReset, setIsReset] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [filter, setFilter] = useState({ search: '', subject: '', status: '', model: '' });
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });


    const fetchProcess = async () => {
        setLoading(true);
        const result = await aiAPI.listAIGeneratedQuizzes({
            limit: pagination.limit,
            status: filterStatus,
            modelName: filter.model,
            search: filter.search,
            // subject: filter.subject,
            page: pagination.page,
        });
        setProcessList(result?.data || []);
        setPagination(result?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
        setLoading(false);
    };

    useEffect(() => {
        fetchProcess();
    }, [filterStatus, filter.model, pagination.page, pagination.limit, isReset]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }
    const handleReset = () => {
        setFilterStatus('');
        setFilter({ search: '', subject: '', status: '', model: '' });
        setPagination({ total: 0, page: 1, limit: 10, totalPages: 1 });
        setIsReset(!isReset); // Toggle to trigger useEffect
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8 text-left">
                AI Generate Process
            </h1>
            {/* Card: Filter bar */}
            <Card className="mb-4 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Input Search */}
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                            Tìm kiếm
                        </label>
                        <input
                            type="text"
                            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Nhập tên bài kiểm tra..."
                            value={filter.search}
                            onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
                        />
                    </div>

                    {/* Select Status */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                            Trạng thái
                        </label>
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Select Model */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                            Mô hình
                        </label>
                        <Select
                            value={filter.model}
                            onChange={(e) => setFilter((f) => ({ ...f, model: e.target.value }))}
                            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            {MODEL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center mt-6 space-x-4">
                    <Button
                        variant="primary"
                        className="flex items-center px-6 py-2"
                        onClick={() => fetchProcess()}
                    >
                        <FaSearch className="w-4 h-4 mr-2" />
                        Tìm kiếm
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center px-6 py-2 text-red-500 border-red-500 hover:bg-red-100"

                        onClick={handleReset}
                    >
                        <FaTimes className="w-4 h-4 mr-2" />
                        Đặt lại
                    </Button>
                </div>
            </Card>

            {/* Card: Table data */}
            <Card className="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-800 rounded bg-gray-900 text-white">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="px-3 py-2 text-left">SUBJECT</th>
                                <th className="px-3 py-2 text-left w-60 text-center">MODEL</th>
                                <th className="px-3 py-2 text-left w-24">STATUS</th>
                                <th className="px-3 py-2 text-right w-32">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-6">Đang tải...</td></tr>
                            ) : processList.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-6">Không có tiến trình nào.</td></tr>
                            ) : (
                                processList.map((process) => (
                                    <tr key={process.id || process._id} className="border-t border-gray-800 hover:bg-gray-800 transition">
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <div className="font-semibold">{process.title}</div>
                                                    {/* <div className="text-xs text-gray-400">{process.subject}</div> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 w-60">{process.provider} ({process.modelName})</td>
                                        <td className="px-3 py-2 w-24">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${process.status === 'completed'
                                                ? 'bg-green-900 text-green-300'
                                                : process.status === 'in_progress'
                                                    ? 'bg-yellow-900 text-yellow-300'
                                                    : process.status === 'failed'
                                                        ? 'bg-red-900 text-red-300'
                                                        : 'bg-gray-900 text-gray-300'
                                                }`}>
                                                {process.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right w-32">
                                            <div className="flex gap-2 justify-end">
                                                {/* nếu status == completed redirect */}
                                                {process.status === 'completed' && (
                                                    <Button onClick={() => navigate('/quizzes/' + process.quiz)} variant="ghost" className="p-2 text-blue-400 hover:text-blue-600"><FaEye /></Button>
                                                )}
                                                {/* <Button variant="ghost" className="p-2 text-gray-400 hover:text-gray-600"><FaEdit /></Button> */}
                                                {/* <Button variant="ghost" className="p-2 text-red-400 hover:text-red-600"><FaTrash /></Button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Paging */}
                <Pagination
                    current={pagination.page}
                    total={pagination.total}
                    pageSize={pagination.limit}
                    onPageChange={handlePageChange}
                    onPageSizeChange={(newPageSize) => {
                        setPagination(prev => ({
                            ...prev,
                            limit: newPageSize,
                            page: 1
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

export default AiGenerateProcess;
