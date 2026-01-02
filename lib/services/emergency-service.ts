import  prisma  from '@/lib/prisma'
import { SMSService } from './sms-service'
import { EmailService } from '../email-service'
import { AuditService } from '@/lib/audit/audit-service'

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

      // Get emergency contacts
      const emergencyContacts = await this.getEmergencyContacts(patientId)

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

      // Notify clinic staff
      await this.notifyClinicStaff(
        patient.clinic.users,
        patient,
        emergencyType,
        details
      )

      // Notify emergency contacts
      await this.notifyEmergencyContacts(
        emergencyContacts,
        patient,
        emergencyType,
        details
      )

      // Log audit trail
      await AuditService.log(
        'EMERGENCY_ALERT_TRIGGERED',
        'EmergencyAlert',
        emergencyRecord.id,
        {
          patientId,
          emergencyType,
          triggeredBy,
          notifiedStaff: patient.clinic.users.length,
          notifiedContacts: emergencyContacts.length,
        },
        triggeredBy
      )

      return emergencyRecord
    } catch (error) {
      console.error('Emergency alert failed:', error)
      throw error
    }
  }

  private static async getEmergencyContacts(patientId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        emergencyContact: true,
        phone: true,
        email: true,
      },
    })

    const contacts = []

    if (patient?.emergencyContact) {
      contacts.push({
        type: 'PHONE',
        value: patient.emergencyContact,
        relationship: 'Emergency Contact',
      })
    }

    if (patient?.phone) {
      contacts.push({
        type: 'PHONE',
        value: patient.phone,
        relationship: 'Patient',
      })
    }

    if (patient?.email) {
      contacts.push({
        type: 'EMAIL',
        value: patient.email,
        relationship: 'Patient',
      })
    }

    return contacts
  }

  private static async notifyClinicStaff(
    staff: any[],
    patient: any,
    emergencyType: string,
    details: string
  ) {
    const smsService = new SMSService()
    const emailService = new EmailService()

    const message = `🚨 EMERGENCY ALERT - ${emergencyType}
Patient: ${patient.firstName} ${patient.lastName}
Details: ${details}
Location: ${patient.clinic?.name || 'Clinic'}
Time: ${new Date().toLocaleString()}
Please respond immediately.`

    for (const staffMember of staff) {
      try {
        // Send SMS
        if (staffMember.phone) {
          await smsService.sendEmergencyAlert(staffMember.phone, message)
        }

        // Send Email
        if (staffMember.email) {
          await emailService.sendEmergencyAlert(staffMember.email, {
            patientName: `${patient.firstName} ${patient.lastName}`,
            emergencyType,
            details,
            clinicName: patient.clinic?.name,
            timestamp: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error(`Failed to notify staff ${staffMember.id}:`, error)
      }
    }
  }

  private static async notifyEmergencyContacts(
    contacts: any[],
    patient: any,
    emergencyType: string,
    details: string
  ) {
    const smsService = new SMSService()
    const emailService = new EmailService()

    const message = `🚨 EMERGENCY NOTIFICATION
${patient.firstName} ${patient.lastName} has triggered a ${emergencyType} emergency.
Details: ${details}
Clinic: ${patient.clinic?.name || 'Medical Center'}
Please contact the clinic immediately at ${patient.clinic?.phone || 'clinic phone'}.`

    for (const contact of contacts) {
      try {
        if (contact.type === 'PHONE') {
          await smsService.sendEmergencyAlert(contact.value, message)
        } else if (contact.type === 'EMAIL') {
          await emailService.sendEmergencyAlert(contact.value, {
            patientName: `${patient.firstName} ${patient.lastName}`,
            emergencyType,
            details,
            clinicName: patient.clinic?.name,
            clinicPhone: patient.clinic?.phone,
            relationship: contact.relationship,
          })
        }
      } catch (error) {
        console.error(`Failed to notify contact ${contact.value}:`, error)
      }
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

      // Notify patient that emergency is resolved
      const patient = await prisma.patient.findUnique({
        where: { id: alert.patientId },
        include: { clinic: true },
      })

      if (patient?.phone) {
        const smsService = new SMSService()
        await smsService.sendMessage(
          patient.phone,
          `✅ Emergency resolved: ${resolutionNotes}. Thank you for your patience.`
        )
      }

      await AuditService.log(
        'EMERGENCY_ALERT_RESOLVED',
        'EmergencyAlert',
        alertId,
        {
          resolvedBy,
          resolutionNotes,
          durationMinutes: Math.floor(
            (new Date().getTime() - alert.createdAt.getTime()) / 60000
          ),
        },
        resolvedBy
      )

      return alert
    } catch (error) {
      console.error('Failed to resolve emergency:', error)
      throw error
    }
  }
}