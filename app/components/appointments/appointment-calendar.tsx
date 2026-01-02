"use client"

import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"

interface Appointment {
  id: string
  patientName: string
  time: string
  type: string
  status: "scheduled" | "confirmed" | "cancelled"
}

export function AppointmentCalendar() {
  const [date, setDate] = useState<Date>()
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "1", patientName: "John Doe", time: "09:00 AM", type: "Checkup", status: "scheduled" },
    { id: "2", patientName: "Jane Smith", time: "10:30 AM", type: "Follow-up", status: "confirmed" },
    { id: "3", patientName: "Robert Johnson", time: "02:15 PM", type: "Consultation", status: "scheduled" },
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Appointment Calendar</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-60 justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between rounded-lg border border-border/40 p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="space-y-1">
              <p className="font-medium">{appointment.patientName}</p>
              <p className="text-sm text-muted-foreground">
                {appointment.time} • {appointment.type}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "rounded-full px-2 py-1 text-xs font-medium",
                appointment.status === "confirmed" ? "bg-green-500/20 text-green-700" :
                appointment.status === "cancelled" ? "bg-red-500/20 text-red-700" :
                "bg-yellow-500/20 text-yellow-700"
              )}>
                {appointment.status}
              </span>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}