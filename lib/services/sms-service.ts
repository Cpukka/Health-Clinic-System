// SMS Service using Twilio (or other providers)
import twilio from 'twilio'

export class SMSService {
  private client: twilio.Twilio | null = null

  constructor() {
    // Only initialize Twilio if credentials are available
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )
    }
  }

  async sendAppointmentReminder(appointment: any, patientPhone: string): Promise<boolean> {
    try {
      const formattedDate = new Date(appointment.scheduledFor).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })

      const message = `Reminder: You have an appointment tomorrow at ${formattedDate} with Dr. ${appointment.doctor?.name || 'your doctor'}. Please arrive 15 minutes early.`
      
      // Only send if Twilio is configured
      if (this.client && process.env.TWILIO_PHONE_NUMBER) {
        await this.client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: patientPhone
        })
        console.log(`SMS reminder sent to ${patientPhone}`)
      } else {
        console.log(`[DEMO] SMS would be sent to ${patientPhone}: ${message}`)
      }
      
      return true
    } catch (error) {
      console.error('Failed to send SMS reminder:', error)
      // Don't fail the whole operation if SMS fails
      return false
    }
  }

  async sendAppointmentConfirmation(appointment: any, patientPhone: string): Promise<boolean> {
    try {
      const formattedDate = new Date(appointment.scheduledFor).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })

      const message = `Appointment Confirmed\n\nHello ${appointment.patient?.firstName || 'Patient'},\nYour appointment with Dr. ${appointment.doctor?.name || 'your doctor'} is scheduled for ${formattedDate}.\n\nAppointment ID: ${appointment.id}\nThank you!`
      
      // Only send if Twilio is configured
      if (this.client && process.env.TWILIO_PHONE_NUMBER) {
        await this.client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: patientPhone
        })
        console.log(`SMS confirmation sent to ${patientPhone}`)
      } else {
        console.log(`[DEMO] SMS would be sent to ${patientPhone}: ${message}`)
      }
      
      return true
    } catch (error) {
      console.error('Failed to send confirmation SMS:', error)
      // Don't fail the whole operation if SMS fails
      return false
    }
  }

  async sendGeneralMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      if (this.client && process.env.TWILIO_PHONE_NUMBER) {
        await this.client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        })
        return true
      } else {
        console.log(`[DEMO] SMS would be sent to ${phoneNumber}: ${message}`)
        return true
      }
    } catch (error) {
      console.error('Failed to send SMS:', error)
      return false
    }
  }

  // Check if SMS service is configured
  isConfigured(): boolean {
    return !!this.client && !!process.env.TWILIO_PHONE_NUMBER
  }
}

// Singleton instance
export const smsService = new SMSService()