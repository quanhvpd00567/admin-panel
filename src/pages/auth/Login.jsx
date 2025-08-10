const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign in to your account
        </h2>
        <p className="text-center text-gray-600">
          Authentication form will be implemented in Phase 2
        </p>
        <div className="mt-4">
          <a
            href="/dashboard"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Continue to Dashboard (Temporary)
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
