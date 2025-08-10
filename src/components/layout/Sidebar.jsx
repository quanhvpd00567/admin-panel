/**
 * Sidebar Component
 * Navigation sidebar with menu items and user info
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaEdit,
  FaImage,
  FaTag,
  FaHashtag,
  FaUsers,
  FaCog,
  FaChevronRight,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
} from 'react-icons/fa';
import clsx from 'clsx';
import { ROUTES } from '../../constants/routes.js';

const Sidebar = ({ isOpen, onClose, user = null }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  // Mock user data
  const currentUser = user || {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: null,
    role: 'Administrator',
  };

  // Navigation menu items
  const navigation = [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: FaHome,
      current: location.pathname === ROUTES.DASHBOARD,
      roles: ['admin', 'editor', 'author'],
    },
    {
      name: 'Posts',
      href: ROUTES.POSTS,
      icon: FaEdit,
      current: location.pathname.startsWith('/posts'),
      roles: ['admin', 'editor', 'author'],
      children: [
        { name: 'All Posts', href: ROUTES.POSTS },
        { name: 'Create New', href: ROUTES.POSTS_CREATE },
      ],
    },
    {
      name: 'Media',
      href: ROUTES.MEDIA,
      icon: FaImage,
      current: location.pathname === ROUTES.MEDIA,
      roles: ['admin', 'editor', 'author'],
    },
    {
      name: 'Categories',
      href: ROUTES.CATEGORIES,
      icon: FaTag,
      current: location.pathname === ROUTES.CATEGORIES,
      roles: ['admin', 'editor'],
    },
    {
      name: 'Tags',
      href: ROUTES.TAGS,
      icon: FaHashtag,
      current: location.pathname === ROUTES.TAGS,
      roles: ['admin', 'editor'],
    },
    {
      name: 'Users',
      href: ROUTES.USERS,
      icon: FaUsers,
      current: location.pathname.startsWith('/users'),
      roles: ['admin'],
      children: [
        { name: 'All Users', href: ROUTES.USERS },
        { name: 'Create New', href: ROUTES.USERS_CREATE },
      ],
    },
    {
      name: 'Settings',
      href: ROUTES.SETTINGS,
      icon: FaCog,
      current: location.pathname === ROUTES.SETTINGS,
      roles: ['admin', 'editor', 'author'],
    },
    {
      name: 'Form Demo',
      href: ROUTES.FORM_DEMO,
      icon: FaEdit,
      current: location.pathname === ROUTES.FORM_DEMO,
      roles: ['admin', 'editor', 'author'],
    },
  ];

  const toggleSubmenu = itemName => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleLogout = () => {
    console.log('Logout - to be implemented in Phase 2');
    // Logout logic will be implemented in Phase 2
  };

  // Check if user has access to menu item (placeholder logic)
  const hasAccess = roles => {
    // For now, assume admin role - this will be implemented in Phase 2
    return roles.includes('admin');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo section - Mobile only */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Blog Admin
              </span>
            </div>
          </div>

          {/* User info section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {currentUser.avatar ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={currentUser.avatar}
                  alt={currentUser.name}
                />
              ) : (
                <FaUserCircle className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigation.map(item => {
              if (!hasAccess(item.roles)) return null;

              const isExpanded = expandedMenus[item.name];
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.name}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        item.current
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={clsx(
                            'mr-3 h-5 w-5',
                            item.current
                              ? 'text-indigo-500 dark:text-indigo-400'
                              : 'text-gray-400 dark:text-gray-500'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </div>
                      {isExpanded ? (
                        <FaChevronDown className="h-4 w-4" />
                      ) : (
                        <FaChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={onClose} // Close mobile menu when clicking link
                      className={clsx(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        item.current
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      <item.icon
                        className={clsx(
                          'mr-3 h-5 w-5',
                          item.current
                            ? 'text-indigo-500 dark:text-indigo-400'
                            : 'text-gray-400 dark:text-gray-500'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )}

                  {/* Submenu */}
                  {hasChildren && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map(child => (
                        <Link
                          key={child.name}
                          to={child.href}
                          onClick={onClose}
                          className={clsx(
                            'block px-3 py-2 text-sm rounded-lg transition-colors',
                            location.pathname === child.href
                              ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaSignOutAlt className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
