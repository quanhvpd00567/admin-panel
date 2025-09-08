/**
 * CreateClass Page Component
 * Form interface for creating new classes with subject association
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { FaArrowLeft, FaChalkboardTeacher } from 'react-icons/fa';
import { ROUTES } from '../../../constants/routes';

const CreateClass = () => {
  const navigate = useNavigate();

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
            Create New Class
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up a new class with scheduling and enrollment settings
          </p>
        </div>
      </div>

      {/* Content */}
      <Card className="p-8 text-center">
        <FaChalkboardTeacher className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Class Creation Form
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Class creation interface will be implemented in the next development phase.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Coming soon: Subject selection, scheduling, capacity settings, and pricing
        </div>
      </Card>
    </div>
  );
};

export default CreateClass;
