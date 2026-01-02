import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import  prisma  from "@/lib/prisma"
import { SMSService } from "@/lib/services/sms-service"


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "today"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)

    let where: any = {
      clinicId: session.user.clinicId
    }

    switch (filter) {
      case "today":
        where.scheduledFor = {
          gte: startOfToday,
          lt: endOfToday
        }
        break
      case "upcoming":
        where.scheduledFor = { gt: now }
        where.status = { in: ["SCHEDULED", "CONFIRMED"] }
        break
      case "past":
        where.scheduledFor = { lt: now }
        break
      // "all" - no date filter
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
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
              name: true
            }
          },
          clinic: {
            select: {
              name: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { scheduledFor: "asc" }
      }),
      prisma.appointment.count({ where })
    ])

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Failed to fetch appointments:", error)
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    )
  }
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
          // Doctor has conflicting appointment
          {
            doctorId: data.doctorId,
            scheduledFor: {
              lt: appointmentEnd,
              gt: new Date(appointmentTime.getTime() - data.duration * 60000)
            },
            status: { in: ["SCHEDULED", "CONFIRMED"] }
          },
          // Patient has conflicting appointment
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
          conflicts: conflictingAppointments 
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
        status: data.status || "SCHEDULED"
      },
      include: {
        patient: true,
        doctor: true
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

    // Schedule SMS reminder (24 hours before)
    const reminderTime = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000)
    await prisma.appointmentReminder.create({
      data: {
        appointmentId: appointment.id,
        scheduledFor: reminderTime
      }
    })

    // Send confirmation SMS
    const smsService = new SMSService()
    await smsService.sendAppointmentConfirmation(appointment, appointment.patient.phone)

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    console.error("Failed to create appointment:", error)
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    )
  }
}