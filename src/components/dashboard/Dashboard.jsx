/**
 * Main Dashboard Component
 * Comprehensive dashboard with analytics, charts, and activity feeds
 */

import React, { useState, useEffect } from 'react';
import { 
  FiRefreshCw, 
  FiDownload, 
  FiSettings,
  FiMaximize2,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { analyticsAPI } from '../../services/mockAnalyticsData';

// Dashboard Components
import StatCard, { 
  UserStatsCard, 
  ActiveUsersCard, 
  PostsCard, 
  ViewsCard, 
  RevenueCard 
} from './StatCard';
import ActivityFeed from './ActivityFeed';
import TopPosts from './TopPosts';

// UI Components
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hiddenWidgets, setHiddenWidgets] = useState({});

  // Load dashboard data
  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await analyticsAPI.getDashboardStats();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh dashboard
  useEffect(() => {
    loadDashboardData();
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  // Export dashboard data
  const handleExport = async () => {
    try {
      const exportData = await analyticsAPI.exportDashboardData();
      
      // Create and download CSV
      const csvContent = convertToCSV(exportData);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting dashboard data:', error);
    }
  };

  // Convert data to CSV format
  const convertToCSV = (data) => {
    const headers = Object.keys(data[0] || {});
    const rows = data.map(row => 
      headers.map(header => `"${row[header] || ''}"`).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  };

  // Toggle widget visibility
  const toggleWidget = (widgetId) => {
    setHiddenWidgets(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  // Format last updated time
  const formatLastUpdated = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just updated';
    if (minutes < 60) return `Updated ${minutes}m ago`;
    return `Updated at ${date.toLocaleTimeString()}`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Loading analytics data...
            </p>
          </div>
          <LoadingSpinner size="lg" />
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your blog.
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="outline"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => {
              // Open dashboard settings modal
              console.log('Open dashboard settings');
            }}
          >
            <FiSettings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {!hiddenWidgets.users && (
          <UserStatsCard 
            data={dashboardData}
            onToggle={() => toggleWidget('users')}
          />
        )}
        
        {!hiddenWidgets.active && (
          <ActiveUsersCard 
            data={dashboardData}
            onToggle={() => toggleWidget('active')}
          />
        )}
        
        {!hiddenWidgets.posts && (
          <PostsCard 
            data={dashboardData}
            onToggle={() => toggleWidget('posts')}
          />
        )}
        
        {!hiddenWidgets.views && (
          <ViewsCard 
            data={dashboardData}
            onToggle={() => toggleWidget('views')}
          />
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart Placeholder */}
        {!hiddenWidgets.userGrowth && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Growth
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWidget('userGrowth')}
                >
                  <FiEyeOff className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <FiMaximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-gray-600 dark:text-gray-400">
                  User Growth Chart
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Chart.js integration coming next
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Traffic Analytics Chart Placeholder */}
        {!hiddenWidgets.traffic && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Traffic Analytics
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWidget('traffic')}
                >
                  <FiEyeOff className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <FiMaximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🌐</div>
                <p className="text-gray-600 dark:text-gray-400">
                  Traffic Analytics Chart
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Real-time traffic visualization
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Activity and Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        {!hiddenWidgets.activity && (
          <ActivityFeed 
            limit={8}
            refreshInterval={30000}
          />
        )}

        {/* Top Posts */}
        {!hiddenWidgets.topPosts && (
          <TopPosts 
            limit={5}
            timeRange="7d"
          />
        )}
      </div>

      {/* Hidden Widgets Panel */}
      {Object.values(hiddenWidgets).some(Boolean) && (
        <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hidden Widgets
            </h4>
            <div className="flex items-center space-x-2">
              {Object.entries(hiddenWidgets).map(([key, hidden]) => {
                if (!hidden) return null;
                
                const widgetNames = {
                  users: 'Users',
                  active: 'Active Users',
                  posts: 'Posts',
                  views: 'Views',
                  userGrowth: 'User Growth',
                  traffic: 'Traffic',
                  activity: 'Activity Feed',
                  topPosts: 'Top Posts'
                };
                
                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWidget(key)}
                    className="flex items-center space-x-1"
                  >
                    <FiEye className="w-3 h-3" />
                    <span>{widgetNames[key]}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
