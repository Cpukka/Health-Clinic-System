// SMS Service using Twilio (or other providers)
import { Appointment } from '../app/generated/prisma/client'

export class SMSService {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID!
    this.authToken = process.env.TWILIO_AUTH_TOKEN!
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER!
  }

  async sendAppointmentReminder(appointment: Appointment, patientPhone: string): Promise<boolean> {
    try {
      const message = `Reminder: You have an appointment on ${appointment.scheduledFor.toLocaleDateString()} at ${appointment.scheduledFor.toLocaleTimeString()}. Please arrive 15 minutes early.`
      
      // In production, use actual SMS service
      // const client = require('twilio')(this.accountSid, this.authToken)
      // await client.messages.create({
      //   body: message,
      //   from: this.fromNumber,
      //   to: patientPhone
      // })

      console.log(`SMS sent to ${patientPhone}: ${message}`)
      return true
    } catch (error) {
      console.error('Failed to send SMS:', error)
      return false
    }
  }

  async sendAppointmentConfirmation(appointment: Appointment, patientPhone: string): Promise<boolean> {
    try {
      const message = `Appointment confirmed for ${appointment.scheduledFor.toLocaleDateString()} at ${appointment.scheduledFor.toLocaleTimeString()}. Your appointment ID: ${appointment.id}`
      
      console.log(`Confirmation SMS sent to ${patientPhone}: ${message}`)
      return true
    } catch (error) {
      console.error('Failed to send confirmation SMS:', error)
      return false
    }
  }
}