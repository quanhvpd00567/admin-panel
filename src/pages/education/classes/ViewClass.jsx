/**
 * ViewClass Page Component
 * Detailed view of class information with enrollment management
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { FaArrowLeft, FaEye, FaChalkboardTeacher, FaUsers, FaChartLine } from 'react-icons/fa';
import { ROUTES } from '../../../constants/routes';

const ViewClass = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(ROUTES.CLASSES)}
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Class Details #{id}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive class information and enrollment management
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Information */}
        <div className="lg:col-span-2">
          <Card className="p-8 text-center mb-6">
            <FaChalkboardTeacher className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Class Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Class detail view will be implemented in the next development phase.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Coming soon: Schedule, syllabus, materials, instructor details
            </div>
          </Card>

          {/* Enrollment Management */}
          <Card className="p-8 text-center">
            <FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Enrollment Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Student enrollment interface coming soon.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Features: enrolled students list, waitlist management, capacity tracking
            </div>
          </Card>
        </div>

        {/* Analytics Sidebar */}
        <div>
          <Card className="p-8 text-center">
            <FaChartLine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Class Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Performance metrics and insights coming soon.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Analytics: attendance rates, engagement metrics, completion statistics
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewClass;
