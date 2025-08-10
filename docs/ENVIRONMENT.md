# Environment Configuration Guide

## Overview

This project uses environment variables to manage configuration settings across different deployment environments (development, staging, production).

## Environment Files

### `.env.example`
Template file with all available environment variables and their default values. This file is committed to the repository.

### `.env.local`
Local development configuration. Copy from `.env.development` and customize for your local setup. This file is ignored by git.

### `.env.development`
Development environment configuration. Used when running `npm run dev` or building with `--mode development`.

### `.env.production`
Production environment configuration. Used when building with `--mode production`.

## Environment Variables

### API Configuration
- `VITE_API_BASE_URL`: Base URL for API endpoints
- `VITE_UPLOAD_URL`: Base URL for file uploads

### Application Configuration
- `VITE_APP_NAME`: Application display name
- `VITE_APP_VERSION`: Application version

### Authentication Configuration
- `VITE_JWT_SECRET`: JWT secret key (change in production!)
- `VITE_JWT_EXPIRES_IN`: JWT token expiration time

### Development Configuration
- `VITE_DEBUG`: Enable debug mode and logging
- `VITE_LOG_LEVEL`: Log level (debug, info, warn, error)

### Feature Flags
- `VITE_ENABLE_ANALYTICS`: Enable analytics tracking
- `VITE_ENABLE_MOCK_DATA`: Enable mock data in development
- `VITE_ENABLE_DEV_TOOLS`: Enable development tools

## Usage in Code

### Import Configuration
```javascript
import { ENV, APP_CONFIG } from '@/config';

// Access environment variables
console.log(ENV.API_BASE_URL);
console.log(APP_CONFIG.api.timeout);
```

### Build API URLs
```javascript
import { buildApiUrl } from '@/config';

const url = buildApiUrl('/users'); // http://localhost:3001/api/users
```

### Environment Detection
```javascript
import { ENV } from '@/config';

if (ENV.IS_DEV) {
  console.log('Development mode');
}

if (ENV.DEBUG) {
  console.log('Debug mode enabled');
}
```

## Build Commands

### Development
```bash
npm run dev              # Start dev server with development env
npm run build:dev        # Build with development env
```

### Production
```bash
npm run build:prod       # Build with production env
npm run preview:prod     # Build and preview production
```

### Custom Environment
```bash
vite build --mode staging  # Build with custom .env.staging file
```

## Configuration Files

### Vite Configuration (`vite.config.js`)
- Path aliases (@, @components, etc.)
- Development server settings
- Build optimization
- Environment variable handling

### App Configuration (`src/config/app.js`)
- Application-wide settings
- Route definitions
- UI configuration
- Validation rules

### Environment Utilities (`src/config/env.js`)
- Environment variable handling
- Validation functions
- Helper utilities

## Security Best Practices

1. **Never commit sensitive data**: Use `.env.local` for sensitive development data
2. **Change default secrets**: Always change JWT secrets and API keys in production
3. **Validate environment**: The app validates required environment variables on startup
4. **Separate configs**: Use different environment files for different stages

## Troubleshooting

### Environment Variables Not Loading
1. Check file names (must start with `VITE_`)
2. Restart development server after changes
3. Verify file is not ignored by git

### Build Errors
1. Check for missing required environment variables
2. Validate environment configuration with `validateEnv()`
3. Check console for configuration errors

### Debug Information
In development mode, environment information is displayed in the bottom-right corner of the app for debugging purposes.
