import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Prisma({ client: prisma }),
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
  const sensitiveFields = ['password', 'ssn', 'creditCard', 'token']
  
  const sanitize = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sanitize)
    } else if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveFields.includes(key)) {
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