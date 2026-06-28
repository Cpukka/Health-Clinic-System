// /lib/services/sms-service.ts
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

  // Send emergency alert (the missing method)
  async sendEmergencyAlert(phoneNumber: string, message: string): Promise<boolean> {
    try {
      if (this.client && process.env.TWILIO_PHONE_NUMBER) {
        await this.client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        })
        console.log(`🚨 Emergency SMS sent to ${phoneNumber}`)
      } else {
        console.log(`[DEMO] Emergency SMS would be sent to ${phoneNumber}: ${message}`)
      }
      return true
    } catch (error) {
      console.error('Failed to send emergency SMS:', error)
      return false
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
      
      if (this.client && process.env.TWILIO_PHONE_NUMBER) {
        await this.client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: patientPhone
        })
        console.log(`✅ SMS reminder sent to ${patientPhone}`)
      } else {
        console.log(`[DEMO] SMS reminder to ${patientPhone}: ${message}`)
      }
      
      return true
    } catch (error) {
      console.error('Failed to send SMS reminder:', error)
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
      
      if (this.client && process.env.TWILIO_PHONE_NUMBER) {
        await this.client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: patientPhone
        })
        console.log(`✅ SMS confirmation sent to ${patientPhone}`)
      } else {
        console.log(`[DEMO] SMS confirmation to ${patientPhone}: ${message}`)
      }
      
      return true
    } catch (error) {
      console.error('Failed to send confirmation SMS:', error)
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
        console.log(`✅ SMS sent to ${phoneNumber}`)
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

  // Send OTP code
  async sendOTP(phoneNumber: string, code: string): Promise<boolean> {
    const message = `🔐 Your verification code is: ${code}\nThis code will expire in 10 minutes.\nDo not share this code with anyone.`
    return this.sendGeneralMessage(phoneNumber, message)
  }

  // Send password reset
  async sendPasswordReset(phoneNumber: string, resetLink: string): Promise<boolean> {
    const message = `🔑 Password Reset\nClick here to reset your password: ${resetLink}\nThis link will expire in 1 hour.`
    return this.sendGeneralMessage(phoneNumber, message)
  }

  // Send welcome message
  async sendWelcomeMessage(phoneNumber: string, userName: string): Promise<boolean> {
    const message = `👋 Welcome to HealthClinic!\nHello ${userName}, your account has been created.\nYou can now book appointments and access your medical records.`
    return this.sendGeneralMessage(phoneNumber, message)
  }

  // Check if SMS service is configured
  isConfigured(): boolean {
    return !!this.client && !!process.env.TWILIO_PHONE_NUMBER
  }
}

// Singleton instance
export const smsService = new SMSService()
export default SMSService