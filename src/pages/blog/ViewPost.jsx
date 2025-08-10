import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaCalendar, FaUser } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const ViewPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeftIcon className="w-4 h-4" />}
          onClick={() => navigate('/posts')}
        >
          Back to Posts
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            View Post #{id}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Preview blog post content and details
          </p>
        </div>
      </div>

      {/* Content */}
      <Card>
        <div className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <EyeIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Post Viewer Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The post viewer will be implemented in the next phase of development. 
              This will include full content display, comments, social sharing, and more.
            </p>
            <Button 
              variant="primary"
              onClick={() => navigate('/posts')}
            >
              Return to Post List
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ViewPost;
