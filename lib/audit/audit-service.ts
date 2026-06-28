// /lib/audit/audit-service.ts
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'

export class AuditService {
  static async log(
    action: string,
    entityType?: string,
    entityId?: string,
    details?: any,
    userId?: string
  ) {
    try {
      // Get headers safely
      let userAgent = ''
      let ipAddress = ''
      
      try {
        const headersList = await headers()
        userAgent = headersList.get('user-agent') || ''
        ipAddress = headersList.get('x-forwarded-for') || 
                   headersList.get('x-real-ip') || 
                   ''
      } catch (error) {
        console.warn('Could not get headers for audit log:', error)
      }

      // Get session
      let auditUserId = userId
      if (!auditUserId) {
        try {
          const session = await getServerSession()
          auditUserId = session?.user?.id
        } catch (error) {
          console.warn('Could not get session for audit log:', error)
        }
      }

      // Don't log if no user ID
      if (!auditUserId) {
        console.warn('Audit log skipped - no user ID available')
        return
      }

      // Sanitize details to remove sensitive data
      const sanitizedDetails = this.sanitizeDetails(details)

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: auditUserId,
          action,
          entityType: entityType || null,
          entityId: entityId || null,
          details: sanitizedDetails || null,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          compliance: this.isPHIrelated(action, entityType) ? 'HIPAA' : null,
        },
      })
    } catch (error) {
      console.error('Audit logging failed:', error)
      // Don't throw - audit logging should not break the main operation
    }
  }

  // Log with explicit user context (for API routes without sessions)
  static async logWithUser(
    userId: string,
    action: string,
    entityType?: string,
    entityId?: string,
    details?: any,
    request?: Request
  ) {
    try {
      let userAgent = ''
      let ipAddress = ''
      
      if (request) {
        userAgent = request.headers.get('user-agent') || ''
        ipAddress = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   ''
      }

      const sanitizedDetails = this.sanitizeDetails(details)

      await prisma.auditLog.create({
        data: {
          userId,
          action,
          entityType: entityType || null,
          entityId: entityId || null,
          details: sanitizedDetails || null,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          compliance: this.isPHIrelated(action, entityType) ? 'HIPAA' : null,
        },
      })
    } catch (error) {
      console.error('Audit logging failed:', error)
    }
  }

  private static sanitizeDetails(details: any): any {
    if (!details) return details
    
    const sensitiveFields = [
      'password', 'ssn', 'creditCard', 'token', 'secret',
      'apiKey', 'privateKey', 'accessToken', 'refreshToken'
    ]
    
    const sanitize = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(sanitize)
      } else if (obj !== null && typeof obj === 'object') {
        const sanitized: any = {}
        for (const [key, value] of Object.entries(obj)) {
          if (sensitiveFields.some(field => 
            key.toLowerCase().includes(field.toLowerCase())
          )) {
            sanitized[key] = '[REDACTED]'
          } else {
            sanitized[key] = sanitize(value)
          }
        }
        return sanitized
      }
      return obj
    }
    
    return sanitize(details)
  }

  private static isPHIrelated(action: string, entityType?: string): boolean {
    const phiEntities = ['Patient', 'MedicalRecord', 'Appointment', 'Prescription']
    const phiActions = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT']
    
    return (
      phiEntities.some(entity => entityType?.includes(entity)) ||
      phiActions.some(phiAction => action.includes(phiAction))
    )
  }

  static async getAuditLogs(
    filters: {
      userId?: string
      entityType?: string
      entityId?: string
      action?: string
      startDate?: Date
      endDate?: Date
    },
    page: number = 1,
    limit: number = 50
  ) {
    try {
      const skip = (page - 1) * limit
      const where: any = {}

      if (filters.userId) where.userId = filters.userId
      if (filters.entityType) where.entityType = filters.entityType
      if (filters.entityId) where.entityId = filters.entityId
      if (filters.action) where.action = { contains: filters.action }
      
      if (filters.startDate || filters.endDate) {
        where.createdAt = {}
        if (filters.startDate) where.createdAt.gte = filters.startDate
        if (filters.endDate) where.createdAt.lte = filters.endDate
      }

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          include: {
            user: {
              select: { 
                id: true,
                name: true, 
                email: true, 
                role: true 
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.auditLog.count({ where }),
      ])

      return { 
        logs, 
        total, 
        page, 
        limit,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('Failed to get audit logs:', error)
      return { logs: [], total: 0, page, limit, totalPages: 0 }
    }
  }

  // Get audit logs for a specific entity
  static async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    limit: number = 50
  ) {
    try {
      return await prisma.auditLog.findMany({
        where: {
          entityType,
          entityId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    } catch (error) {
      console.error('Failed to get entity audit logs:', error)
      return []
    }
  }

  // Get user activity summary
  static async getUserActivitySummary(
    userId: string,
    days: number = 30
  ) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const actions = await prisma.auditLog.groupBy({
        by: ['action'],
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _count: {
          action: true,
        },
        orderBy: {
          _count: {
            action: 'desc',
          },
        },
      })

      const total = actions.reduce((sum, item) => sum + item._count.action, 0)

      return {
        userId,
        days,
        totalActions: total,
        actions,
      }
    } catch (error) {
      console.error('Failed to get user activity summary:', error)
      return { userId, days, totalActions: 0, actions: [] }
    }
  }

  // Clean up old audit logs (for GDPR/compliance)
  static async cleanupOldLogs(daysToKeep: number = 365) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const result = await prisma.auditLog.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
          compliance: null, // Don't delete HIPAA logs
        },
      })

      return {
        deletedCount: result.count,
        cutoffDate,
      }
    } catch (error) {
      console.error('Failed to cleanup audit logs:', error)
      return { deletedCount: 0, error: String(error) }
    }
  }
}

// Export a singleton instance
export const auditService = new AuditService()