import React, { useEffect, useState, useRef } from 'react';
import { parentAPI } from '../../services/parentAPI';
import Card from '../../components/ui/Card';
import { FaEye } from 'react-icons/fa';
import { LoadingSpinner, showToast } from '../../components/ui';
import ChildInfoModal from './components/ChildInfoModal'; // Import ChildInfoModal
import { useNavigate } from 'react-router-dom';

const ChildList = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate();
  const [selectedChild, setSelectedChild] = useState(null); // State for selected child
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isAddingChild, setIsAddingChild] = useState(false); // State for adding new child
  const [isFetching, setIsFetching] = useState(false);

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

    fetchChildren();
  }, [isFetching]);

  const handleViewChild = (child) => {
    setSelectedChild(child); // Set selected child
    setIsAddingChild(false); // Ensure modal is not in "add" mode
    setIsModalOpen(true); // Open modal
  };

  const handleAddChild = () => {
    setSelectedChild(null); // Clear selected child
    setIsAddingChild(true); // Set modal to "add" mode
    setIsModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setSelectedChild(null); // Clear selected child
    setIsAddingChild(false); // Reset "add" mode
    setIsModalOpen(false); // Close modal
    // get lại list children
    setIsFetching((prev) => !prev);
  };

  const handleSaveChild = (childData) => {
    if (isAddingChild) {
      // Add new child
      setChildren((prev) => [...prev, { ...childData, _id: Date.now().toString() }]); // Mock ID for new child
      showToast.success('Đã thêm con thành công!');
    } else {
      // Update existing child
      setChildren((prev) =>
        prev.map((child) => (child._id === selectedChild._id ? { ...child, ...childData } : child))
      );
      showToast.success('Đã cập nhật thông tin con!');
    }
    closeModal();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Danh sách các con</h1>
        <button
          onClick={handleAddChild}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-300 shadow-md flex items-center"
        >
          <FaEye className="inline w-4 h-4 mr-2" />
          Thêm con
        </button>
      </div>
      <Card className="shadow-lg rounded-lg">
        <div className="overflow-x-auto">
          {children.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                Không có con nào được liên kết.
              </span>
            </div>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Tên đăng nhập
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="text-left divide-y divide-gray-200 dark:divide-gray-700">
                {children.map((child, index) => (
                  <tr
                    key={child._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-300">
                      {child.fullName || `${child.firstName} ${child.lastName}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {child.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {child.email}
                    </td>
                    <td className="flex items-center justify-center px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewChild(child)} // Open modal with child info
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center justify-center"
                      >
                        <FaEye className="inline w-4 h-4 mr-2" />
                        Xem
                      </button>
                      {/* add button view result  */}
                      <button
                        onClick={() => navigator(`/children/${child._id}/results`)} // Navigate to results page
                        className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 shadow-md flex items-center justify-center"
                      >
                        <FaEye className="inline w-4 h-4 mr-2" />
                        Kết quả
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Use ChildInfoModal */}
      <ChildInfoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isAddNew={isAddingChild}
        child={isAddingChild ? null : selectedChild}
      />
    </div>
  );
};

export default ChildList;
