import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs/promises'
import { Patient, Appointment, MedicalRecord } from '../app/generated/prisma/client'

export class ReportGenerator {
  async generatePatientReport(
    patient: Patient & {
      appointments: Appointment[]
      medicalRecords: MedicalRecord[]
    }
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    const { width, height } = page.getSize()
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    // Header
    page.drawText('MEDICAL REPORT - CONFIDENTIAL', {
      x: 50,
      y: height - 50,
      size: 16,
      font: boldFont,
      color: rgb(0, 0.4, 0.6),
    })
    
    // Patient Info
    page.drawText(`Patient: ${patient.firstName} ${patient.lastName}`, {
      x: 50,
      y: height - 100,
      size: 12,
      font: boldFont,
    })
    
    page.drawText(`Date of Birth: ${patient.dateOfBirth.toLocaleDateString()}`, {
      x: 50,
      y: height - 120,
      size: 10,
      font,
    })
    
    page.drawText(`Blood Type: ${patient.bloodType || 'Not specified'}`, {
      x: 50,
      y: height - 140,
      size: 10,
      font,
    })
    
    // Medical Records
    let yPosition = height - 180
    page.drawText('Medical History:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: boldFont,
    })
    
    yPosition -= 30
    
    for (const record of patient.medicalRecords.slice(0, 5)) {
      page.drawText(`${record.visitDate.toLocaleDateString()}: ${record.diagnosis}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font,
      })
      yPosition -= 20
    }
    
    // Appointments Summary
    yPosition -= 30
    page.drawText('Recent Appointments:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: boldFont,
    })
    
    yPosition -= 30
    
    const recentAppointments = patient.appointments
      .sort((a, b) => b.scheduledFor.getTime() - a.scheduledFor.getTime())
      .slice(0, 5)
    
    for (const appointment of recentAppointments) {
      page.drawText(
        `${appointment.scheduledFor.toLocaleDateString()} - ${appointment.reason || 'Checkup'}`,
        {
          x: 70,
          y: yPosition,
          size: 10,
          font,
        }
      )
      yPosition -= 20
    }
    
    // Footer
    page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: 50,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    })
    
    page.drawText('Electronic Health Record System - Confidential Document', {
      x: 150,
      y: 30,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    })
    
    const pdfBytes = await pdfDoc.save()
    return Buffer.from(pdfBytes)
  }
  
  async saveReportToFile(patientId: string, buffer: Buffer): Promise<string> {
    const filename = `report_${patientId}_${Date.now()}.pdf`
    const path = `./reports/${filename}`
    await fs.writeFile(path, buffer)
    return path
  }
}