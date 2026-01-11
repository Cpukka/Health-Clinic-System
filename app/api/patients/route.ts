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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "all"

    const skip = (page - 1) * limit

    let where: any = {}

    if (session.user.clinicId) {
      where.clinicId = session.user.clinicId
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          clinic: {
            select: { name: true }
          },
          hmo: {
            select: { name: true }
          },
          _count: {
            select: { appointments: true, medicalRecords: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.patient.count({ where })
    ])

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Failed to fetch patients:", error)
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    )
  }
}