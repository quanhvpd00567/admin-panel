/**
 * Activity Feed Component
 * Displays recent system activities and user actions
 */

import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiFileText, 
  FiMessageCircle, 
  FiLogIn,
  FiEdit,
  FiShield,
  FiRefreshCw,
  FiClock
} from 'react-icons/fi';
import { analyticsAPI } from '../../services/mockAnalyticsData';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const ActivityFeed = ({ limit = 10, refreshInterval = 30000 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load activities
  const loadActivities = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const data = await analyticsAPI.getRecentActivity(limit);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh activities
  useEffect(() => {
    loadActivities();
    
    const interval = setInterval(() => {
      loadActivities(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [limit, refreshInterval]);

  // Get activity icon
  const getActivityIcon = (type) => {
    const icons = {
      user_registered: FiUser,
      post_published: FiFileText,
      comment_added: FiMessageCircle,
      user_login: FiLogIn,
      post_updated: FiEdit,
      user_role_changed: FiShield
    };
    
    const IconComponent = icons[type] || FiUser;
    return IconComponent;
  };

  // Get activity color
  const getActivityColor = (type) => {
    const colors = {
      user_registered: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
      post_published: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
      comment_added: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
      user_login: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400',
      post_updated: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400',
      user_role_changed: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
    };
    
    return colors[type] || colors.user_login;
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <LoadingSpinner size="sm" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
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
          Recent Activity
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadActivities(true)}
          disabled={refreshing}
          className="flex items-center space-x-2"
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className={`flex-shrink-0 p-2 rounded-full ${colorClass}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.message}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 ml-3">
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <FiClock className="w-3 h-3" />
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No recent activity found
            </p>
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // In a real app, this would navigate to a full activity log page
              console.log('Navigate to full activity log');
            }}
          >
            View All Activity
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ActivityFeed;
