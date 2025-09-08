import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaCalendar } from 'react-icons/fa';
import { FiX, FiRefreshCw } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker.css';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const PostList = () => {
  const navigate = useNavigate();
  
  // Sample posts data - có thêm category
  const [allPosts] = useState([
    {
      id: 1,
      title: 'Getting Started with React',
      content: 'Learn the basics of React development...',
      status: 'published',
      category: 'programming',
      author: 'John Doe',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      content: 'Deep dive into JavaScript concepts...',
      status: 'draft',
      category: 'programming',
      author: 'Jane Smith',
      createdAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
    },
    {
      id: 3,
      title: 'Web Design Best Practices',
      content: 'Modern web design principles...',
      status: 'published',
      category: 'design',
      author: 'Bob Wilson',
      createdAt: '2024-01-13T09:00:00Z',
      updatedAt: '2024-01-13T09:00:00Z',
    },
    {
      id: 4,
      title: 'SEO Optimization Guide',
      content: 'Complete guide to SEO...',
      status: 'published',
      category: 'marketing',
      author: 'Alice Brown',
      createdAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-12T14:00:00Z',
    },
    {
      id: 5,
      title: 'Database Performance Tuning',
      content: 'Optimize your database queries...',
      status: 'draft',
      category: 'programming',
      author: 'Charlie Davis',
      createdAt: '2024-01-11T11:00:00Z',
      updatedAt: '2024-01-11T11:00:00Z',
    }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    title: '',
    status: '',
    category: '',
    createdFrom: null,
    createdTo: null
  });
  
  const [filteredPosts, setFilteredPosts] = useState(allPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load posts (simulate API call)
  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from API
      // const response = await api.getPosts();
      // setAllPosts(response.data);
      
      console.log('Posts refreshed successfully');
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = allPosts;

    // Filter by title (case insensitive)
    if (filters.title) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status) {
      result = result.filter(post => post.status === filters.status);
    }

    // Filter by category
    if (filters.category) {
      result = result.filter(post => post.category === filters.category);
    }

    // Filter by date range
    if (filters.createdFrom) {
      result = result.filter(post => 
        new Date(post.createdAt) >= filters.createdFrom
      );
    }

    if (filters.createdTo) {
      const endDate = new Date(filters.createdTo);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      result = result.filter(post => 
        new Date(post.createdAt) <= endDate
      );
    }

    setFilteredPosts(result);
  }, [filters, allPosts]);

  // Update filter
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      title: '',
      status: '',
      category: '',
      createdFrom: null,
      createdTo: null
    });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== undefined
  );

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Blog Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredPosts.length} of {allPosts.length} posts
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadPosts}
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button onClick={() => navigate('/posts/create')}>
            <FaPlus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaEdit className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Posts
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {allPosts.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaEye className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Published
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {allPosts.filter(post => post.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaEdit className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Drafts
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {allPosts.filter(post => post.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaCalendar className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                This Week
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {allPosts.filter(post => {
                  const postDate = new Date(post.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  weekAgo.setHours(0, 0, 0, 0); // Start of day
                  return postDate >= weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search posts by title..."
              value={filters.title}
              onChange={(e) => updateFilter('title', e.target.value)}
              className="w-full"
              leftIcon={<FaSearch />}
            />
          </div>
          
          <Select
            value={filters.status}
            onChange={(value) => updateFilter('status', value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' }
            ]}
          />

          <Select
            value={filters.category}
            onChange={(value) => updateFilter('category', value)}
            options={[
              { value: '', label: 'All Categories' },
              { value: 'programming', label: 'Programming' },
              { value: 'design', label: 'Design' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'business', label: 'Business' }
            ]}
          />

          <div className="relative">
            <div className="relative">
              <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <DatePicker
                selected={filters.createdFrom}
                onChange={(date) => updateFilter('createdFrom', date)}
                placeholderText="From date"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                dateFormat="MMM dd, yyyy"
                maxDate={filters.createdTo || new Date()}
                isClearable
              />
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <DatePicker
                selected={filters.createdTo}
                onChange={(date) => updateFilter('createdTo', date)}
                placeholderText="To date"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                dateFormat="MMM dd, yyyy"
                minDate={filters.createdFrom}
                maxDate={new Date()}
                isClearable
              />
            </div>
          </div>
        </div>
        
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {filters.title && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  Title: "{filters.title}"
                  <button
                    onClick={() => updateFilter('title', '')}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                  Status: {filters.status}
                  <button
                    onClick={() => updateFilter('status', '')}
                    className="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
                  Category: {filters.category}
                  <button
                    onClick={() => updateFilter('category', '')}
                    className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.createdFrom && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300">
                  From: {filters.createdFrom.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  <button
                    onClick={() => updateFilter('createdFrom', null)}
                    className="ml-2 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.createdTo && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                  To: {filters.createdTo.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  <button
                    onClick={() => updateFilter('createdTo', null)}
                    className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Posts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FiX className="w-16 h-16 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Error Loading Posts
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={loadPosts}>Try Again</Button>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FaSearch className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by creating your first post.'
                }
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Clear all filters
                </button>
              ) : (
                <button
                  onClick={() => navigate('/posts/create')}
                  className="btn btn-primary"
                >
                  Create your first post
                </button>
              )}
            </div>
          </div>
        ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPosts.map(post => (
              <tr
                key={post.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {post.author}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(post.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/posts/${post.id}`)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="View Post"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/posts/edit/${post.id}`)}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Edit Post"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to delete this post?'
                          )
                        ) {
                          console.log('Delete post:', post.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete Post"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default PostList;
