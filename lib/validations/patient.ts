import { z } from "zod"

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  dateOfBirth: z.string().datetime("Invalid date of birth"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().min(10, "Invalid phone number").max(15),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().max(200).optional(),
  emergencyContact: z.string().max(15).optional(),
  bloodType: z.string().max(5).optional(),
  allergies: z.string().max(500).optional(),
  hmoId: z.string().optional(),
  userId: z.string().optional(),
})

export const medicalRecordSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  visitDate: z.string().datetime("Invalid date"),
  diagnosis: z.string().min(1, "Diagnosis is required").max(500),
  prescription: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  attachments: z.array(z.string()).optional(),
})