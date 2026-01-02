"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Calendar } from "@/app/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Badge } from "@/app/components/ui/badge" // Import Badge component
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope, 
  Loader2, 
  Search,
  Plus // Import Plus icon
} from "lucide-react"

interface NewAppointmentFormProps {
  patientId?: string
  patientName?: string
  doctorId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function NewAppointmentForm({ 
  patientId, 
  patientName, 
  doctorId, 
  onSuccess, 
  onCancel 
}: NewAppointmentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    patientId: patientId || "",
    patientName: patientName || "",
    doctorId: doctorId || "",
    doctorName: "",
    date: new Date(),
    time: "09:00",
    duration: "30",
    type: "consultation",
    reason: "",
    notes: "",
    sendReminder: true,
  })

  // Fetch patients and doctors on mount
  useEffect(() => {
    fetchPatients()
    fetchDoctors()
    
    // If patientId is provided, set it in form
    if (patientId && patientName) {
      setFormData(prev => ({
        ...prev,
        patientId,
        patientName
      }))
    }
    
    // If doctorId is provided, set it in form
    if (doctorId) {
      const fetchDoctorName = async () => {
        // In a real app, fetch doctor details
        setFormData(prev => ({
          ...prev,
          doctorId,
          doctorName: "Doctor Name" // Placeholder
        }))
      }
      fetchDoctorName()
    }
  }, [patientId, patientName, doctorId])

  const fetchPatients = async () => {
    try {
      // In a real app, this would be an API call
      setPatients([
        { id: "pat-001", name: "John Smith", phone: "(555) 123-4567" },
        { id: "pat-002", name: "Sarah Johnson", phone: "(555) 234-5678" },
        { id: "pat-003", name: "Michael Chen", phone: "(555) 345-6789" },
        { id: "pat-004", name: "Emma Wilson", phone: "(555) 456-7890" },
        { id: "pat-005", name: "Robert Brown", phone: "(555) 567-8901" },
      ])
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const fetchDoctors = async () => {
    try {
      // In a real app, this would be an API call
      const fetchedDoctors = [
        { id: "doc-001", name: "Dr. Sarah Johnson", specialty: "General Medicine" },
        { id: "doc-002", name: "Dr. Michael Chen", specialty: "Cardiology" },
        { id: "doc-003", name: "Dr. Emma Wilson", specialty: "Pediatrics" },
        { id: "doc-004", name: "Dr. James Miller", specialty: "Orthopedics" },
        { id: "doc-005", name: "Dr. Lisa Garcia", specialty: "Dermatology" },
      ]
      setDoctors(fetchedDoctors)
      
      // If doctorId was provided but not found in local state, add it
      if (doctorId && !fetchedDoctors.find(d => d.id === doctorId)) {
        setDoctors(prev => [...prev, { id: doctorId, name: "Assigned Doctor", specialty: "Unknown" }])
      }
    } catch (error) {
      console.error("Error fetching doctors:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
        throw new Error("Please fill in all required fields")
      }

      // Validate time is in correct format
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(formData.time)) {
        throw new Error("Invalid time format")
      }

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: format(formData.date, "yyyy-MM-dd"),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create appointment")
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/appointments")
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    if (patient) {
      setFormData(prev => ({ 
        ...prev, 
        patientId: patient.id,
        patientName: patient.name
      }))
    }
  }

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId)
    if (doctor) {
      setFormData(prev => ({ 
        ...prev, 
        doctorId: doctor.id,
        doctorName: doctor.name
      }))
    }
  }

  // Generate time slots
  const timeSlots = []
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeSlots.push(time)
    }
  }

  // Filter patients based on search
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule New Appointment</CardTitle>
        <CardDescription>
          Book an appointment for a patient with a healthcare provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Patient Information</Label>
              {formData.patientId && (
                <Badge variant="outline" className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Selected: {formData.patientName}
                </Badge>
              )}
            </div>

            {!patientId && (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPatients.map((patient) => (
                    <Card
                      key={patient.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary",
                        formData.patientId === patient.id && "border-primary bg-primary/5"
                      )}
                      onClick={() => handlePatientSelect(patient.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.phone}</p>
                          <p className="text-xs text-muted-foreground">ID: {patient.id}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push("/patients/new")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Patient
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Doctor Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Doctor / Healthcare Provider</Label>
            <Select 
              value={formData.doctorId} 
              onValueChange={(value) => handleDoctorSelect(value)}
            >
              <SelectTrigger>
                <Stethoscope className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select a doctor">
                  {formData.doctorId && formData.doctorName 
                    ? formData.doctorName 
                    : "Select a doctor"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex flex-col">
                      <span>{doctor.name}</span>
                      <span className="text-xs text-muted-foreground">{doctor.specialty}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.doctorId && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Available: Mon-Fri, 9:00 AM - 5:00 PM</span>
              </div>
            )}
          </div>

          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                    initialFocus
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Time & Duration</Label>
                <span className="text-sm text-muted-foreground">
                  {formData.time} ({formData.duration} min)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select 
                    value={formData.time} 
                    onValueChange={(value) => handleSelectChange("time", value)}
                  >
                    <SelectTrigger>
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select 
                    value={formData.duration} 
                    onValueChange={(value) => handleSelectChange("duration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Appointment Details</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="checkup">Regular Checkup</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="lab-test">Lab Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sendReminder">Send Reminder</Label>
                <Select 
                  value={formData.sendReminder ? "yes" : "no"} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sendReminder: value === "yes" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Send reminder?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, send SMS & Email</SelectItem>
                    <SelectItem value="no">No reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="Brief reason for the appointment..."
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any special instructions or notes..."
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          {/* Confirmation Summary */}
          {formData.patientId && formData.doctorId && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Appointment Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Patient</p>
                    <p className="font-medium">{formData.patientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Doctor</p>
                    <p className="font-medium">{formData.doctorName || "Not selected"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {format(formData.date, "MMM dd, yyyy")} at {formData.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{formData.duration} minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || (() => router.back())}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.patientId || !formData.doctorId}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Appointment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}