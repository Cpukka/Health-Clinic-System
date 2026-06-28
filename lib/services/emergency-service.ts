// /lib/services/emergency-service.ts - Simple version
import prisma from '@/lib/prisma'
import { SMSService } from './sms-service'
import { EmailService } from './email-service' // You might need to create this
import { AuditService } from '../audit/audit-service'

// Create EmailService if it doesn't exist
class EmailService {
  async sendEmergencyAlert(email: string, data: any): Promise<void> {
    console.log(`📧 Emergency alert email to ${email}:`, data)
    // Implement actual email sending here
  }
}

export class EmergencyService {
  static async triggerEmergencyAlert(
    patientId: string,
    emergencyType: 'MEDICAL' | 'SECURITY' | 'SYSTEM',
    details: string,
    triggeredBy: string
  ) {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          clinic: {
            include: {
              users: {
                where: {
                  role: { in: ['ADMIN', 'DOCTOR', 'NURSE'] },
                },
              },
            },
          },
        },
      })

      if (!patient) {
        throw new Error('Patient not found')
      }

      // Create emergency record
      const emergencyRecord = await prisma.emergencyAlert.create({
        data: {
          patientId,
          emergencyType,
          details,
          triggeredBy,
          status: 'ACTIVE',
          clinicId: patient.clinicId,
        },
      })

      // Notify staff (simplified)
      const smsService = new SMSService()
      for (const staff of patient.clinic.users) {
        if (staff.phone) {
          await smsService.sendEmergencyAlert(
            staff.phone,
            `🚨 EMERGENCY: Patient ${patient.firstName} ${patient.lastName} - ${emergencyType}`
          )
        }
      }

      // Log audit
      await AuditService.log(
        'EMERGENCY_ALERT_TRIGGERED',
        'EmergencyAlert',
        emergencyRecord.id,
        { patientId, emergencyType, triggeredBy },
        triggeredBy
      )

      return emergencyRecord
    } catch (error) {
      console.error('Emergency alert failed:', error)
      throw error
    }
  }

  static async resolveEmergency(alertId: string, resolvedBy: string, resolutionNotes: string) {
    try {
      const alert = await prisma.emergencyAlert.update({
        where: { id: alertId },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          resolutionNotes,
        },
      })

      await AuditService.log(
        'EMERGENCY_ALERT_RESOLVED',
        'EmergencyAlert',
        alertId,
        { resolvedBy, resolutionNotes },
        resolvedBy
      )

      return alert
    } catch (error) {
      console.error('Failed to resolve emergency:', error)
      throw error
    }
  }
}