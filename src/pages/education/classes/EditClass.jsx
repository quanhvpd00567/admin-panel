/**
 * EditClass Page Component
 * Form interface for editing existing classes
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { ROUTES } from '../../../constants/routes';

const EditClass = () => {
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
            Edit Class #{id}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Modify class details, schedule, and enrollment settings
          </p>
        </div>
      </div>

      {/* Content */}
      <Card className="p-8 text-center">
        <FaEdit className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Class Editing Form
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Class editing interface will be implemented in the next development phase.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Coming soon: Pre-populated form with class data and enrollment management
        </div>
      </Card>
    </div>
  );
};

export default EditClass;
