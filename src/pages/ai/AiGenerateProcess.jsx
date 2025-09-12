import React, { useEffect, useState, useRef } from 'react';
import { aiAPI } from '../../services/quizzes';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';

const STATUS_OPTIONS = [
    { label: 'All Status', value: '' },
    { label: 'Chưa bắt đầu', value: 'not-started' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đang xử lý', value: 'in_progress' },
    { label: 'Lỗi', value: 'failed' },
];
const MODEL_OPTIONS = [
    { label: 'All Model', value: '' },
    { label: 'Gemini', value: 'gemini' },
    { label: 'OpenAI', value: 'openai' },
];

const AiGenerateProcess = () => {
    const [processList, setProcessList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('not-started');
    const [filter, setFilter] = useState({ search: '', subject: '', status: '', model: '' });
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });


    const fetchProcess = async () => {
        setLoading(true);
        const result = await aiAPI.listAIGeneratedQuizzes({
            limit: pagination.limit,
            status: filterStatus,
            modelName: filter.model,
            page: pagination.page,
        });
        console.log(filter);
        
        setProcessList(result?.data || []);
        setPagination(result?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
        setLoading(false);
    };
    useEffect(() => {
        fetchProcess();
    }, [filterStatus, filter.model]);

    useEffect(() => {
        console.log('Pagination changed:', pagination);
        fetchProcess();
    }, [pagination.page, pagination.limit]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }
    const handleReset = () => {
        setFilterStatus('not-started');
        setFilter({ search: '', subject: '', status: '', model: '' });
        setPagination({ total: 0, page: 1, limit: 10, totalPages: 1 });
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8 text-left">
                AI Generate Process
            </h1>
            {/* Card: Filter bar */}
            <Card className="mb-4 p-4 bg-gray-900">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap gap-2 flex-1">
                        <input
                            type="text"
                            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 w-1/2"
                            placeholder="Search quiz..."
                            value={filter.search}
                            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 flex-1">
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-auto"
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                        <Select
                            value={filter.model}
                            onChange={(e) => setFilter(f => ({ ...f, model: e.target.value }))}
                            className="w-full sm:w-auto"
                        >
                            {MODEL_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <Button
                            variant="primary"
                            className="px-3 py-2 text-xs border border-blue-500 bg-blue-500 text-white hover:bg-blue-700 rounded"
                            onClick={() => { }}
                        >
                            Search
                        </Button>
                        <Button
                            variant="outline"
                            className="px-3 py-2 text-xs border border-blue-500 text-blue-500 hover:bg-blue-900 hover:text-white rounded"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </div>
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
                                                    <div className="font-semibold">{process.id}</div>
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
                                                <Button variant="ghost" className="p-2 text-blue-400 hover:text-blue-600"><FaEye /></Button>
                                                <Button variant="ghost" className="p-2 text-gray-400 hover:text-gray-600"><FaEdit /></Button>
                                                <Button variant="ghost" className="p-2 text-red-400 hover:text-red-600"><FaTrash /></Button>
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
