/**
 * Home/Dashboard Page Component
 * Main dashboard with overview stats and quick actions
 */

import { Link } from 'react-router-dom';
import {
  FaFileAlt,
  FaUsers,
  FaImage,
  FaEye,
  FaPlus,
  FaCog,
} from 'react-icons/fa';
import { ROUTES } from '../constants/routes.js';
import { StatsCard, StatsGrid, Card, Button, Badge } from '../components/ui/index.js';

const Home = () => {
  // Mock dashboard statistics
    const stats = [
    {
      id: 1,
      name: 'Total Posts',
      value: '24',
      icon: FaFileAlt,
      color: 'text-blue-600 bg-blue-100',
      link: ROUTES.BLOG.LIST
    },
    {
      id: 2,
      name: 'Total Users',
      value: '145',
      icon: FaUsers,
      color: 'text-green-600 bg-green-100',
      link: ROUTES.USER_MANAGEMENT
    },
    {
      id: 3,
      name: 'Media Files',
      value: '89',
      icon: FaImage,
      color: 'text-purple-600 bg-purple-100',
      link: ROUTES.MEDIA
    },
    {
      id: 4,
      name: 'Page Views',
      value: '12.5k',
      icon: FaEye,
      color: 'text-orange-600 bg-orange-100',
      link: ROUTES.ANALYTICS
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'Getting Started with React',
      status: 'published',
      date: '2025-08-10',
      views: 1234,
    },
    {
      id: 2,
      title: 'Advanced JavaScript Tips',
      status: 'draft',
      date: '2025-08-09',
      views: 0,
    },
    {
      id: 3,
      title: 'CSS Grid vs Flexbox',
      status: 'published',
      date: '2025-08-08',
      views: 856,
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's what's happening with your blog.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              icon={<FaCog className="h-4 w-4" />}
              size="sm"
            >
              Settings
            </Button>
            <Link to={ROUTES.POSTS_CREATE}>
              <Button
                variant="primary"
                icon={<FaPlus className="h-4 w-4" />}
                size="sm"
              >
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <StatsGrid className="mb-8">
        {stats.map((stat) => (
          <Link key={stat.name} to={stat.href}>
            <StatsCard
              title={stat.name}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              color="blue"
              icon={<stat.icon className="h-6 w-6" />}
              className="hover:shadow-md transition-shadow cursor-pointer"
            />
          </Link>
        ))}
      </StatsGrid>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Posts</h3>
              <Link
                to={ROUTES.POSTS}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View all
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()} • {post.views} views
                    </p>
                  </div>
                  <Badge
                    variant={post.status === 'published' ? 'green' : 'yellow'}
                  >
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <Link
                to={ROUTES.POSTS_CREATE}
                className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Create New Post</p>
                  <p className="text-sm text-gray-500">Write and publish a new blog post</p>
                </div>
              </Link>
              <Link
                to={ROUTES.MEDIA}
                className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <PhotoIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Upload Media</p>
                  <p className="text-sm text-gray-500">Add images and files</p>
                </div>
              </Link>
              <Link
                to={ROUTES.USERS_CREATE}
                className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <UsersIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Add User</p>
                  <p className="text-sm text-gray-500">Create a new user account</p>
                </div>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Home;
