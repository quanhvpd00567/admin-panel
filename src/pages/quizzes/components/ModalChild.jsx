import React, { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { parentAPI } from '../../../services/parentAPI';
import { LoadingSpinner, showToast } from '../../../components/ui';
import { FaUserCircle } from 'react-icons/fa';
import { quizAPI } from '../../../services/quizzes/index';
import { FaEye, FaSpinner } from 'react-icons/fa';

const ModalChild = ({ id, isOpen, onClose, onSelectChild }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const response = await parentAPI.getChildren();
        if (response.success) {
          setChildren(response.data);
        } else {
          showToast.error('Không thể lấy danh sách các con.');
        }
      } catch {
        showToast.error('Đã xảy ra lỗi khi lấy danh sách các con.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchChildren();
    }
  }, [isOpen]);

  const handleSelect = async () => {
    setLoadingAssign(true);
    const response = await quizAPI.assignQuiz(id, selectedChildId);
    if (response.success) {
      showToast.success(response.message);
    } else {
      showToast.error(response.error);
    }
    setLoadingAssign(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Chọn con để giao bài tập
        </h2>
        {loading ? (
          <LoadingSpinner />
        ) : children.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Không có con nào được liên kết.
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {children.map((child) => (
              <label
                key={child._id}
                className="flex items-center space-x-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer"
              >
                <input
                  type="radio"
                  name="selectedChild"
                  value={child._id}
                  checked={selectedChildId === child._id}
                  onChange={() => setSelectedChildId(child._id)}
                  className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <FaUserCircle className="w-10 h-10 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                    {child.firstName} {child.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {child.email}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all duration-300"
          >
            Hủy
          </button>
          <button
            disabled={!selectedChildId || loadingAssign}
            onClick={handleSelect}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 rounded-lg shadow-lg transition-all duration-300 flex items-center"
          >
            {loadingAssign ? (
              <><FaSpinner className="w-5 h-5 mr-2" />Đang giao bài tập</>
            ) : (
              <><FaEye className="w-5 h-5 mr-2" /> Giao bài tập </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalChild;
