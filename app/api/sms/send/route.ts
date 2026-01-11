import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SMSService } from "@/lib/services/sms-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "DOCTOR", "NURSE"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { to, message, appointmentId } = await request.json()

    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing required fields: 'to' and 'message' are required" },
        { status: 400 }
      )
    }

    const smsService = new SMSService()
    const success = await smsService.sendGeneralMessage(to, message)

    if (success) {
      // Log the SMS if it was related to an appointment
      if (appointmentId) {
        // You could log this in your database
        console.log(`SMS sent for appointment ${appointmentId} to ${to}`)
      }

      return NextResponse.json({
        success: true,
        message: "SMS sent successfully",
        demoMode: !smsService.isConfigured()
      })
    } else {
      return NextResponse.json(
        { error: "Failed to send SMS" },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error("Failed to send SMS:", error)
    return NextResponse.json(
      { error: "Failed to send SMS", details: error.message },
      { status: 500 }
    )
  }
}