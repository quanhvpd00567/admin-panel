/**
 * SubjectList Page Component
 * Main subject management interface with filtering, search, and bulk operations
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  FaLaptopCode,
  FaCalculator,
  FaFlask,
  FaGlobe,
  FaPaintBrush,
  FaMusic,
  FaRunning,
  FaLanguage,
  FaAtom,
  FaChartBar,
} from 'react-icons/fa';
import { useToast } from '../../../components/ui/Toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Modal from '../../../components/ui/Modal';
import { subjectAPI } from '../../../services/subjectAPI';
import { ROUTES, buildRoute } from '../../../constants/routes';
import { CLASS_OPTIONS, getClassByCode } from '../../../constants/classes';

// Helper function to generate page numbers with ellipsis
const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const showPages = 5; // Number of pages to show around current page
  
  if (totalPages <= showPages + 2) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of middle section
    let start = Math.max(2, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages - 1, currentPage + Math.floor(showPages / 2));
    
    // Adjust if we're near the beginning
    if (currentPage <= Math.floor(showPages / 2) + 1) {
      end = showPages;
    }
    
    // Adjust if we're near the end
    if (currentPage >= totalPages - Math.floor(showPages / 2)) {
      start = totalPages - showPages + 1;
    }
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  
  return pages;
};

const SubjectList = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Helper function to get subject ID
  const getSubjectId = (subject) => subject._id || subject.id;

  // Helper function to get icon component from string
  const getIconComponent = (iconName) => {
    const iconMap = {
      'FaLaptopCode': FaLaptopCode,
      'FaCalculator': FaCalculator,
      'FaFlask': FaFlask,
      'FaGlobe': FaGlobe,
      'FaPaintBrush': FaPaintBrush,
      'FaMusic': FaMusic,
      'FaRunning': FaRunning,
      'FaLanguage': FaLanguage,
      'FaAtom': FaAtom,
      'FaChartBar': FaChartBar,
      'FaBook': FaBook,
      'FaGraduationCap': FaGraduationCap,
    };
    
    return iconMap[iconName] || FaGraduationCap;
  };

  // State management
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  // Filter and search state
  const [filters, setFilters] = useState({
    search: '',
    searchInput: '', // Separate input value for typing
    isActive: '',
    class: '', // Add class filter
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

  // Load subjects data
  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectAPI.getSubjects({
        search: filters.search || undefined,
        isActive: filters.isActive !== '' ? filters.isActive : undefined,
        class: filters.class || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page,
        limit: filters.limit,
      });

      if (response.success) {
        setSubjects(response.data.subjects || response.data.data || []);
        setPagination({
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 20,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 1,
        });
        setError(null);
      } else {
        throw new Error(response.error || 'Failed to load subjects');
      }
    } catch (err) {
      console.error('Load subjects error:', err);
      setError('Failed to load subjects');
      addToast('Failed to load subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load stats data
  const loadStats = async () => {
    try {
      const response = await subjectAPI.getSubjectStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (err) {
      console.error('Load stats error:', err);
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    loadSubjects();
  }, [filters.search, filters.isActive, filters.class, filters.sortBy, filters.sortOrder, filters.page, filters.limit]);

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
      
      // Reset to page 1 when changing limit, search, or other filters (except page)
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
    loadSubjects()
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
      class: '', // Add class filter reset
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      limit: 10,
    });
  };

  // Handle subject selection
  const handleSubjectSelect = (subjectId) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId);
      }
      return [...prev, subjectId];
    });
  };

  // Select all subjects
  const handleSelectAll = () => {
    if (selectedSubjects.length === subjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(subjects.map(s => getSubjectId(s)));
    }
  };

  // Handle delete subject
  const handleDeleteSubject = (subject) => {
    setSubjectToDelete(subject);
    setDeleteModalOpen(true);
  };

  const confirmDeleteSubject = async () => {
    try {
      const response = await subjectAPI.deleteSubject(getSubjectId(subjectToDelete));
      if (response.success) {
        addToast('Subject deleted successfully', 'success');
        loadSubjects();
      } else {
        throw new Error(response.error || 'Failed to delete subject');
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete subject', 'error');
    } finally {
      setDeleteModalOpen(false);
      setSubjectToDelete(null);
    }
  };

  // Handle bulk operations
  const handleBulkStatusUpdate = async (isActive) => {
    try {
      const subjectIds = selectedSubjects;
      const response = await subjectAPI.bulkUpdateSubjects(subjectIds, { isActive });
      
      if (response.success) {
        addToast(`Updated ${selectedSubjects.length} subjects`, 'success');
        setSelectedSubjects([]);
        loadSubjects();
      } else {
        throw new Error(response.error || 'Failed to update subjects');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update subjects', 'error');
    }
  };

  // Export subjects
  const handleExport = () => {
    addToast('Export functionality coming soon', 'info');
  };

  // Get status badge variant
  const getStatusBadge = (isActive) => {
    return isActive ? 'success' : 'secondary';
  };

  // Get status badge color
  const getStatusColor = (isActive) => {
    return isActive 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Subjects',
      value: stats.total || 0,
      icon: FaBook,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Active Subjects',
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
      title: 'Average Rating',
      value: stats.averageRating ? stats.averageRating.toFixed(1) : '0.0',
      icon: FaStar,
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
            Subject Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage educational subjects and their content
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
            onClick={() => navigate(ROUTES.SUBJECTS_CREATE)}
            className="flex items-center"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Add Subject
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
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search subjects..."
                value={filters.searchInput}
                onChange={handleSearchInputChange}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 w-full sm:w-64"
              />
            </div>

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

            {/* Class Filter */}
            <Select
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="">All Classes</option>
              {CLASS_OPTIONS.map((classOption) => (
                <option key={classOption.code} value={classOption.code}>
                  {classOption.name}
                </option>
              ))}
            </Select>

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

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="name">Sort by Name</option>
              <option value="createdAt">Sort by Created Date</option>
              <option value="class">Sort by Class</option>
              <option value="totalCourses">Sort by Courses</option>
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
        {selectedSubjects.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedSubjects.length} subject(s) selected
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
                  onClick={() => setSelectedSubjects([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Subjects Display */}
      {subjects.length === 0 ? (
        <Card className="p-12 text-center">
          <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No subjects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.search || filters.isActive !== ''
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating your first subject.'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.SUBJECTS_CREATE)}
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Create Subject
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <SubjectCard
              key={getSubjectId(subject)}
              subject={subject}
              isSelected={selectedSubjects.includes(getSubjectId(subject))}
              onSelect={() => handleSubjectSelect(getSubjectId(subject))}
              onEdit={() => navigate(buildRoute.subjectsEdit(getSubjectId(subject)))}
              onView={() => navigate(buildRoute.subjectsView(getSubjectId(subject)))}
              onDelete={() => handleDeleteSubject(subject)}
              getStatusBadge={getStatusBadge}
              getStatusColor={getStatusColor}
              getIconComponent={getIconComponent}
            />
          ))}
        </div>
      ) : (
        <SubjectTable
          subjects={subjects}
          selectedSubjects={selectedSubjects}
          onSelectAll={handleSelectAll}
          onSelect={handleSubjectSelect}
          onEdit={(id) => navigate(buildRoute.subjectsEdit(id))}
          onView={(id) => navigate(buildRoute.subjectsView(id))}
          onDelete={handleDeleteSubject}
          getStatusBadge={getStatusBadge}
          getStatusColor={getStatusColor}
          getSubjectId={getSubjectId}
          getIconComponent={getIconComponent}
        />
      )}

      {/* Pagination */}
      {subjects.length > 0 && pagination.totalPages > 1 && (
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
        title="Delete Subject"
        size="md"
      >
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete "{subjectToDelete?.name}"? This action cannot be undone.
            {(subjectToDelete?.totalCourses > 0 || subjectToDelete?.totalStudents > 0) && (
              <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                Warning: This subject has {subjectToDelete.totalCourses || 0} courses and {subjectToDelete.totalStudents || 0} students.
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
              onClick={confirmDeleteSubject}
            >
              Delete Subject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Subject Card Component for Grid View
const SubjectCard = ({
  subject,
  isSelected,
  onSelect,
  onEdit,
  onView,
  onDelete,
  getStatusColor,
  getIconComponent,
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

        {/* Thumbnail */}
        <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden flex items-center justify-center"
             style={{ backgroundColor: subject.color || '#3B82F6' }}>
          {subject.icon ? (
            React.createElement(getIconComponent(subject.icon), {
              className: "h-12 w-12 text-white"
            })
          ) : (
            <FaGraduationCap className="h-12 w-12 text-white" />
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
              {subject.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subject.isActive)}`}>
              {subject.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {subject.description 
              ? (subject.description.length > 100 
                  ? `${subject.description.substring(0, 100)}...` 
                  : subject.description)
              : 'No description available'}
          </p>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Code:</span>
              <span className="text-gray-900 dark:text-white font-mono">
                {subject.code}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Class:</span>
              <span className="text-gray-900 dark:text-white">
                {subject.class ? (
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded text-xs font-medium">
                    {getClassByCode(subject.class)?.name || subject.class}
                  </span>
                ) : (
                  <span className="text-gray-400">No class</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Courses:</span>
              <div className="flex items-center">
                <FaBook className="h-3 w-3 text-blue-400 mr-1" />
                <span className="text-gray-900 dark:text-white">
                  {subject.totalCourses || 0}
                </span>
              </div>
            </div>
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

// Subject Table Component for List View
const SubjectTable = ({
  subjects,
  selectedSubjects,
  onSelectAll,
  onSelect,
  onEdit,
  onView,
  onDelete,
  getStatusBadge,
  getStatusColor,
  getSubjectId,
  getIconComponent,
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
                  checked={selectedSubjects.length === subjects.length}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {subjects.map((subject) => (
              <tr key={getSubjectId(subject)} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(getSubjectId(subject))}
                    onChange={() => onSelect(getSubjectId(subject))}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center" 
                           style={{ backgroundColor: subject.color || '#3B82F6' }}>
                        {subject.icon ? (
                          React.createElement(getIconComponent(subject.icon), {
                            className: "h-5 w-5 text-white"
                          })
                        ) : (
                          <FaGraduationCap className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {subject.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {subject.description 
                          ? (subject.description.length > 50 
                              ? `${subject.description.substring(0, 50)}...` 
                              : subject.description)
                          : 'No description'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-white font-mono">
                    {subject.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subject.isActive)}`}>
                    {subject.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {subject.class ? (
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded text-xs font-medium">
                      {getClassByCode(subject.class)?.name || subject.class}
                    </span>
                  ) : (
                    <span className="text-gray-400">No class</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaBook className="h-3 w-3 text-blue-400 mr-1" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {subject.totalCourses || 0}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(getSubjectId(subject))}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <FaEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(getSubjectId(subject))}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(subject)}
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

export default SubjectList;
