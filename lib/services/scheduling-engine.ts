import { PrismaClient, Appointment, Prisma, Doctor } from '../app/generated/prisma/client'

export class SchedulingEngine {
  constructor(private prisma: PrismaClient) {}

  async findOptimalSlot(
    doctorId: string,
    duration: number,
    preferredDate: Date,
    maxDaysForward: number = 30
  ): Promise<Date | null> {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId, role: 'DOCTOR' },
      include: {
        doctorAvailability: true,
        appointments: {
          where: {
            scheduledFor: {
              gte: new Date(),
              lte: new Date(Date.now() + maxDaysForward * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    })

    if (!doctor?.doctorAvailability) return null

    // Get working hours
    const availability = doctor.doctorAvailability
    const workingHours = this.parseWorkingHours(availability.workingHours)

    // Check slots for next maxDaysForward days
    for (let day = 0; day < maxDaysForward; day++) {
      const currentDate = new Date(preferredDate)
      currentDate.setDate(currentDate.getDate() + day)

      // Skip weekends if doctor doesn't work
      if (!availability.worksWeekends && [0, 6].includes(currentDate.getDay())) {
        continue
      }

      const slots = this.generateTimeSlots(
        currentDate,
        workingHours,
        duration,
        doctor.appointments
      )

      if (slots.length > 0) {
        return slots[0] // Return first available slot
      }
    }

    return null
  }

  private parseWorkingHours(workingHours: any) {
    // Parse JSON working hours configuration
    return workingHours || { start: '09:00', end: '17:00' }
  }

  private generateTimeSlots(
    date: Date,
    workingHours: { start: string; end: string },
    duration: number,
    existingAppointments: Appointment[]
  ): Date[] {
    const slots: Date[] = []
    const [startHour, startMinute] = workingHours.start.split(':').map(Number)
    const [endHour, endMinute] = workingHours.end.split(':').map(Number)

    const startTime = new Date(date)
    startTime.setHours(startHour, startMinute, 0, 0)

    const endTime = new Date(date)
    endTime.setHours(endHour, endMinute, 0, 0)

    let currentSlot = new Date(startTime)

    while (currentSlot.getTime() + duration * 60000 <= endTime.getTime()) {
      const slotEnd = new Date(currentSlot.getTime() + duration * 60000)

      // Check if slot conflicts with existing appointments
      const hasConflict = existingAppointments.some((apt) => {
        const aptStart = new Date(apt.scheduledFor)
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000)
        return (
          (currentSlot >= aptStart && currentSlot < aptEnd) ||
          (slotEnd > aptStart && slotEnd <= aptEnd) ||
          (currentSlot <= aptStart && slotEnd >= aptEnd)
        )
      })

      if (!hasConflict) {
        slots.push(new Date(currentSlot))
      }

      // Move to next slot (15-minute increments)
      currentSlot.setMinutes(currentSlot.getMinutes() + 15)
    }

    return slots
  }
}