"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Calendar, Clock, User, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { format } from "date-fns"

const appointments = [
  {
    id: "1",
    patientName: "John Doe",
    time: new Date(Date.now() + 2 * 60 * 60 * 1000),
    type: "General Checkup",
    status: "scheduled" as const,
    doctor: "Dr. Sarah Johnson",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    time: new Date(Date.now() + 4 * 60 * 60 * 1000),
    type: "Follow-up",
    status: "confirmed" as const,
    doctor: "Dr. Michael Chen",
  },
  {
    id: "3",
    patientName: "Robert Wilson",
    time: new Date(Date.now() + 6 * 60 * 60 * 1000),
    type: "Consultation",
    status: "scheduled" as const,
    doctor: "Dr. Emily Davis",
  },
]

export function UpcomingAppointments() {
  const handleAction = (action: string, appointmentId: string) => {
    console.log(`${action} appointment ${appointmentId}`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Today&apos;s schedule</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{appointment.patientName}</p>
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : "outline"
                      }
                      className={
                        appointment.status === "confirmed"
                          ? "bg-green-500/20 text-green-700 hover:bg-green-500/20"
                          : ""
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {format(appointment.time, "h:mm a")}
                    </div>
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      {appointment.doctor}
                    </div>
                    <span>• {appointment.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  Details
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleAction("confirm", appointment.id)}
                    >
                      Confirm Appointment
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("reschedule", appointment.id)}
                    >
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("cancel", appointment.id)}
                      className="text-red-600"
                    >
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
        
        {appointments.length === 0 && (
          <div className="py-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No appointments scheduled</p>
            <Button className="mt-4" variant="outline">
              Schedule Appointment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}