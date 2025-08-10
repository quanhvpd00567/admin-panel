# CI/CD Documentation

## GitHub Actions Workflows

This project includes a comprehensive CI/CD pipeline using GitHub Actions with four main workflows:

### 1. Code Quality Checks (`.github/workflows/code-quality.yml`)

**Triggers**: Push to main/develop, Pull Requests

**Jobs**:
- **Lint and Format**: ESLint, Prettier, TypeScript checking
- **Security Audit**: npm audit, vulnerability scanning
- **Dependency Check**: Outdated packages, license compliance, bundle analysis

### 2. Testing Pipeline (`.github/workflows/test.yml`)

**Triggers**: Push, Pull Requests

**Jobs**:
- **Unit Tests**: Multiple Node.js versions (18, 20)
- **Component Tests**: React component testing
- **E2E Tests**: Playwright end-to-end testing
- **Performance Tests**: Lighthouse CI performance auditing

### 3. Build and Deploy (`.github/workflows/deploy.yml`)

**Triggers**: Push to main, manual dispatch

**Jobs**:
- **Build**: Application build, Docker image creation
- **Deploy to Staging**: Automatic staging deployment
- **Deploy to Production**: Manual approval required
- **Rollback**: Automatic rollback on failure

### 4. Dependency Management (`.github/workflows/dependencies.yml`)

**Triggers**: Weekly schedule (Mondays 9 AM UTC), manual dispatch

**Jobs**:
- **Security Updates**: Automatic security vulnerability fixes
- **Minor Updates**: Minor version updates with testing
- **Major Updates**: Report generation for manual review
- **Vulnerability Scanning**: OWASP and Snyk security scanning

## Required Secrets

Add these secrets to your GitHub repository:

```bash
# Code coverage
CODECOV_TOKEN=your_codecov_token

# Performance monitoring
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token

# Security scanning
SNYK_TOKEN=your_snyk_token

# Notifications
SLACK_WEBHOOK_URL=your_slack_webhook

# Container registry (optional)
GHCR_TOKEN=your_github_token
```

## Environment Configuration

### Staging Environment
- **URL**: https://staging.blog-admin.example.com
- **Deployment**: Automatic on main branch
- **Testing**: Smoke tests included

### Production Environment  
- **URL**: https://blog-admin.example.com
- **Deployment**: Manual approval required
- **Testing**: Health checks included

## Package.json Scripts

### Testing
```bash
npm run test              # Run all tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests
npm run test:components   # Component tests
npm run test:e2e          # End-to-end tests
npm run test:coverage     # Coverage report
```

### Code Quality
```bash
npm run lint              # ESLint check
npm run lint:fix          # Fix ESLint issues
npm run format            # Format with Prettier
npm run format:check      # Check formatting
npm run type-check        # TypeScript check
```

### Security
```bash
npm run security:audit    # Security audit
npm run security:fix      # Fix vulnerabilities
npm run deps:check        # Check outdated deps
npm run deps:update       # Update dependencies
```

### Docker
```bash
npm run docker:build      # Build Docker image
npm run docker:run        # Run Docker container
```

## Manual Workflows

### Security Updates
```bash
# Trigger security updates
gh workflow run dependencies.yml -f update_type=security
```

### Minor Updates
```bash
# Trigger minor dependency updates
gh workflow run dependencies.yml -f update_type=minor
```

### Production Deployment
```bash
# Deploy to production (manual approval required)
gh workflow run deploy.yml -f environment=production
```

## Monitoring and Notifications

- **Slack Integration**: Deployment notifications
- **GitHub Releases**: Automatic release creation
- **Performance Monitoring**: Lighthouse CI reports
- **Security Alerts**: Vulnerability notifications

## Best Practices

1. **Branch Protection**: Enable branch protection on main
2. **Required Checks**: All CI checks must pass
3. **Manual Approval**: Production deployments require approval
4. **Security First**: Automatic security updates enabled
5. **Performance**: Lighthouse checks on every deployment

## Troubleshooting

### Common Issues

1. **Tests Failing**: Check test logs in Actions tab
2. **Build Errors**: Verify Node.js version compatibility
3. **Deployment Issues**: Check environment secrets
4. **Security Alerts**: Review vulnerability reports

### Support

- GitHub Issues: Report problems
- Actions Logs: Detailed execution logs
- Documentation: This README file
