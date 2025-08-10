/**
 * Reset Password Page Component
 * Password reset form with token validation
 */

import { Link, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-center text-gray-600 mb-4">
              Password reset form will be implemented in Phase 2: Authentication System
            </p>
            {token && (
              <p className="text-xs text-gray-500 text-center mb-4">
                Token: {token.substring(0, 10)}...
              </p>
            )}
            <div className="flex justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
