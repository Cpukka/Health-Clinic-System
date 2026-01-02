import  prisma  from '../../lib/prisma' // Adjust path to your Prisma instance

export class HIPAALogger {
  static async logAccess(userId: string, resource: string, action: string) {
    await prisma.auditLog.create({
      data: {
        userId,
        action: `${action}_${resource}`,
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: '', // Will be filled from request
          ipAddress: '',
        },
        compliance: 'HIPAA',
      },
    })
  }

  static validatePHI(data: any): boolean {
    // Check for PHI (Protected Health Information)
    const phiPatterns = [
      /(\d{3})-(\d{2})-(\d{4})/, // SSN
      /[A-Za-z]+\s+Hospital|Clinic|Medical/i,
      /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, // IP with medical context
    ]
    
    const jsonString = JSON.stringify(data)
    return !phiPatterns.some(pattern => pattern.test(jsonString))
  }
}