/**
 * ClassList Page Component
 * Main class management interface with filtering, search, and bulk operations
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaUsers,
  FaStar,
  FaBook,
  FaChartLine,
  FaGraduationCap,
  FaSchool,
} from 'react-icons/fa';
import { showToast } from '../../../components/ui/Toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Modal from '../../../components/ui/Modal';
import { classAPI } from '../../../services/classAPI';
import { ROUTES, buildRoute } from '../../../constants/routes';

// Helper function to generate page numbers with ellipsis
const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const showPages = 5;
  
  if (totalPages <= showPages + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    let start = Math.max(2, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages - 1, currentPage + Math.floor(showPages / 2));
    
    if (currentPage <= Math.floor(showPages / 2) + 1) {
      end = showPages;
    }
    
    if (currentPage >= totalPages - Math.floor(showPages / 2)) {
      start = totalPages - showPages + 1;
    }
    
    if (start > 2) {
      pages.push('...');
    }
    
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  
  return pages;
};

const ClassList = () => {
  const navigate = useNavigate();

  // Helper function to get class ID
  const getClassId = (classItem) => classItem._id || classItem.id;

  // State management
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  // Filter and search state
  const [filters, setFilters] = useState({
    search: '',
    searchInput: '',
    isActive: '',
    grade: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Load classes data
  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getClasses({
        search: filters.search || undefined,
        isActive: filters.isActive !== '' ? filters.isActive : undefined,
        grade: filters.grade || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page,
        limit: filters.limit,
      });

      if (response.success) {
        setClasses(response.data.classes || response.data.data || []);
        setPagination({
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 20,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 1,
        });
        setError(null);
      } else {
        throw new Error(response.error || 'Failed to load classes');
      }
    } catch (err) {
      console.error('Load classes error:', err);
      setError('Failed to load classes');
      showToast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  // Load stats data
  const loadStats = async () => {
    try {
      const response = await classAPI.getClassStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (err) {
      console.error('Load stats error:', err);
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    loadClasses();
  }, [filters.search, filters.isActive, filters.grade, filters.sortBy, filters.sortOrder, filters.page, filters.limit]);

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  // Sync searchInput with search value for initial load
  useEffect(() => {
    setFilters(prev => ({ ...prev, searchInput: prev.search }));
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      if (key !== 'page') {
        newFilters.page = 1;
      }
      
      return newFilters;
    });
  };

  // Handle search input change (without triggering search)
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, searchInput: value }));
  };

  // Handle search execution (triggered by button click or Enter)
  const handleSearch = () => {
    handleFilterChange('search', filters.searchInput);
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      searchInput: '',
      isActive: '',
      grade: '',
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      limit: 10,
    });
  };

  // Handle class selection
  const handleClassSelect = (classId) => {
    setSelectedClasses(prev => {
      if (prev.includes(classId)) {
        return prev.filter(id => id !== classId);
      }
      return [...prev, classId];
    });
  };

  // Select all classes
  const handleSelectAll = () => {
    if (selectedClasses.length === classes.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(classes.map(c => getClassId(c)));
    }
  };

  // Handle delete class
  const handleDeleteClass = (classItem) => {
    setClassToDelete(classItem);
    setDeleteModalOpen(true);
  };

  const confirmDeleteClass = async () => {
    try {
      const response = await classAPI.deleteClass(getClassId(classToDelete));
      if (response.success) {
        showToast.success('Class deleted successfully');
        loadClasses();
      } else {
        throw new Error(response.error || 'Failed to delete class');
      }
    } catch (err) {
      showToast.error(err.message || 'Failed to delete class');
    } finally {
      setDeleteModalOpen(false);
      setClassToDelete(null);
    }
  };

  // Handle bulk operations
  const handleBulkStatusUpdate = async (isActive) => {
    try {
      const classIds = selectedClasses;
      const response = await classAPI.bulkUpdateClasses(classIds, { isActive });
      
      if (response.success) {
        showToast.success(`Updated ${selectedClasses.length} classes`);
        setSelectedClasses([]);
        loadClasses();
      } else {
        throw new Error(response.error || 'Failed to update classes');
      }
    } catch (err) {
      showToast.error(err.message || 'Failed to update classes');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const classIds = selectedClasses;
      const response = await classAPI.bulkDeleteClasses(classIds);
      
      if (response.success) {
        showToast.success(`Deleted ${selectedClasses.length} classes`);
        setSelectedClasses([]);
        loadClasses();
      } else {
        throw new Error(response.error || 'Failed to delete classes');
      }
    } catch (err) {
      showToast.error(err.message || 'Failed to delete classes');
    }
  };

  // Export classes
  const handleExport = () => {
    showToast.info('Export functionality coming soon');
  };

  // Get status badge color
  const getStatusColor = (isActive) => {
    return isActive 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  // Get grade display
  const getGradeDisplay = (grade) => {
    return `Lớp ${grade}`;
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Classes',
      value: stats.total || 0,
      icon: FaSchool,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Active Classes',
      value: stats.active || 0,
      icon: FaGraduationCap,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: FaUsers,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers || 0,
      icon: FaBook,
      color: 'text-yellow-600 bg-yellow-100',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Class Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage school classes from Grade 1 to Grade 12
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center"
          >
            <FaDownload className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/education/classes/create')}
            className="flex items-center"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters and Controls */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search classes..."
                  value={filters.searchInput}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearch}
                className="flex items-center px-4"
                title="Search"
              >
                <FaSearch className="h-4 w-4" />
              </Button>
            </div>

            {/* Grade Filter */}
            <Select
              value={filters.grade}
              onChange={(e) => handleFilterChange('grade', e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="">All Grades</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Lớp {i + 1}
                </option>
              ))}
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="name">Sort by Name</option>
              <option value="grade">Sort by Grade</option>
              <option value="createdAt">Sort by Created Date</option>
              <option value="totalStudents">Sort by Students</option>
            </Select>

            {/* Page Size */}
            <Select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full sm:w-auto"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm rounded-l-lg ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm rounded-r-lg border-l border-gray-300 dark:border-gray-600 ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                List
              </button>
            </div>

            {/* Reset Filters */}
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedClasses.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedClasses.length} class(es) selected
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate(true)}
                >
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate(false)}
                >
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedClasses([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Classes Display */}
      {classes.length === 0 ? (
        <Card className="p-12 text-center">
          <FaSchool className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No classes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.search || filters.isActive !== '' || filters.grade
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating your first class.'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/education/classes/create')}
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Create Class
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((classItem) => (
            <ClassCard
              key={getClassId(classItem)}
              classItem={classItem}
              isSelected={selectedClasses.includes(getClassId(classItem))}
              onSelect={() => handleClassSelect(getClassId(classItem))}
              onEdit={() => navigate(`/education/classes/edit/${getClassId(classItem)}`)}
              onView={() => navigate(`/education/classes/view/${getClassId(classItem)}`)}
              onDelete={() => handleDeleteClass(classItem)}
              getStatusColor={getStatusColor}
              getGradeDisplay={getGradeDisplay}
            />
          ))}
        </div>
      ) : (
        <ClassTable
          classes={classes}
          selectedClasses={selectedClasses}
          onSelectAll={handleSelectAll}
          onSelect={handleClassSelect}
          onEdit={(id) => navigate(`/education/classes/edit/${id}`)}
          onView={(id) => navigate(`/education/classes/view/${id}`)}
          onDelete={handleDeleteClass}
          getStatusColor={getStatusColor}
          getClassId={getClassId}
          getGradeDisplay={getGradeDisplay}
        />
      )}

      {/* Pagination */}
      {classes.length > 0 && pagination.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="flex items-center"
              >
                <span className="mr-1">←</span>
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers(pagination.page, pagination.totalPages).map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-1 text-gray-500 dark:text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('page', pageNum)}
                      className="min-w-[2.5rem]"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="flex items-center"
              >
                Next
                <span className="ml-1">→</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Class"
        size="md"
      >
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete "{classToDelete?.name}"? This action cannot be undone.
            {(classToDelete?.totalStudents > 0) && (
              <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                Warning: This class has {classToDelete.totalStudents || 0} students.
              </span>
            )}
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteClass}
            >
              Delete Class
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Class Card Component for Grid View
const ClassCard = ({
  classItem,
  isSelected,
  onSelect,
  onEdit,
  onView,
  onDelete,
  getStatusColor,
  getGradeDisplay,
}) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {/* Selection Checkbox */}
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center">
            <FaSchool className="h-12 w-12" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
              {classItem.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(classItem.isActive)}`}>
              {classItem.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {getGradeDisplay(classItem.grade)}
          </p>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Students:</span>
              <span className="text-gray-900 dark:text-white">
                {classItem.totalStudents || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Capacity:</span>
              <span className="text-gray-900 dark:text-white">
                {classItem.capacity || 'N/A'}
              </span>
            </div>
            {classItem.teacher && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Teacher:</span>
                <span className="text-gray-900 dark:text-white">
                  {classItem.teacher.name || 'Unassigned'}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onView}
              className="flex-1"
            >
              <FaEye className="mr-1 h-3 w-3" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1"
            >
              <FaEdit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <FaTrash className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Class Table Component for List View
const ClassTable = ({
  classes,
  selectedClasses,
  onSelectAll,
  onSelect,
  onEdit,
  onView,
  onDelete,
  getStatusColor,
  getClassId,
  getGradeDisplay,
}) => {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedClasses.length === classes.length}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {classes.map((classItem) => (
              <tr key={getClassId(classItem)} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(getClassId(classItem))}
                    onChange={() => onSelect(getClassId(classItem))}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                        <FaSchool className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {classItem.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {classItem.description || 'No description'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {getGradeDisplay(classItem.grade)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(classItem.isActive)}`}>
                    {classItem.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classItem.totalStudents || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classItem.capacity || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classItem.teacher?.name || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(getClassId(classItem))}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <FaEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(getClassId(classItem))}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(classItem)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ClassList;
