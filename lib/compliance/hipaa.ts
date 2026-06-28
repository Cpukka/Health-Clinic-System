// /lib/compliance/hipaa.ts
import prisma from '../../lib/prisma' // Adjust path to your Prisma instance

export class HIPAALogger {
  static async logAccess(
    userId: string, 
    resource: string, 
    action: string, 
    options?: {
      entityId?: string
      entityType?: string
      ipAddress?: string
      userAgent?: string
      details?: Record<string, any>
    }
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: `${action}_${resource}`,
          entityId: options?.entityId || null,
          entityType: options?.entityType || null,
          details: {  // Changed from 'metadata' to 'details'
            timestamp: new Date().toISOString(),
            userAgent: options?.userAgent || '',
            ipAddress: options?.ipAddress || '',
            ...options?.details,
          },
          ipAddress: options?.ipAddress || null,
          userAgent: options?.userAgent || null,
          compliance: 'HIPAA',
        },
      })
    } catch (error) {
      console.error('Failed to log HIPAA access:', error)
      // Don't throw - audit logging should not break the main operation
    }
  }

  static async logPHIAccess(
    userId: string,
    resource: string,
    action: string,
    request?: Request
  ) {
    const headers = request?.headers
    return this.logAccess(
      userId,
      resource,
      action,
      {
        ipAddress: headers?.get('x-forwarded-for') || headers?.get('x-real-ip') || '',
        userAgent: headers?.get('user-agent') || '',
        details: {
          timestamp: new Date().toISOString(),
          endpoint: request?.url,
        },
      }
    )
  }

  static validatePHI(data: any): boolean {
    // Check for PHI (Protected Health Information)
    const phiPatterns = [
      /(\d{3})-(\d{2})-(\d{4})/, // SSN
      /[A-Za-z]+\s+Hospital|Clinic|Medical/i,
      /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, // IP with medical context
    ]
    
    try {
      const jsonString = JSON.stringify(data)
      return !phiPatterns.some(pattern => pattern.test(jsonString))
    } catch {
      return true // If can't stringify, assume it's safe
    }
  }

  // Helper method for bulk operations
  static async logBulkAccess(
    userId: string,
    resources: string[],
    action: string,
    details?: Record<string, any>
  ) {
    const logs = resources.map(resource => ({
      userId,
      action: `${action}_${resource}`,
      details: {
        timestamp: new Date().toISOString(),
        resource,
        ...details,
      },
      compliance: 'HIPAA',
    }))

    try {
      await prisma.$transaction(
        logs.map(log => prisma.auditLog.create({ data: log }))
      )
    } catch (error) {
      console.error('Failed to log bulk HIPAA access:', error)
    }
  }

  // Validate and log access
  static async validateAndLog(
    userId: string,
    resource: string,
    action: string,
    data: any,
    request?: Request
  ): Promise<boolean> {
    // Validate PHI
    const isValid = this.validatePHI(data)
    
    if (!isValid) {
      // Log the attempt but with a warning
      await this.logAccess(userId, resource, action, {
        details: {
          error: 'PHI validation failed',
          timestamp: new Date().toISOString(),
        },
      })
      return false
    }

    // Log the access
    await this.logPHIAccess(userId, resource, action, request)
    return true
  }
}