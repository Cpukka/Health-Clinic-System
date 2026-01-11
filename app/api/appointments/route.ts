import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { SMSService } from "@/lib/services/sms-service"

export async function GET(request: NextRequest) {
  // ... existing GET code ...
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "DOCTOR", "NURSE"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = ["patientId", "doctorId", "scheduledFor", "duration"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check for scheduling conflicts
    const appointmentTime = new Date(data.scheduledFor)
    const appointmentEnd = new Date(appointmentTime.getTime() + data.duration * 60000)

    const conflictingAppointments = await prisma.appointment.findMany({
      where: {
        OR: [
          {
            doctorId: data.doctorId,
            scheduledFor: {
              lt: appointmentEnd,
              gt: new Date(appointmentTime.getTime() - data.duration * 60000)
            },
            status: { in: ["SCHEDULED", "CONFIRMED"] }
          },
          {
            patientId: data.patientId,
            scheduledFor: {
              lt: appointmentEnd,
              gt: new Date(appointmentTime.getTime() - data.duration * 60000)
            },
            status: { in: ["SCHEDULED", "CONFIRMED"] }
          }
        ]
      }
    })

    if (conflictingAppointments.length > 0) {
      return NextResponse.json(
        { 
          error: "Scheduling conflict detected",
          details: "Doctor or patient already has an appointment at this time"
        },
        { status: 409 }
      )
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        clinicId: session.user.clinicId!,
        scheduledFor: appointmentTime,
        endTime: appointmentEnd,
        status: data.status || "SCHEDULED",
        type: data.type || "CONSULTATION"
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
       doctor: {
  select: {
    id: true,
    name: true,
    doctorProfile: {
      select: {
        specialty: true
      }
    }
  }
},

        clinic: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "APPOINTMENT_CREATE",
        entityId: appointment.id,
        entityType: "Appointment",
        details: {
          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          doctorName: appointment.doctor.name,
          scheduledFor: appointment.scheduledFor
        }
      }
    })

    // Send confirmation SMS
    try {
      const smsService = new SMSService()
      await smsService.sendAppointmentConfirmation(appointment, appointment.patient.phone)
      console.log("Appointment confirmation SMS sent successfully")
    } catch (smsError) {
      console.error("Failed to send SMS, but appointment was created:", smsError)
      // Continue even if SMS fails
    }

    // Schedule reminder (create reminder record - you'll need a cron job to process these)
    const reminderTime = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000) // 24 hours before
    await prisma.appointmentReminder.create({
      data: {
        appointmentId: appointment.id,
        scheduledFor: reminderTime,
         status: "pending" // optional, default already handles this
    // sentAt is null by default
      }
    })

    return NextResponse.json({ 
      success: true,
      appointment,
      message: "Appointment created successfully"
    }, { status: 201 })
    
  } catch (error: any) {
    console.error("Failed to create appointment:", error)
    return NextResponse.json(
      { 
        error: "Failed to create appointment",
        details: error.message 
      },
      { status: 500 }
    )
  }
}