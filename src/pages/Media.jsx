/**
 * Media Page Component
 * Manage uploaded files and media
 */

import { useState } from 'react';

const Media = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Mock media data
  const mediaFiles = [
    {
      id: 1,
      name: 'header-image.jpg',
      type: 'image',
      size: '2.4 MB',
      uploadDate: '2025-08-10',
      url: '/placeholder-image.jpg',
    },
    {
      id: 2,
      name: 'document.pdf',
      type: 'document',
      size: '1.2 MB',
      uploadDate: '2025-08-09',
      url: '/placeholder-document.pdf',
    },
    {
      id: 3,
      name: 'logo.png',
      type: 'image',
      size: '156 KB',
      uploadDate: '2025-08-08',
      url: '/placeholder-logo.png',
    },
  ];

  const toggleFileSelection = fileId => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Media Library
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your uploaded files, images, and documents.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Bulk Actions
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Upload Files
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-center text-gray-600 mb-6">
              Media management will be implemented in Phase 6: File Upload &
              Media Management
            </p>

            {/* Filter and Search */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search media files..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex space-x-3">
                <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option>All Types</option>
                  <option>Images</option>
                  <option>Documents</option>
                  <option>Videos</option>
                </select>
                <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option>Latest First</option>
                  <option>Oldest First</option>
                  <option>Name A-Z</option>
                  <option>Name Z-A</option>
                  <option>Size (Largest)</option>
                  <option>Size (Smallest)</option>
                </select>
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mediaFiles.map(file => (
                <div
                  key={file.id}
                  className={`relative bg-white border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedFiles.includes(file.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <div className="aspect-w-3 aspect-h-2 mb-3">
                    <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center">
                      {file.type === 'image' ? (
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-gray-500">{file.size}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                  </div>

                  {selectedFiles.includes(file.id) && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-6 bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-indigo-700">
                    {selectedFiles.length} file(s) selected
                  </p>
                  <div className="flex space-x-3">
                    <button className="text-sm text-indigo-600 hover:text-indigo-500">
                      Download
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-500">
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedFiles([])}
                      className="text-sm text-gray-600 hover:text-gray-500"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;
