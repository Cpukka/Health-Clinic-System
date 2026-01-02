import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import * as csv from 'csv-parse/sync'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
    })

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const record of records) {
      try {
        await prisma.patient.create({
          data: {
            firstName: record.firstName,
            lastName: record.lastName,
            dateOfBirth: new Date(record.dateOfBirth),
            gender: record.gender.toUpperCase(),
            phone: record.phone,
            email: record.email,
            clinicId: record.clinicId,
            // Add other fields as needed
          },
        })
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Row ${results.success + results.failed}: ${error.message}`)
      }
    }

    return NextResponse.json({
      message: 'Import completed',
      ...results,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to process import' },
      { status: 500 }
    )
  }
}