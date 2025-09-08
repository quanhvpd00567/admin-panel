/**
 * ClassSchedule Page Component
 * Calendar view for managing class schedules
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { FaArrowLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { ROUTES } from '../../../constants/routes';

const ClassSchedule = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              Class Schedule
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Calendar view of all class schedules and timings
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <FaClock className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button variant="outline" size="sm">
            This Week
          </Button>
          <Button variant="outline" size="sm">
            This Month
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <Card className="p-8 text-center">
        <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Schedule Calendar
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Interactive calendar view will be implemented in the next development phase.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Coming soon: Full calendar integration with drag-and-drop scheduling,
          conflict detection, and recurring class management
        </div>
      </Card>
    </div>
  );
};

export default ClassSchedule;
