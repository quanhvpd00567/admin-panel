/**
 * Auth Debug Helper
 * Helper functions to debug authentication issues
 */

import { isTokenExpired, getUserFromToken } from '../utils/authUtils';

export const debugAuth = () => {
  console.group('🔍 Auth Debug Info');
  
  // Check localStorage
  const token = localStorage.getItem('blog_admin_token');
  const user = localStorage.getItem('blog_admin_user');
  
  console.log('📁 Storage Status:');
  console.log('- Token exists:', !!token);
  console.log('- User data exists:', !!user);
  
  if (token) {
    console.log('🔑 Token Analysis:');
    console.log('- Token length:', token.length);
    console.log('- Token preview:', token.substring(0, 50) + '...');
    console.log('- Is expired:', isTokenExpired(token));
    
    try {
      const tokenUser = getUserFromToken(token);
      console.log('- Token user data:', tokenUser);
    } catch (error) {
      console.log('- Token decode error:', error.message);
    }
  }
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('👤 User Data:', userData);
    } catch (error) {
      console.log('❌ User data parse error:', error.message);
    }
  }
  
  // Check cookies
  const cookies = document.cookie;
  console.log('🍪 Cookies:', cookies);
  
  console.groupEnd();
};

export const clearAuthDebug = () => {
  console.log('🧹 Clearing all auth data...');
  localStorage.removeItem('blog_admin_token');
  localStorage.removeItem('blog_admin_user');
  localStorage.removeItem('blog_admin_refresh_token');
  document.cookie = 'blog_admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  console.log('✅ Auth data cleared');
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
  window.clearAuthDebug = clearAuthDebug;
}

export default {
  debugAuth,
  clearAuthDebug,
};
