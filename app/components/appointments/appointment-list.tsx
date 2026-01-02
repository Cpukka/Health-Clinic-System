"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  CalendarDays,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Types
interface Appointment {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  doctorId: string
  date: Date
  time: string
  duration: number
  status: "scheduled" | "confirmed" | "cancelled" | "completed" | "no-show"
  reason: string
  phone: string
  email?: string
  notes?: string
}

interface AppointmentListProps {
  appointments?: Appointment[]
  showFilters?: boolean
  filter?: "today" | "upcoming" | "past" | "all" // Add filter prop
  onView?: (appointment: Appointment) => void
  onEdit?: (appointment: Appointment) => void
  onDelete?: (appointmentId: string) => void
  onStatusChange?: (appointmentId: string, status: Appointment["status"]) => void
}

export function AppointmentList({
  appointments: initialAppointments,
  showFilters = true,
  filter = "all", // Default value
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: AppointmentListProps) {
  const { data: session } = useSession()
  const [appointments] = useState<Appointment[]>(
    initialAppointments || generateMockAppointments()
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [doctorFilter, setDoctorFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDoctor = doctorFilter === "all" || appointment.doctorId === doctorFilter
    
    // Apply date filter based on the filter prop
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const appointmentDate = new Date(appointment.date)
    appointmentDate.setHours(0, 0, 0, 0)
    
    let matchesDate = true
    if (filter === "today") {
      matchesDate = appointmentDate.getTime() === today.getTime()
    } else if (filter === "upcoming") {
      matchesDate = appointmentDate >= today
    } else if (filter === "past") {
      matchesDate = appointmentDate < today
    }
    // "all" doesn't filter by date

    return matchesSearch && matchesStatus && matchesDoctor && matchesDate
  })

  // Get status badge variant
  const getStatusVariant = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "scheduled":
        return "secondary"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      case "no-show":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get status icon
  const getStatusIcon = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "scheduled":
        return <ClockIcon className="h-4 w-4 mr-1" />
      case "completed":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "cancelled":
        return <XCircle className="h-4 w-4 mr-1" />
      case "no-show":
        return <XCircle className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  // Format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours)
    const period = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${period}`
  }

  // Handle status change
  const handleStatusChange = (appointmentId: string, newStatus: Appointment["status"]) => {
    if (onStatusChange) {
      onStatusChange(appointmentId, newStatus)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>
              Appointments {filter !== "all" && `(${filter.charAt(0).toUpperCase() + filter.slice(1)})`}
            </CardTitle>
            <CardDescription>
              Manage patient appointments and schedules
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar View
            </Button>
            <Button size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patients, doctors, or reasons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-45">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                  <SelectTrigger className="w-45">
                    <User className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Doctors</SelectItem>
                    <SelectItem value="doc1">Dr. Sarah Johnson</SelectItem>
                    <SelectItem value="doc2">Dr. Michael Chen</SelectItem>
                    <SelectItem value="doc3">Dr. Emma Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No {filter !== "all" ? filter : ""} appointments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{appointment.patientName}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {appointment.phone}
                        </div>
                        {appointment.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {appointment.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {appointment.doctorName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatTime(appointment.time)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.duration} min</TableCell>
                    <TableCell className="max-w-xs truncate">{appointment.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(appointment.status)}
                        className={cn(
                          "flex items-center",
                          appointment.status === "no-show" && "bg-red-100 text-red-800 hover:bg-red-100"
                        )}
                      >
                        {getStatusIcon(appointment.status)}
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onView?.(appointment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit?.(appointment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "confirmed")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "completed")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "cancelled")}>
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            Cancel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "no-show")}>
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            Mark No-Show
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete?.(appointment.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to generate mock appointments
function generateMockAppointments(): Appointment[] {
  const today = new Date()
  const appointments: Appointment[] = []

  const patients = [
    { id: "pat1", name: "John Smith", phone: "(555) 123-4567", email: "john@example.com" },
    { id: "pat2", name: "Sarah Johnson", phone: "(555) 234-5678", email: "sarah@example.com" },
    { id: "pat3", name: "Michael Chen", phone: "(555) 345-6789", email: "michael@example.com" },
    { id: "pat4", name: "Emma Wilson", phone: "(555) 456-7890", email: "emma@example.com" },
    { id: "pat5", name: "Robert Brown", phone: "(555) 567-8901", email: "robert@example.com" },
  ]

  const doctors = [
    { id: "doc1", name: "Dr. Sarah Johnson" },
    { id: "doc2", name: "Dr. Michael Chen" },
    { id: "doc3", name: "Dr. Emma Wilson" },
  ]

  const reasons = [
    "Regular Checkup",
    "Follow-up Visit",
    "Vaccination",
    "Emergency Consultation",
    "Blood Test",
    "X-Ray",
    "Physical Therapy",
    "Dental Cleaning",
  ]

  const statuses: Appointment["status"][] = ["scheduled", "confirmed", "completed", "cancelled", "no-show"]

  // Generate appointments for different dates
  for (let i = 0; i < 15; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)]
    const doctor = doctors[Math.floor(Math.random() * doctors.length)]
    
    // Create dates: some today, some future, some past
    const date = new Date(today)
    if (i < 5) {
      // Today's appointments
      date.setDate(today.getDate())
    } else if (i < 10) {
      // Upcoming appointments
      date.setDate(today.getDate() + Math.floor(Math.random() * 14) + 1)
    } else {
      // Past appointments
      date.setDate(today.getDate() - Math.floor(Math.random() * 14) - 1)
    }

    appointments.push({
      id: `appt-${i + 1}`,
      patientName: patient.name,
      patientId: patient.id,
      doctorName: doctor.name,
      doctorId: doctor.id,
      date,
      time: `${Math.floor(Math.random() * 12) + 8}:${Math.random() > 0.5 ? "30" : "00"}`,
      duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      phone: patient.phone,
      email: patient.email,
      notes: Math.random() > 0.7 ? "Patient requires special attention" : undefined,
    })
  }

  return appointments
}