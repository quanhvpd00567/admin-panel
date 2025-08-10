/**
 * Configuration Index
 * Central export point for all configuration modules
 */

export {
  ENV,
  validateEnv,
  getConfig,
  buildApiUrl,
  buildUploadUrl,
  logEnvInfo,
} from './env.js';
export {
  APP_CONFIG,
  ROUTES,
  NAVIGATION,
  STATUS_CODES,
  ERROR_MESSAGES,
} from './app.js';

// Re-export default configurations
export { default as ENV_CONFIG } from './env.js';
export { default as APP_CONFIG_DEFAULT } from './app.js';
