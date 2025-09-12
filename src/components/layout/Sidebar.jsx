/**
 * Sidebar Component
 * Navigation sidebar with menu items and user info
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROLES } from '../../utils/authUtils.js';
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
  FaUser,
  FaGraduationCap,
  FaBook,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaQuestionCircle,
  FaDatabase,
  FaChartLine,
  FaSpinner,
  FaRobot,
} from 'react-icons/fa';
import clsx from 'clsx';
import { ROUTES } from '../../constants/routes.js';
import { authAPI } from '../../services/authAPI.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user: userLogin, logout, isAuthenticated } = useAuth();

 const currentUser = isAuthenticated && userLogin ? {
    name: userLogin.name,
    email: userLogin.email,
    avatar: '',
    role: userLogin.role,
  } : {
    name: 'Guest User',
    email: 'guest@example.com',
    avatar: null,
    role: 'Guest',
  };


  const isAdmin = currentUser.role === ROLES.ADMIN;
  const isParent = currentUser.role === ROLES.PARENT;
  const isStudent = currentUser.role === ROLES.STUDENT;

  const ALL_ROLES = [ROLES.ADMIN, ROLES.PARENT, ROLES.STUDENT];
  const ADMIN_ROLES = [ROLES.ADMIN];
  const PARENT_ROLES = [ROLES.ADMIN, ROLES.PARENT];
  const STUDENT_ROLES = [ROLES.ADMIN, ROLES.STUDENT];


  // Navigation menu items
  const navigation = [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: FaHome,
      current: location.pathname === ROUTES.DASHBOARD,
      roles: ALL_ROLES
    },
    {
      name: 'Posts',
      href: ROUTES.POSTS,
      icon: FaEdit,
      current: location.pathname.startsWith('/posts'),
      roles: ADMIN_ROLES,
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
      roles: ADMIN_ROLES,
    },
    {
      name: 'Categories',
      href: ROUTES.CATEGORIES,
      icon: FaTag,
      current: location.pathname === ROUTES.CATEGORIES,
      roles: ADMIN_ROLES,
    },
    {
      name: 'Tags',
      href: ROUTES.TAGS,
      icon: FaHashtag,
      current: location.pathname === ROUTES.TAGS,
      roles: ADMIN_ROLES,
    },
    {
      name: 'Users',
      href: ROUTES.USERS,
      icon: FaUsers,
      current: location.pathname.startsWith('/users'),
      roles: ADMIN_ROLES,
      children: [
        { name: 'All Users', href: ROUTES.USERS },
      ],
    },
    {
      name: 'Education',
      href: ROUTES.EDUCATION,
      icon: FaGraduationCap,
      current: location.pathname.startsWith('/education'),
      roles: ['administrator', 'parent'],
      children: [
        { name: 'Subjects', href: ROUTES.SUBJECTS, icon: FaBook },
        { name: 'Classes', href: ROUTES.CLASSES, icon: FaChalkboardTeacher },
        { name: 'Schedule', href: ROUTES.CLASSES_SCHEDULE, icon: FaCalendarAlt },
        { name: 'Quizzes', href: '/quizzes', icon: FaQuestionCircle },
        { name: 'Question Bank', href: '/questions', icon: FaDatabase },
      ],
    },
    {
      name: 'AI',
      href: '/',
      icon: FaRobot,
      current: location.pathname.startsWith('/ai'),
      roles: ['administrator', 'parent'],
      children: [
        { name: 'AI Dashboard', href: '/ai', icon: FaRobot },
        { name: 'Generate Process', href: '/ai/generate-process', icon: FaSpinner },
      ],
    },
    // list child
    {
      name: 'Children',
      href: ROUTES.CHILDREN,
      icon: FaGraduationCap,
      current: location.pathname.startsWith('/children'),
      roles: PARENT_ROLES,
      children: [
        { name: 'List Children', href: ROUTES.CHILDREN, icon: FaGraduationCap },
      ],
    },

    {
      name: 'Student Portal',
      href: '/student/quizzes',
      icon: FaGraduationCap,
      current: location.pathname.startsWith('/student'),
      roles: STUDENT_ROLES,
      children: [
        { name: 'Available Quizzes', href: '/student/assigned-quizzes', icon: FaQuestionCircle },
        { name: 'My Results', href: '/student/results', icon: FaChartLine },
      ],
    },
    {
      name: 'My Profile',
      href: '/my-profile',
      icon: FaUser,
      current: location.pathname === '/my-profile',
      roles: ALL_ROLES,
    },
    {
      name: 'Settings',
      href: ROUTES.SETTINGS,
      icon: FaCog,
      current: location.pathname === ROUTES.SETTINGS,
      roles: ['admin', 'editor', 'author'],
    },
  ];

  const toggleSubmenu = itemName => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check if user has access to menu item (placeholder logic)
  const hasAccess = (roles) => {
    if (isAdmin) return true;
    if (isParent) return roles.includes('parent');
    if (isStudent) return roles.includes('student');
    return false;
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
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isLoggingOut ? (
                <FaSpinner className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 animate-spin" />
              ) : (
                <FaSignOutAlt className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              )}
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
