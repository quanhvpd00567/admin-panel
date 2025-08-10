/**
 * Environment Info Component
 * Displays environment configuration information for debugging
 */

import { ENV, APP_CONFIG } from '../../config/index.js';

const EnvInfo = () => {
  // Only show in development mode
  if (!ENV.DEBUG) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg text-xs max-w-sm">
      <div className="font-bold mb-2">🔧 Environment Info</div>
      <div className="space-y-1">
        <div>
          <span className="text-gray-300">Mode:</span> {ENV.NODE_ENV}
        </div>
        <div>
          <span className="text-gray-300">App:</span> {ENV.APP_NAME}
        </div>
        <div>
          <span className="text-gray-300">Version:</span> {ENV.APP_VERSION}
        </div>
        <div>
          <span className="text-gray-300">API:</span> {ENV.API_BASE_URL}
        </div>
        <div>
          <span className="text-gray-300">Debug:</span>{' '}
          {ENV.DEBUG ? '✅' : '❌'}
        </div>
        <div>
          <span className="text-gray-300">Analytics:</span>{' '}
          {ENV.ENABLE_ANALYTICS ? '✅' : '❌'}
        </div>
      </div>
      {/* <div className="mt-2 pt-2 border-t border-gray-600">
        <div className="text-gray-400">Build: {__BUILD_TIME__}</div>
      </div> */}
    </div>
  );
};

export default EnvInfo;
