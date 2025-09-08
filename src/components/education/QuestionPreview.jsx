/**
 * Question Preview Component
 * Shows a preview of how the question will look
 */

import React from 'react';
import { 
  FaCheck, 
  FaTimes, 
  FaQuestionCircle,
  FaLightbulb 
} from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { getDifficultyColor, getQuestionTypeLabel } from '../../constants/questions';
import { getClassByCode } from '../../constants/classes';

const QuestionPreview = ({ formData, answers, subjects = [] }) => {
  const subject = subjects.find(s => s._id === formData.subject);

  return (
    <Card className="bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaQuestionCircle className="mr-2 text-blue-500" />
            Question Preview
          </h3>
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              {getQuestionTypeLabel(formData.type)}
            </Badge>
            <Badge className={getDifficultyColor(formData.difficulty)}>
              {formData.difficulty}
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              {formData.points} {formData.points === 1 ? 'point' : 'points'}
            </Badge>
          </div>
        </div>

        {/* Question Metadata */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Subject:</span>
              <span className="ml-2 text-gray-900">
                {subject?.name || 'Not selected'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Class:</span>
              <span className="ml-2 text-gray-900">
                {getClassByCode(formData.class)?.name || 'Not selected'}
              </span>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <h4 className="text-base font-medium text-gray-900 mb-3">Question:</h4>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            {formData.text ? (
              <div 
                className="text-gray-900"
                style={{ textAlign: 'left' }}
                dangerouslySetInnerHTML={{ __html: formData.text }}
              />
            ) : (
              <p className="text-gray-500 italic">No question text provided</p>
            )}
          </div>
        </div>

        {/* Answer Options */}
        <div className="mb-6">
          <h4 className="text-base font-medium text-gray-900 mb-3">Answer Options:</h4>
          <div className="space-y-2">
            {answers.length > 0 ? (
              answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg border ${
                    answer.isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center mr-3">
                    {formData.type === 'true_false' ? (
                      answer.isCorrect ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <FaTimes className="text-red-600" />
                      )
                    ) : (
                      <div
                        className={`w-4 h-4 rounded border-2 ${
                          answer.isCorrect
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {answer.isCorrect && (
                          <FaCheck className="text-white text-xs" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    {answer.text ? (
                      <span className={answer.isCorrect ? 'font-medium text-green-800' : 'text-gray-700'}>
                        {answer.text}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Empty answer option</span>
                    )}
                  </div>
                  {answer.isCorrect && (
                    <Badge className="bg-green-100 text-green-800 ml-2">
                      Correct
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No answer options provided</p>
            )}
          </div>
        </div>

        {/* Explanation */}
        {formData.explanation && (
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <FaLightbulb className="mr-2 text-yellow-500" />
              Explanation:
            </h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div 
                className="text-gray-800"
                style={{ textAlign: 'left' }}
                dangerouslySetInnerHTML={{ __html: formData.explanation }}
              />
            </div>
          </div>
        )}

        {/* Preview Note */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 italic">
            This is how your question will appear to students. Make sure all information is correct before saving.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default QuestionPreview;
