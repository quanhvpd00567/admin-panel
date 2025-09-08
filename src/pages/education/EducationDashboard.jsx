/**
 * Education Overview Dashboard
 * Main dashboard for education management system
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaGraduationCap, FaChalkboardTeacher, FaBook, FaUsers, FaCalendar, FaChartLine } from 'react-icons/fa';
import { ROUTES } from '../../constants/routes';
import { mockSubjectService } from '../../services/education/mockSubjectData';
import { mockClassService } from '../../services/education/mockClassData';

const EducationDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);   
  const [stats, setStats] = useState({
    totalSubjects: 0,
    activeSubjects: 0,
    totalClasses: 0,
    activeClasses: 0,
    totalStudents: 0,
    upcomingClasses: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get subjects stats
        const subjectStats = await mockSubjectService.getStats();
        
        // Get classes stats  
        const classStats = await mockClassService.getStats();
        
        setStats({
          totalSubjects: subjectStats.total,
          activeSubjects: subjectStats.active,
          totalClasses: classStats.total,
          activeClasses: classStats.active,
          totalStudents: classStats.totalEnrollments,
          upcomingClasses: classStats.upcoming
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Create Subject',
      description: 'Add a new subject to the curriculum',
      icon: FaBook,
      color: 'bg-blue-500',
      onClick: () => navigate(ROUTES.EDUCATION.SUBJECTS.CREATE)
    },
    {
      title: 'Create Class',
      description: 'Schedule a new class session',
      icon: FaChalkboardTeacher,
      color: 'bg-green-500',
      onClick: () => navigate(ROUTES.EDUCATION.CLASSES.CREATE)
    },
    {
      title: 'View Schedule',
      description: 'Check class schedules and calendar',
      icon: FaCalendar,
      color: 'bg-purple-500',
      onClick: () => navigate(ROUTES.EDUCATION.CLASSES.SCHEDULE)
    }
  ];

  const statCards = [
    {
      title: 'Total Subjects',
      value: stats.totalSubjects,
      subtitle: `${stats.activeSubjects} active`,
      icon: FaBook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      subtitle: `${stats.activeClasses} active`,
      icon: FaChalkboardTeacher,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      subtitle: 'Enrolled across all classes',
      icon: FaUsers,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Upcoming Classes',
      value: stats.upcomingClasses,
      subtitle: 'This week',
      icon: FaCalendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaGraduationCap className="mr-3 h-8 w-8 text-blue-600" />
            Education Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of subjects, classes, and academic activities
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={action.onClick}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subjects */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Subjects
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.EDUCATION.SUBJECTS.LIST)}>
              View All
            </Button>
          </div>
          <div className="text-center py-8">
            <FaBook className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Recent subjects activity will be displayed here
            </p>
          </div>
        </Card>

        {/* Recent Classes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Classes
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.EDUCATION.CLASSES.LIST)}>
              View All
            </Button>
          </div>
          <div className="text-center py-8">
            <FaChalkboardTeacher className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Recent classes activity will be displayed here
            </p>
          </div>
        </Card>
      </div>

      {/* Analytics Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Analytics Overview
          </h3>
          <Button variant="ghost" size="sm">
            <FaChartLine className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
        <div className="text-center py-12">
          <FaChartLine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Detailed analytics and reporting will be available in Phase 8
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Coming soon: Student progress tracking, class performance metrics,
            and comprehensive educational analytics
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EducationDashboard;
