# Monitoring and Analytics Configuration

This document outlines how to configure and use Sentry for error monitoring and PostHog for analytics in the CV Creator backend.

## Sentry Configuration

### Installation
```bash
npm install @sentry/node @sentry/tracing
```

### Environment Variables
- `SENTRY_DSN`: Your Sentry Data Source Name

### Initialization
Sentry is initialized in `src/index.ts` near the top of the file. It will only initialize if `SENTRY_DSN` is set, ensuring development environments are not affected.

### Features
- Error tracking and monitoring
- Performance tracing
- Request/response tracking
- Integration with Express middleware

## PostHog Configuration

### Installation
```bash
npm install posthog-node
```

### Environment Variables
- `POSTHOG_API_KEY`: Your PostHog API key
- `POSTHOG_HOST` (optional): Your PostHog instance URL (defaults to https://app.posthog.com)

### Analytics Tracking
PostHog analytics are captured through a middleware that tracks:

#### Key Events
1. **User Signup**: Captured when a new user registers (`/api/auth/register`)
2. **User Login**: Captured when a user logs in (`/api/auth/login`)
3. **CV Creation**: Captured when a user creates a new CV (`/api/cvs`)
4. **PDF Export**: Captured when a user exports a CV to PDF (`/api/cvs/:id/export-pdf`)
5. **AI Tips Usage**: Captured when a user requests AI tips (`/api/ai/tips`)

#### API Usage Tracking
- All API calls (excluding auth endpoints) are tracked with:
  - User ID (if authenticated)
  - Endpoint path
  - HTTP method
  - Response status code
  - Request duration

### Features
- User behavior analytics
- Event tracking
- Funnel analysis
- Retention tracking
- Custom event properties

## Usage

### Development
In development environments, neither Sentry nor PostHog will be active unless their respective environment variables are set.

### Production
1. Set `SENTRY_DSN` and `POSTHOG_API_KEY` in your production environment
2. Restart the backend service
3. Monitor the health endpoint `/health` to verify both services are enabled

### Health Check
Access `/health` to verify monitoring status:
```json
{
  "status": "ok",
  "timestamp": "2026-02-24T21:01:00.000Z",
  "uptime": 3600,
  "env": "production",
  "sentry": "enabled",
  "posthog": "enabled"
}
```

## What is Tracked

### Sentry
- All unhandled exceptions and rejections
- HTTP request/response data
- Performance metrics
- Error stack traces

### PostHog
- User authentication events
- CV creation and export events
- AI tips usage
- General API usage patterns
- User engagement metrics

## Security Considerations

- Sentry and PostHog are only initialized if their respective environment variables are set
- User data is tracked with appropriate privacy controls
- No sensitive data (passwords, tokens) is sent to monitoring services
- All tracking is opt-in via environment configuration