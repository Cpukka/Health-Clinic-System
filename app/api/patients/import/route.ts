import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import * as csv from 'csv-parse/sync'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Define interface for CSV record
interface PatientCSVRecord {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  clinicId?: string
  // Add other CSV columns as needed
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const content = await file.text()
    const records = csv.parse(content, {
      columns: true,
      skip_empty_lines: true,
    }) as PatientCSVRecord[]

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const record of records) {
      try {
        // Validate required fields
        if (!record.firstName || !record.lastName || !record.email || !record.phone) {
          throw new Error('Missing required fields')
        }

        // Prepare data according to Prisma schema
        const patientData: any = {
          firstName: record.firstName,
          lastName: record.lastName,
          phone: record.phone,
          email: record.email,
        }

        // Add optional fields only if they exist
        if (record.dateOfBirth && record.dateOfBirth.trim()) {
          patientData.dateOfBirth = new Date(record.dateOfBirth)
        }

        if (record.gender && record.gender.trim()) {
          // Convert to uppercase and validate against Prisma enum
          const gender = record.gender.toUpperCase()
          if (['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'].includes(gender)) {
            patientData.gender = gender
          } else {
            patientData.gender = 'UNKNOWN'
          }
        }

        if (record.clinicId && record.clinicId.trim()) {
          patientData.clinicId = record.clinicId
        }

        await prisma.patient.create({
          data: patientData,
        })
        results.success++
      } catch (error: any) {
        results.failed++
        results.errors.push(`Row ${results.success + results.failed}: ${error.message || 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      message: 'Import completed',
      ...results,
    })
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to process import: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}