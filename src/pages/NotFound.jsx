/**
 * 404 Not Found Page Component
 * Comprehensive error page with navigation options
 */

import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-24 w-24 text-indigo-600">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.709 2.291M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mt-6">404</h1>

        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-4 mb-2">
          The page you are looking for does not exist or has been moved.
        </p>

        {location.pathname && (
          <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-100 px-3 py-1 rounded">
            {location.pathname}
          </p>
        )}

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Link>

          <Link
            to="/dashboard"
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">Popular pages:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/posts" className="text-indigo-600 hover:text-indigo-500">
              Posts
            </Link>
            <Link to="/media" className="text-indigo-600 hover:text-indigo-500">
              Media
            </Link>
            <Link to="/users" className="text-indigo-600 hover:text-indigo-500">
              Users
            </Link>
            <Link
              to="/settings"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Settings
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-gray-600 hover:text-gray-500 underline"
          >
            ← Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
