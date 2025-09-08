import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import {
  Button,
  Badge,
  Select,
} from '../../components/ui';
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaFilter,
  FaTrophy,
  FaExclamationTriangle
} from 'react-icons/fa';

const QuestionAnalytics = ({ questionId, questionData }) => {
  const [timeRange, setTimeRange] = useState('30');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [questionId, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mock analytics data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAnalytics = {
        overview: {
          totalAttempts: 1247,
          uniqueUsers: 892,
          correctAnswers: 823,
          correctRate: 66.0,
          averageTime: 45.2,
          difficultyIndex: 0.66,
          discriminationIndex: 0.42,
        },
        timeSeriesData: [
          { date: '2024-01-01', attempts: 45, correct: 28 },
          { date: '2024-01-02', attempts: 52, correct: 34 },
          { date: '2024-01-03', attempts: 38, correct: 25 },
          { date: '2024-01-04', attempts: 61, correct: 41 },
          { date: '2024-01-05', attempts: 48, correct: 32 },
          { date: '2024-01-06', attempts: 55, correct: 38 },
          { date: '2024-01-07', attempts: 43, correct: 29 },
        ],
        answerDistribution: [
          { answer: 'A', count: 245, percentage: 19.6, isCorrect: false },
          { answer: 'B', count: 823, percentage: 66.0, isCorrect: true },
          { answer: 'C', count: 134, percentage: 10.7, isCorrect: false },
          { answer: 'D', count: 45, percentage: 3.6, isCorrect: false },
        ],
        performanceByGroup: [
          { group: 'Beginner', attempts: 456, correct: 267, rate: 58.6 },
          { group: 'Intermediate', attempts: 512, correct: 358, rate: 69.9 },
          { group: 'Advanced', attempts: 279, correct: 198, rate: 71.0 },
        ],
        responseTimeDistribution: [
          { range: '0-15s', count: 156, percentage: 12.5 },
          { range: '16-30s', count: 423, percentage: 33.9 },
          { range: '31-60s', count: 445, percentage: 35.7 },
          { range: '61-120s', count: 189, percentage: 15.2 },
          { range: '120s+', count: 34, percentage: 2.7 },
        ],
        commonMistakes: [
          {
            pattern: 'Confused between concepts A and B',
            frequency: 156,
            suggestion: 'Add clarification about the difference'
          },
          {
            pattern: 'Misunderstood the question format',
            frequency: 89,
            suggestion: 'Rephrase question for clarity'
          },
          {
            pattern: 'Calculation errors in multi-step problems',
            frequency: 67,
            suggestion: 'Break down into smaller steps'
          }
        ],
        tags: [
          { tag: 'javascript', usage: 89 },
          { tag: 'functions', usage: 67 },
          { tag: 'es6', usage: 45 },
          { tag: 'arrays', usage: 34 }
        ]
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (index) => {
    if (index >= 0.8) return 'text-green-600';
    if (index >= 0.6) return 'text-yellow-600';
    if (index >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getDiscriminationColor = (index) => {
    if (index >= 0.4) return 'text-green-600';
    if (index >= 0.3) return 'text-yellow-600';
    if (index >= 0.2) return 'text-orange-600';
    return 'text-red-600';
  };

  const exportData = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Attempts', analytics.overview.totalAttempts],
      ['Unique Users', analytics.overview.uniqueUsers],
      ['Correct Rate', `${analytics.overview.correctRate}%`],
      ['Average Time', `${analytics.overview.averageTime}s`],
      ['Difficulty Index', analytics.overview.difficultyIndex],
      ['Discrimination Index', analytics.overview.discriminationIndex],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-${questionId}-analytics.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải thống kê...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thống kê câu hỏi</h2>
          <p className="text-gray-600">Phân tích hiệu suất và xu hướng sử dụng</p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange} className="w-40">
            <option value="7">7 ngày qua</option>
            <option value="30">30 ngày qua</option>
            <option value="90">90 ngày qua</option>
            <option value="365">1 năm qua</option>
          </Select>
          <Button onClick={exportData} variant="outline">
            <FaDownload className="w-4 h-4 mr-2" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FaUsers className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng lượt làm</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.totalAttempts.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FaCheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tỷ lệ đúng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.correctRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FaClock className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Thời gian TB</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.averageTime}s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FaTrophy className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Người dùng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.uniqueUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaChartBar className="w-5 h-5 mr-2" />
              Chỉ số chất lượng
            </CardTitle>
            <CardDescription>
              Đánh giá độ khó và khả năng phân biệt của câu hỏi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Chỉ số độ khó (Difficulty Index)</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${getDifficultyColor(analytics.overview.difficultyIndex)}`}>
                    {analytics.overview.difficultyIndex.toFixed(2)}
                  </span>
                  <Badge variant={analytics.overview.difficultyIndex >= 0.6 ? 'success' : analytics.overview.difficultyIndex >= 0.4 ? 'warning' : 'destructive'}>
                    {analytics.overview.difficultyIndex >= 0.8 ? 'Dễ' : 
                     analytics.overview.difficultyIndex >= 0.6 ? 'Trung bình' : 
                     analytics.overview.difficultyIndex >= 0.4 ? 'Khó' : 'Rất khó'}
                  </Badge>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${analytics.overview.difficultyIndex * 100}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Chỉ số phân biệt (Discrimination Index)</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${getDiscriminationColor(analytics.overview.discriminationIndex)}`}>
                    {analytics.overview.discriminationIndex.toFixed(2)}
                  </span>
                  <Badge variant={analytics.overview.discriminationIndex >= 0.4 ? 'success' : analytics.overview.discriminationIndex >= 0.2 ? 'warning' : 'destructive'}>
                    {analytics.overview.discriminationIndex >= 0.4 ? 'Tốt' : 
                     analytics.overview.discriminationIndex >= 0.2 ? 'Khá' : 'Kém'}
                  </Badge>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${analytics.overview.discriminationIndex * 100}%` }}
                ></div>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                <p>• Difficulty Index: Tỷ lệ học viên trả lời đúng (0-1, càng cao càng dễ)</p>
                <p>• Discrimination Index: Khả năng phân biệt giữa học viên giỏi và yếu (&gt;0.4 tốt)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaChartPie className="w-5 h-5 mr-2" />
              Phân bố đáp án
            </CardTitle>
            <CardDescription>
              Tỷ lệ lựa chọn từng đáp án
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.answerDistribution.map((answer) => (
                <div key={answer.answer} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-lg ${answer.isCorrect ? 'text-green-600' : 'text-gray-600'}`}>
                      {answer.answer}
                    </span>
                    {answer.isCorrect && (
                      <Badge variant="success">Đúng</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{answer.count} lượt</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-gray-400'}`}
                        style={{ width: `${answer.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {answer.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaUsers className="w-5 h-5 mr-2" />
              Hiệu suất theo nhóm
            </CardTitle>
            <CardDescription>
              Phân tích kết quả theo trình độ học viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.performanceByGroup.map((group) => (
                <div key={group.group} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{group.group}</span>
                    <span className="text-sm text-gray-600">
                      {group.correct}/{group.attempts} ({group.rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${group.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaClock className="w-5 h-5 mr-2" />
              Phân bố thời gian
            </CardTitle>
            <CardDescription>
              Thời gian hoàn thành của học viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.responseTimeDistribution.map((time) => (
                <div key={time.range} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{time.range}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{time.count} người</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${time.percentage * 2.8}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {time.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Mistakes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaExclamationTriangle className="w-5 h-5 mr-2" />
            Lỗi thường gặp
          </CardTitle>
          <CardDescription>
            Phân tích các lỗi phổ biến và đề xuất cải thiện
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.commonMistakes.map((mistake, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{mistake.pattern}</h4>
                  <Badge variant="secondary">{mistake.frequency} lần</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Đề xuất:</span> {mistake.suggestion}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-red-500 h-1 rounded-full"
                    style={{ width: `${(mistake.frequency / analytics.overview.totalAttempts) * 100 * 5}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaChartLine className="w-5 h-5 mr-2" />
            Xu hướng theo thời gian
          </CardTitle>
          <CardDescription>
            Biểu đồ hiệu suất trong {timeRange} ngày qua
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.timeSeriesData.map((data, index) => {
              const height = (data.correct / data.attempts) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {Math.round(height)}%
                  </div>
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${height * 2}px`, minHeight: '2px' }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(data.date).getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            Tỷ lệ trả lời đúng theo ngày
          </div>
        </CardContent>
      </Card>

      {/* Tags Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Tags phổ biến</CardTitle>
          <CardDescription>
            Các tags được sử dụng cùng câu hỏi này
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analytics.tags.map((tag) => (
              <Badge 
                key={tag.tag} 
                variant="secondary" 
                className="flex items-center space-x-1"
              >
                <span>{tag.tag}</span>
                <span className="text-xs">({tag.usage})</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionAnalytics;
