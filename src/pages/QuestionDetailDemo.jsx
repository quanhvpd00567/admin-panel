/**
 * Question Detail Demo Component
 * Demo to showcase the QuestionDetail page functionality
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { FaQuestionCircle, FaEdit, FaEye, FaList } from 'react-icons/fa';

const QuestionDetailDemo = () => {
  const navigate = useNavigate();

  // Sample questions data for demo
  const sampleQuestions = [
    {
      _id: '67890abcdef123456789012',
      text: 'What is the capital of Vietnam?',
      type: 'single_choice',
      difficulty: 'easy',
      points: 2,
      subject: { name: 'Geography' },
      class: 10,
      answers: [
        { text: 'Ho Chi Minh City', isCorrect: false },
        { text: 'Hanoi', isCorrect: true },
        { text: 'Da Nang', isCorrect: false },
        { text: 'Can Tho', isCorrect: false }
      ],
      explanation: 'Hanoi is the capital and political center of Vietnam.'
    },
    {
      _id: '12345abcdef678901234567',
      text: 'The Earth is flat.',
      type: 'true_false',
      difficulty: 'easy',
      points: 1,
      subject: { name: 'Science' },
      class: 8,
      answers: [
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: true }
      ],
      explanation: 'The Earth is actually an oblate spheroid, not flat.'
    },
    {
      _id: 'abcdef123456789012345678',
      text: 'Which of the following are programming languages?',
      type: 'multiple_choice',
      difficulty: 'medium',
      points: 3,
      subject: { name: 'Computer Science' },
      class: 12,
      answers: [
        { text: 'JavaScript', isCorrect: true },
        { text: 'Python', isCorrect: true },
        { text: 'HTML', isCorrect: false },
        { text: 'Java', isCorrect: true }
      ],
      explanation: 'JavaScript, Python, and Java are programming languages. HTML is a markup language.'
    },
    {
      _id: 'fedcba987654321098765432',
      text: 'The chemical symbol for gold is ___.',
      type: 'fill_blank',
      difficulty: 'hard',
      points: 2,
      subject: { name: 'Chemistry' },
      class: 11,
      answers: [
        { text: 'Au', isCorrect: true },
        { text: 'AU', isCorrect: true },
        { text: 'au', isCorrect: true }
      ],
      explanation: 'Gold\'s chemical symbol is Au, derived from the Latin word "aurum".'
    }
  ];

  const questionTypes = {
    true_false: { label: 'True/False', color: 'blue' },
    multiple_choice: { label: 'Multiple Choice', color: 'green' },
    single_choice: { label: 'Single Choice', color: 'orange' },
    fill_blank: { label: 'Fill in the Blank', color: 'purple' }
  };

  const difficultyLevels = {
    easy: { label: 'Easy', color: 'green' },
    medium: { label: 'Medium', color: 'orange' },
    hard: { label: 'Hard', color: 'red' }
  };

  const handleViewQuestion = (questionId) => {
    // In a real app, this would navigate to the actual question detail page
    navigate(`/questions/${questionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Question Detail Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Demo showcase of the QuestionDetail page with sample questions
          </p>
        </div>

        {/* Demo Info Card */}
        <Card className="mb-6 p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center mb-3">
            <FaQuestionCircle className="text-blue-600 dark:text-blue-400 mr-3 text-xl" />
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              How to Use Question Detail
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <strong>Features:</strong>
              <ul className="mt-1 space-y-1">
                <li>• View complete question content</li>
                <li>• See all answer options with correct answers highlighted</li>
                <li>• Question metadata and statistics</li>
                <li>• Edit and delete functionality</li>
              </ul>
            </div>
            <div>
              <strong>Navigation:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Click &quot;View Detail&quot; on any question below</li>
                <li>• Use breadcrumb navigation to go back</li>
                <li>• Edit button leads to question form</li>
                <li>• Delete button shows confirmation modal</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Sample Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {sampleQuestions.map((question, index) => {
            const typeConfig = questionTypes[question.type];
            const diffConfig = difficultyLevels[question.difficulty];
            
            return (
              <Card key={question._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge color={typeConfig.color} size="sm">
                        {typeConfig.label}
                      </Badge>
                      <Badge color={diffConfig.color} size="sm">
                        {diffConfig.label}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Question #{index + 1}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {question.points} pts
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {question.text}
                  </p>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between items-center">
                      <span>Subject: {question.subject.name}</span>
                      <span>Class: {question.class}</span>
                    </div>
                    <div className="mt-1">
                      Answers: {question.answers.length} ({question.answers.filter(a => a.isCorrect).length} correct)
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleViewQuestion(question._id)}
                    className="flex-1"
                  >
                    <FaEye className="mr-2" />
                    View Detail
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/questions/${question._id}/edit`)}
                  >
                    <FaEdit />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/questions')}
          >
            <FaList className="mr-2" />
            Go to Question List
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/questions/create')}
          >
            <FaQuestionCircle className="mr-2" />
            Create New Question
          </Button>
        </div>

        {/* Technical Info */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Technical Implementation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features</h4>
              <ul className="space-y-1">
                <li>✅ Dynamic routing with React Router</li>
                <li>✅ Loading states with spinner</li>
                <li>✅ Error handling and navigation</li>
                <li>✅ Responsive design</li>
                <li>✅ Dark mode support</li>
                <li>✅ Question type handling</li>
                <li>✅ Answer visualization</li>
                <li>✅ Breadcrumb navigation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Question Types Supported</h4>
              <ul className="space-y-1">
                <li>🔵 <strong>True/False:</strong> Simple true or false questions</li>
                <li>🟢 <strong>Multiple Choice:</strong> Multiple correct answers</li>
                <li>🟠 <strong>Single Choice:</strong> One correct answer</li>
                <li>🟣 <strong>Fill in the Blank:</strong> Text input answers</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestionDetailDemo;
