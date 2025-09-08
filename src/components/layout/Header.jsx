/**
 * Header Component
 * Top navigation bar with user menu, notifications, and theme toggle
 */

import { useState, Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaSpinner,
} from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import clsx from 'clsx';
import { ROUTES } from '../../constants/routes.js';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { authAPI } from '../../services/authAPI.js';

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use real user data from AuthContext - only show if authenticated
  const currentUser = isAuthenticated && user ? {
    name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
    email: user.email || 'user@example.com',
    avatar: user.avatar || null,
    role: user.role || 'N/A',
  } : {
    name: 'Guest User',
    email: 'guest@example.com',
    avatar: null,
    role: 'Guest',
  };

  console.log('🔍 Header user data:', { isAuthenticated, user, currentUser });

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

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Dashboard', href: ROUTES.DASHBOARD }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      if (index === pathSegments.length - 1 && pathSegments.length > 1) {
        // Don't make the last segment a link
        breadcrumbs.push({
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
        });
      } else if (pathSegments.length > 1) {
        breadcrumbs.push({
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={onMenuClick}
          >
            <span className="sr-only">Open main menu</span>
            <FaBars className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Logo */}
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center ml-4 lg:ml-0"
          >
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
                Blog Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Center - Breadcrumbs (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.name}>
              {index > 0 && <span className="text-gray-300">/</span>}
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="hover:text-gray-700 transition-colors"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.name}</span>
              )}
            </Fragment>
          ))}
        </div>

        {/* Right side - Actions and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <ThemeToggle size="sm" />

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="sr-only">View notifications</span>
            <FaBell className="h-5 w-5" aria-hidden="true" />
            {/* Notification badge */}
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">3</span>
            </span>
          </button>

          {/* User menu - only show when authenticated */}
          {isAuthenticated ? (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                {currentUser.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                ) : (
                  <FaUserCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser.role}
                  </p>
                </div>
                <FaChevronDown className="h-4 w-4 text-gray-400" />
              </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentUser.email}
                  </p>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={ROUTES.PROFILE}
                        className={clsx(
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                        )}
                      >
                        <FaUserCircle className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={ROUTES.SETTINGS}
                        className={clsx(
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                        )}
                      >
                        <FaCog className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={clsx(
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50'
                        )}
                      >
                        {isLoggingOut ? (
                          <FaSpinner className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 animate-spin" />
                        ) : (
                          <FaSignOutAlt className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                        {isLoggingOut ? 'Signing out...' : 'Sign out'}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          ) : (
            // Show login link when not authenticated
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
