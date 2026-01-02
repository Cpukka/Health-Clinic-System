// prisma/seed.ts - Updated import
import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Create HMO
  const hmo = await prisma.hMO.create({
    data: {
      name: 'Premium Health HMO',
      contactEmail: 'contact@premiumhealth.com',
      contactPhone: '+2348051667890',
    },
  })

  // Create Clinic
  const clinic = await prisma.clinic.create({
    data: {
      name: 'City Medical Center',
      address: '123 Main St, City, State 12345',
      phone: '+1234567891',
      email: 'contact@citymedical.com',
      description: 'Full-service medical center',
    },
  })

  // Link Clinic and HMO
  await prisma.clinicHMO.create({
    data: {
      clinicId: clinic.id,
      hmoId: hmo.id,
    },
  })

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@clinic.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      clinicId: clinic.id,
    },
  })

  // Create Doctor
  const doctorPassword = await bcrypt.hash('doctor123', 10)
  await prisma.user.create({
    data: {
      email: 'doctor@clinic.com',
      password: doctorPassword,
      name: 'Dr. Sarah Johnson',
      role: 'DOCTOR',
      clinicId: clinic.id,
      phone: '+1234567892',
    },
  })

  // Create Patient
  const patientUser = await prisma.user.create({
    data: {
      email: 'patient@example.com',
      password: await bcrypt.hash('patient123', 10),
      name: 'John Doe',
      role: 'PATIENT',
      phone: '+1234567893',
    },
  })

  await prisma.patient.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'MALE',
      phone: '+1234567893',
      email: 'john.doe@example.com',
      userId: patientUser.id,
      clinicId: clinic.id,
      hmoId: hmo.id,
    },
  })

  console.log('✅ Seed data created successfully!')
  console.log('\n=== LOGIN CREDENTIALS ===')
  console.log('Admin: admin@clinic.com / admin123')
  console.log('Doctor: doctor@clinic.com / doctor123')
  console.log('Patient: patient@example.com / patient123')
  console.log('========================')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })