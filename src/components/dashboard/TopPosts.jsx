/**
 * Top Posts Widget Component
 * Displays top performing posts with metrics and quick actions
 */

import React, { useState, useEffect } from 'react';
import { 
  FiEye, 
  FiHeart, 
  FiMessageCircle, 
  FiTrendingUp,
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiMoreVertical,
  FiBarChart
} from 'react-icons/fi';
import { analyticsAPI } from '../../services/mockAnalyticsData';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const TopPosts = ({ limit = 5, timeRange = '7d' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [showActions, setShowActions] = useState({});

  // Load top posts
  const loadTopPosts = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getTopPosts(limit, selectedTimeRange);
      setPosts(data);
    } catch (error) {
      console.error('Error loading top posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopPosts();
  }, [limit, selectedTimeRange]);

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Get trend icon and color
  const getTrendInfo = (trend) => {
    if (trend > 0) {
      return {
        icon: FiTrendingUp,
        color: 'text-green-600 dark:text-green-400',
        text: `+${trend}%`
      };
    }
    return {
      icon: FiBarChart,
      color: 'text-gray-600 dark:text-gray-400',
      text: `${trend}%`
    };
  };

  // Toggle action menu
  const toggleActions = (postId) => {
    setShowActions(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Handle actions
  const handleAction = (action, post) => {
    console.log(`${action} post:`, post);
    setShowActions({});
    
    switch (action) {
      case 'edit':
        // Navigate to edit page
        break;
      case 'view':
        // Open post in new tab
        break;
      case 'delete':
        // Show delete confirmation
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Posts
          </h3>
          <LoadingSpinner size="sm" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Top Posts
        </h3>
        
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="1d">Today</option>
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="90d">90 Days</option>
        </select>
      </div>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post, index) => {
            const trendInfo = getTrendInfo(post.trend);
            const TrendIcon = trendInfo.icon;
            
            return (
              <div
                key={post.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </span>
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {post.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <FiEye className="w-4 h-4" />
                        <span>{formatNumber(post.views)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiHeart className="w-4 h-4" />
                        <span>{formatNumber(post.likes)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiMessageCircle className="w-4 h-4" />
                        <span>{formatNumber(post.comments)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center space-x-1 text-sm ${trendInfo.color}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span>{trendInfo.text}</span>
                        <span className="text-gray-500 dark:text-gray-400">vs last period</span>
                      </div>
                      
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActions(post.id)}
                      className="p-2"
                    >
                      <FiMoreVertical className="w-4 h-4" />
                    </Button>
                    
                    {showActions[post.id] && (
                      <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleAction('view', post)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FiExternalLink className="w-4 h-4" />
                            <span>View Post</span>
                          </button>
                          <button
                            onClick={() => handleAction('edit', post)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FiEdit className="w-4 h-4" />
                            <span>Edit Post</span>
                          </button>
                          <button
                            onClick={() => handleAction('delete', post)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            <span>Delete Post</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <FiBarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No posts found for the selected period
            </p>
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Navigate to posts analytics page
              console.log('Navigate to posts analytics');
            }}
          >
            View All Posts Analytics
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TopPosts;
