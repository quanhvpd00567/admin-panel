/**
 * Statistics Card Component
 * Displays key metrics with trend indicators and animations
 */

import React from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiMinus,
  FiUsers,
  FiFileText,
  FiEye,
  FiDollarSign,
  FiZap
} from 'react-icons/fi';
import clsx from 'clsx';

const StatCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: IconComponent,
  color = 'blue',
  loading = false,
  format = 'number'
}) => {
  // Format the value based on the format type
  const formatValue = (val, fmt) => {
    if (loading) return '---';
    
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      
      case 'percentage':
        return `${val.toFixed(1)}%`;
      
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      
      default:
        return val;
    }
  };

  // Get trend icon and color
  const getTrendIcon = () => {
    if (loading) return <FiMinus className="w-4 h-4" />;
    
    switch (trend) {
      case 'up':
        return <FiTrendingUp className="w-4 h-4" />;
      case 'down':
        return <FiTrendingDown className="w-4 h-4" />;
      default:
        return <FiMinus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    if (loading) return 'text-gray-400';
    
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Color configurations
  const colorConfigs = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      ring: 'ring-blue-500/20'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      ring: 'ring-green-500/20'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      ring: 'ring-purple-500/20'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
      ring: 'ring-orange-500/20'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      ring: 'ring-red-500/20'
    }
  };

  const colorConfig = colorConfigs[color] || colorConfigs.blue;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            {loading ? (
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatValue(value, format)}
              </p>
            )}
            
            {change !== undefined && !loading && (
              <div className={clsx(
                'flex items-center space-x-1 text-sm font-medium',
                getTrendColor()
              )}>
                {getTrendIcon()}
                <span>{Math.abs(change).toFixed(1)}%</span>
              </div>
            )}
          </div>
          
          {change !== undefined && !loading && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {trend === 'up' ? 'Increase' : trend === 'down' ? 'Decrease' : 'No change'} from last month
            </p>
          )}
        </div>
        
        <div className={clsx(
          'flex-shrink-0 p-3 rounded-lg',
          colorConfig.bg,
          colorConfig.ring,
          'ring-1'
        )}>
          {loading ? (
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          ) : (
            <IconComponent className={clsx('w-6 h-6', colorConfig.text)} />
          )}
        </div>
      </div>
    </div>
  );
};

// Predefined stat card components for common metrics
export const UserStatsCard = ({ stats, loading }) => (
  <StatCard
    title="Total Users"
    value={stats?.totalUsers?.value || 0}
    change={stats?.totalUsers?.change}
    trend={stats?.totalUsers?.trend}
    icon={FiUsers}
    color="blue"
    loading={loading}
    format="number"
  />
);

export const ActiveUsersCard = ({ stats, loading }) => (
  <StatCard
    title="Active Users"
    value={stats?.activeUsers?.value || 0}
    change={stats?.activeUsers?.change}
    trend={stats?.activeUsers?.trend}
    icon={FiZap}
    color="green"
    loading={loading}
    format="number"
  />
);

export const PostsCard = ({ stats, loading }) => (
  <StatCard
    title="Total Posts"
    value={stats?.totalPosts?.value || 0}
    change={stats?.totalPosts?.change}
    trend={stats?.totalPosts?.trend}
    icon={FiFileText}
    color="purple"
    loading={loading}
    format="number"
  />
);

export const ViewsCard = ({ stats, loading }) => (
  <StatCard
    title="Monthly Views"
    value={stats?.monthlyViews?.value || 0}
    change={stats?.monthlyViews?.change}
    trend={stats?.monthlyViews?.trend}
    icon={FiEye}
    color="orange"
    loading={loading}
    format="number"
  />
);

export const RevenueCard = ({ stats, loading }) => (
  <StatCard
    title="Revenue"
    value={stats?.revenue?.value || 0}
    change={stats?.revenue?.change}
    trend={stats?.revenue?.trend}
    icon={FiDollarSign}
    color="green"
    loading={loading}
    format="currency"
  />
);

export default StatCard;
