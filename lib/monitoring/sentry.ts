// /lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'
import prisma from '../prisma'

// Remove the Prisma integration as it's not available
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  // Remove or comment out the Prisma integration
  integrations: [
    // @ts-ignore - Prisma integration is not available in this version
    // new Sentry.Integrations.Prisma({ client: prisma }),
  ],
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.data) {
      event.request.data = sanitizeData(event.request.data)
    }
    return event
  },
})

function sanitizeData(data: any): any {
  // Remove sensitive information before sending to Sentry
  const sensitiveFields = ['password', 'ssn', 'creditCard', 'token', 'secret', 'key']
  
  const sanitize = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sanitize)
    } else if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveFields.includes(key)) {
          sanitized[key] = '[REDACTED]'
        } else if (typeof value === 'string' && isSensitiveString(value)) {
          sanitized[key] = '[REDACTED]'
        } else {
          sanitized[key] = sanitize(value)
        }
      }
      return sanitized
    }
    return obj
  }
  
  return sanitize(data)
}

function isSensitiveString(value: string): boolean {
  // Check for patterns that might contain sensitive data
  const patterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{16}\b/, // Credit card
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b[\d]{3}[\s-]?[\d]{3}[\s-]?[\d]{4}\b/, // Phone
  ]
  return patterns.some(pattern => pattern.test(value))
}

// Export a function to capture errors with context
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context ? sanitizeData(context) : undefined,
  })
}

// Export a function to capture messages with context
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  Sentry.captureMessage(message, {
    level,
    extra: context ? sanitizeData(context) : undefined,
  })
}

// Export a function to add breadcrumb
export function addBreadcrumb(message: string, category?: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category: category || 'app',
    data: data ? sanitizeData(data) : undefined,
    level: 'info',
  })
}

export default Sentry