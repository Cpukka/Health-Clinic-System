import { z } from "zod"

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  scheduledFor: z.string().datetime("Invalid date"),
  duration: z.number().min(5).max(240),
  reason: z.string().min(1, "Reason is required").max(500),
  notes: z.string().max(1000).optional(),
  status: z.enum(["SCHEDULED", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
})

export const updateAppointmentSchema = appointmentSchema.partial()