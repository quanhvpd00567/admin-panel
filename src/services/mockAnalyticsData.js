/**
 * Mock Analytics Data Service
 * Simulates dashboard analytics and statistics for development
 */

import { userAPI } from './mockUserData';

// Generate mock analytics data
const generateMockAnalytics = () => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  
  // Generate user growth data for the last 6 months
  const userGrowthData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const baseUsers = 50 + (6 - i) * 15; // Growing user base
    const variation = Math.floor(Math.random() * 10) - 5; // Random variation
    
    userGrowthData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      users: Math.max(0, baseUsers + variation),
      newUsers: Math.floor(Math.random() * 20) + 5,
      activeUsers: Math.floor((baseUsers + variation) * 0.7)
    });
  }

  // Generate daily traffic data for the last 30 days
  const trafficData = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const baseViews = 1000 + Math.floor(Math.random() * 500);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const views = weekend ? Math.floor(baseViews * 0.7) : baseViews;
    
    trafficData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: views,
      visitors: Math.floor(views * 0.6),
      bounceRate: (20 + Math.random() * 15).toFixed(1)
    });
  }

  // Generate post analytics data
  const postCategories = ['Technology', 'Design', 'Business', 'Marketing', 'Development'];
  const postAnalytics = postCategories.map(category => ({
    category,
    published: Math.floor(Math.random() * 25) + 10,
    draft: Math.floor(Math.random() * 8) + 2,
    views: Math.floor(Math.random() * 5000) + 1000,
    engagement: (Math.random() * 15 + 5).toFixed(1)
  }));

  // Generate recent activity
  const activityTypes = [
    'user_registered', 'post_published', 'comment_added', 
    'user_login', 'post_updated', 'user_role_changed'
  ];
  
  const recentActivity = [];
  for (let i = 0; i < 20; i++) {
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const timeAgo = Math.floor(Math.random() * 60); // minutes ago
    
    recentActivity.push({
      id: `activity-${i + 1}`,
      type: activityType,
      message: getActivityMessage(activityType),
      user: `User ${Math.floor(Math.random() * 50) + 1}`,
      timestamp: new Date(now.getTime() - timeAgo * 60 * 1000),
      timeAgo: `${timeAgo}m ago`
    });
  }

  // Generate top posts
  const topPosts = [];
  for (let i = 0; i < 10; i++) {
    topPosts.push({
      id: `post-${i + 1}`,
      title: `Amazing Post Title ${i + 1}`,
      author: `Author ${Math.floor(Math.random() * 10) + 1}`,
      views: Math.floor(Math.random() * 10000) + 1000,
      comments: Math.floor(Math.random() * 50) + 5,
      likes: Math.floor(Math.random() * 200) + 20,
      publishedAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      category: postCategories[Math.floor(Math.random() * postCategories.length)]
    });
  }

  return {
    userGrowthData,
    trafficData,
    postAnalytics,
    recentActivity,
    topPosts
  };
};

// Helper function to generate activity messages
const getActivityMessage = (type) => {
  const messages = {
    user_registered: 'New user registered',
    post_published: 'Published a new post',
    comment_added: 'Added a comment',
    user_login: 'Logged into the system',
    post_updated: 'Updated a post',
    user_role_changed: 'Role was changed'
  };
  return messages[type] || 'Unknown activity';
};

// Generate initial mock data
const mockAnalytics = generateMockAnalytics();

// Mock Analytics API
export const analyticsAPI = {
  // Get dashboard overview statistics
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get real user stats from userAPI
    const userStats = await userAPI.getUserStats();
    
    // Calculate mock statistics
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth - 1;
    
    return {
      totalUsers: {
        value: userStats.total,
        change: 12.5,
        trend: 'up'
      },
      activeUsers: {
        value: userStats.active,
        change: 8.3,
        trend: 'up'
      },
      totalPosts: {
        value: 156,
        change: 15.2,
        trend: 'up'
      },
      monthlyViews: {
        value: 45678,
        change: -2.1,
        trend: 'down'
      },
      revenue: {
        value: 12450,
        change: 23.1,
        trend: 'up'
      },
      engagement: {
        value: 78.5,
        change: 5.4,
        trend: 'up'
      }
    };
  },

  // Get user growth data
  getUserGrowth: async (period = '6months') => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (period === '6months') {
      return mockAnalytics.userGrowthData;
    }
    
    // Return different data for different periods
    return mockAnalytics.userGrowthData.slice(-3); // Last 3 months for demo
  },

  // Get post analytics
  getPostAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAnalytics.postAnalytics;
  },

  // Get traffic data
  getTrafficData: async (period = '30days') => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    if (period === '30days') {
      return mockAnalytics.trafficData;
    }
    
    // Return different data for different periods
    return mockAnalytics.trafficData.slice(-7); // Last 7 days for demo
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAnalytics.recentActivity.slice(0, limit);
  },

  // Get top performing posts
  getTopPosts: async (limit = 5) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockAnalytics.topPosts
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },

  // Get engagement metrics
  getEngagementMetrics: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      likes: Math.floor(Math.random() * 1000) + 500,
      shares: Math.floor(Math.random() * 200) + 100,
      comments: Math.floor(Math.random() * 300) + 150,
      saves: Math.floor(Math.random() * 150) + 75
    };
  },

  // Get system health metrics
  getSystemHealth: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      serverUptime: '99.9%',
      responseTime: Math.floor(Math.random() * 100) + 50, // ms
      cpuUsage: Math.floor(Math.random() * 30) + 20, // %
      memoryUsage: Math.floor(Math.random() * 40) + 30, // %
      diskUsage: Math.floor(Math.random() * 25) + 15, // %
      status: 'healthy'
    };
  },

  // Export dashboard data
  exportDashboardData: async (format = 'csv') => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stats = await analyticsAPI.getDashboardStats();
    const userGrowth = await analyticsAPI.getUserGrowth();
    const traffic = await analyticsAPI.getTrafficData();
    
    if (format === 'csv') {
      // Create CSV content for dashboard data
      const csvData = [
        ['Metric', 'Value', 'Change', 'Trend'],
        ['Total Users', stats.totalUsers.value, `${stats.totalUsers.change}%`, stats.totalUsers.trend],
        ['Active Users', stats.activeUsers.value, `${stats.activeUsers.change}%`, stats.activeUsers.trend],
        ['Total Posts', stats.totalPosts.value, `${stats.totalPosts.change}%`, stats.totalPosts.trend],
        ['Monthly Views', stats.monthlyViews.value, `${stats.monthlyViews.change}%`, stats.monthlyViews.trend],
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    
    return { success: true, message: 'Dashboard data exported successfully' };
  }
};

export default analyticsAPI;
