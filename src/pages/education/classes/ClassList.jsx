import { useState } from 'react';
import Card from '../../../components/ui/Card';
import { CLASS_OPTIONS } from '../../../constants/classes';

const ClassList = () => {
  // State management
  const [classes] = useState(CLASS_OPTIONS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Class Management
          </h1>
        </div>
      </div>

       <ClassTable classes={classes} />
    </div>
  );
};

// Class Table Component for List View
const ClassTable = ({
  classes,
}) => {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Class name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Class code
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {classes.map((classItem, index) => (
              <tr key={classItem.code} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td>{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                 {classItem.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {classItem.code}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ClassList;
