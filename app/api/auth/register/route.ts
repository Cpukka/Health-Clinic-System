import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import  prisma  from '@/lib/prisma'

export async function POST(request: NextRequest) {
  console.log('Registration API called')
  
  try {
    const body = await request.json()
    console.log('Registration body:', { ...body, password: '[HIDDEN]' })

    const { email, password, name, role = 'PATIENT', phone = '', clinicCode } = body

    // Basic validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Clinic code validation for non-patients
    if (role !== 'PATIENT') {
      if (!clinicCode) {
        return NextResponse.json(
          { error: 'Clinic access code is required for staff registration' },
          { status: 400 }
        )
      }
      
      // In production, validate against database
      const validCodes = process.env.CLINIC_CODES?.split(',') || ['CLINIC2024', 'MEDICAL123']
      if (!validCodes.includes(clinicCode)) {
        return NextResponse.json(
          { error: 'Invalid clinic access code' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user - according to your schema
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim(),
        password: hashedPassword,
        role: role as any, // Type assertion since role is enum
        phone: phone.trim() || null,
        // Note: No emailVerified field in your schema
      }
    })

    console.log('User created successfully:', user.id)

    // Create audit log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED',
          entityId: user.id,
          entityType: 'USER',
          details: {
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString(),
          },
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          compliance: 'HIPAA',
        },
      })
    } catch (auditError) {
      console.error('Failed to create audit log:', auditError)
      // Continue even if audit log fails
    }

    // Return success without password
    const { password: _, ...safeUser } = user

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: safeUser
    }, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      )
    }
    
    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}