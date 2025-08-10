import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './routes.jsx';
import { validateEnv, logEnvInfo } from './config/index.js';

// Initialize environment configuration and validation
try {
  validateEnv();
  logEnvInfo();
} catch (error) {
  console.error('Environment configuration error:', error);
  // Show user-friendly error in development
  if (import.meta.env.DEV) {
    document.getElementById('root').innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace;">
        <h2>Configuration Error</h2>
        <p>${error.message}</p>
        <p>Please check your .env file configuration.</p>
      </div>
    `;
    throw error;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
