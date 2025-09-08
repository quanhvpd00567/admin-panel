/**
 * Pagination Demo Component
 * Demo to showcase the reusable Pagination component functionality
 */

import React, { useState } from 'react';
import Pagination from '../components/ui/Pagination';
import Card from '../components/ui/Card';

const PaginationDemo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 1250; // Demo data
  const totalPages = Math.ceil(totalItems / pageSize);

  // Generate demo data for current page
  const generateDemoData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    return Array.from({ length: endIndex - startIndex }, (_, index) => ({
      id: startIndex + index + 1,
      name: `Item ${startIndex + index + 1}`,
      description: `This is demo item number ${startIndex + index + 1}`
    }));
  };

  const demoData = generateDemoData();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
    console.log('Page size changed to:', size);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pagination Component Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Showcasing the reusable Pagination component with {totalItems} demo items
          </p>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Page</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentPage}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Page Size</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{pageSize}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Pages</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalPages}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalItems}</div>
          </Card>
        </div>

        {/* Demo Data List */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Demo Data (Page {currentPage})
            </h2>
            
            <div className="space-y-3 mb-6">
              {demoData.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {item.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageSizeSelector={true}
              showQuickJumper={true}
              pageSizeOptions={[5, 10, 20, 50, 100]}
            />
          </div>
        </Card>

        {/* Feature Showcase */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Pagination Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>✅ First/Previous/Next/Last navigation</li>
              <li>✅ Page number display with ellipsis</li>
              <li>✅ Quick page jumper for large datasets</li>
              <li>✅ Page size selector (5, 10, 20, 50, 100)</li>
              <li>✅ Responsive design for mobile/desktop</li>
              <li>✅ Disabled states for edge cases</li>
              <li>✅ Dark mode support</li>
              <li>✅ Showing X to Y of Z results</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Usage Examples
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Small Dataset:</span> Basic pagination only
              </div>
              <div>
                <span className="font-medium">Medium Dataset:</span> + Page size selector
              </div>
              <div>
                <span className="font-medium">Large Dataset:</span> + Quick jumper
              </div>
              <div>
                <span className="font-medium">Admin Panels:</span> QuestionList, UserManagement
              </div>
              <div>
                <span className="font-medium">Data Tables:</span> Any list with pagination needs
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaginationDemo;
