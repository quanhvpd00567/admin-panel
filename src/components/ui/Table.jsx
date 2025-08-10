/**
 * Table Component
 * Professional data table with sorting and pagination
 */

import clsx from 'clsx';

const Table = ({ children, className, ...props }) => {
  const classes = clsx(
    'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
    className
  );

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
            <table className={classes} {...props}>
              {children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableHeader = ({ children, className, ...props }) => {
  const classes = clsx('bg-gray-50 dark:bg-gray-700', className);

  return (
    <thead className={classes} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className, ...props }) => {
  const classes = clsx(
    'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700',
    className
  );

  return (
    <tbody className={classes} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className, clickable = false, ...props }) => {
  const classes = clsx(
    clickable &&
      'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors',
    className
  );

  return (
    <tr className={classes} {...props}>
      {children}
    </tr>
  );
};

const TableHead = ({ children, className, sortable = false, ...props }) => {
  const classes = clsx(
    'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
    sortable &&
      'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none',
    className
  );

  return (
    <th className={classes} {...props}>
      <div className="flex items-center space-x-1">
        {children}
        {sortable && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </th>
  );
};

const TableCell = ({ children, className, ...props }) => {
  const classes = clsx(
    'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100',
    className
  );

  return (
    <td className={classes} {...props}>
      {children}
    </td>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;
