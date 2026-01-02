import  prisma  from '@/lib/prisma'
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
      const headersList = await headers()
      const userAgent = headersList.get('user-agent') || ''
      const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || ''

      const session = await getServerSession()
      const auditUserId = userId || session?.user?.id

      if (!auditUserId) return

      await prisma.auditLog.create({
        data: {
          userId: auditUserId,
          action,
          entityType,
          entityId,
          details,
          ipAddress,
          userAgent,
          compliance: this.isPHIrelated(action, entityType) ? 'HIPAA' : null,
        },
      })
    } catch (error) {
      console.error('Audit logging failed:', error)
    }
  }

  private static isPHIrelated(action: string, entityType?: string): boolean {
    const phiEntities = ['Patient', 'MedicalRecord', 'Appointment', 'Prescription']
    const phiActions = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT']
    
    return (
      phiEntities.includes(entityType || '') ||
      phiActions.some(phiAction => action.includes(phiAction))
    )
  }

  static async getAuditLogs(
    filters: {
      userId?: string
      entityType?: string
      entityId?: string
      startDate?: Date
      endDate?: Date
    },
    page: number = 1,
    limit: number = 50
  ) {
    const skip = (page - 1) * limit
    const where: any = {}

    if (filters.userId) where.userId = filters.userId
    if (filters.entityType) where.entityType = filters.entityType
    if (filters.entityId) where.entityId = filters.entityId
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
            select: { name: true, email: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ])

    return { logs, total, page, limit }
  }
}