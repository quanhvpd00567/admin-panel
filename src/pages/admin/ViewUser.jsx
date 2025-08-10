/**
 * View User Page Component
 * Display individual user details
 */

import { useParams, Link } from 'react-router-dom';

const ViewUser = () => {
  const { id } = useParams();

  // Mock user data
  const user = {
    id: id,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'Author',
    status: 'Active',
    joinDate: '2025-01-15',
    lastLogin: '2025-08-10T10:30:00Z',
    postsCount: 12,
    bio: 'Experienced content writer with a passion for technology and digital marketing.',
    avatar: null,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              User Profile
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <Link
              to={`/users/edit/${id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit User
            </Link>
            <Link
              to="/users"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Users
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-center text-gray-600 mb-6">
              User profile view will be enhanced in Phase 7: User Management
              System
            </p>

            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                      <svg
                        className="h-12 w-12 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Posts Count
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.postsCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Join Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Login
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.lastLogin).toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.bio}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h4>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Published post &quot;Getting Started with React&quot; - 2 days
                  ago
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Updated profile information - 5 days ago
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                  Created draft &quot;Advanced JavaScript Tips&quot; - 1 week
                  ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
