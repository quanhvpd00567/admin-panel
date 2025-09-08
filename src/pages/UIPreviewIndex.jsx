import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaQuestionCircle,
  FaEye,
  FaCode
} from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const UIPreviewIndex = () => {
  const previews = [
    {
      title: 'Nature Quiz',
      description: 'Organic nature-themed quiz with garden and growth metaphors',
      path: '/quizzes/nature',
      icon: FaQuestionCircle,
      color: 'green',
      features: [
        'Nature/garden theme',
        'Growth metaphors',
        'Organic shapes',
        'Earth color palette',
        'Botanical elements',
        'Garden Progress tracker',
        'Seed-based navigation'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            � Nature Quiz UI Preview
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the beautiful nature-themed quiz interface with garden metaphors and growth-based progression.
            Optimized layout with Garden Progress moved to the top for better quiz-taking experience.
          </p>
        </div>

        {/* Preview Cards */}
        <div className="flex justify-center mb-12">
          <div className="max-w-md">
            {previews.map((preview, index) => {
            const Icon = preview.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              green: 'from-green-500 to-green-600',
              purple: 'from-purple-500 to-purple-600'
            };

            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${colorClasses[preview.color]} p-6 text-white`}>
                  <Icon className="text-3xl mb-3" />
                  <h3 className="text-xl font-semibold mb-2">{preview.title}</h3>
                  <p className="text-blue-100 text-sm">{preview.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h4 className="font-medium text-gray-800 mb-3">Features:</h4>
                  <ul className="space-y-2 mb-6">
                    {preview.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to={preview.path}>
                    <Button className="w-full">
                      <FaEye className="mr-2" />
                      View Preview
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
          </div>
        </div>

        {/* Info Section */}
        <Card className="p-8 text-center">
          <FaCode className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            🌿 Nature Quiz Preview
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This beautiful nature-themed quiz interface uses garden metaphors and growth-based progression. 
            The Garden Progress has been moved to the top for optimal quiz-taking experience. 
            All interactions use mock data to demonstrate functionality.
          </p>
          
          <div className="flex justify-center space-x-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              🌱 Garden Theme
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              🌿 Optimized Layout
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              🌻 Growth Progress
            </div>
          </div>
        </Card>

        {/* Quick Navigation */}
        <div className="mt-12 flex justify-center">
          <Link to="/quizzes/nature" className="block max-w-md w-full">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 text-lg">🌱 Take Nature Quiz</span>
                <FaQuestionCircle className="text-green-500 text-xl" />
              </div>
              <p className="text-gray-600">Experience the beautiful garden-themed quiz interface with optimized layout</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Garden Progress</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Growth Metaphors</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Nature Icons</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UIPreviewIndex;
