/**
 * Tags Page Component
 * Manage blog tags
 */

import { Link } from 'react-router-dom';

const Tags = () => {
  // Mock tags data
  const tags = [
    { id: 1, name: 'JavaScript', slug: 'javascript', postCount: 24 },
    { id: 2, name: 'React', slug: 'react', postCount: 18 },
    { id: 3, name: 'Node.js', slug: 'nodejs', postCount: 12 },
    { id: 4, name: 'CSS', slug: 'css', postCount: 15 },
    { id: 5, name: 'HTML', slug: 'html', postCount: 10 },
    { id: 6, name: 'TypeScript', slug: 'typescript', postCount: 8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Tags</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage blog tags to help organize and categorize your content.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Tag
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-center text-gray-600 mb-6">
              Tag management will be implemented in Phase 5: Categories & Tags
            </p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {tag.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {tag.slug}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          {tag.postCount} posts
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900 text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tags;
