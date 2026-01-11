import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const doctors = await prisma.user.findMany({
      where: {
        clinicId: session.user.clinicId,
        role: { in: ["DOCTOR", "NURSE"] },
        isActive: true
      },
      select: {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  doctorProfile: {
    select: {
      specialty: true
    }
  }
},

      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      doctors: doctors.map(d => ({
        id: d.id,
        name: d.name,
        specialty: d.doctorProfile?.specialty ?? d.role,
        email: d.email,
        phone: d.phone
      }))
    })
  } catch (error) {
    console.error("Failed to fetch doctors:", error)
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    )
  }
}