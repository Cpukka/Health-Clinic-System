"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { Calendar } from "@/app/components/ui/calendar"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command"
import { toast } from "sonner"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, User, Search, Check, Loader2 } from "lucide-react"

interface AppointmentFormProps {
  initialData?: {
    id?: string
    patientId: string
    patientName: string
    doctorId: string
    reason: string
    notes: string
    duration: number
    appointmentType: string
    insuranceId?: string
    scheduledFor?: Date
    status?: string
  }
  patients: Array<{
    id: string
    name: string
    email?: string
    phone?: string
  }>
  doctors: Array<{
    id: string
    name: string
    specialty?: string
  }>
  onSubmit: (data: AppointmentFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  mode?: "create" | "edit"
}

export interface AppointmentFormData {
  patientId: string
  patientName: string
  doctorId: string
  reason: string
  notes: string
  duration: number
  appointmentType: string
  insuranceId?: string
  scheduledFor: Date
  status?: string
}

const appointmentTypes = [
  { value: "consultation", label: "Consultation" },
  { value: "followup", label: "Follow-up" },
  { value: "emergency", label: "Emergency" },
  { value: "labtest", label: "Lab Test" },
  { value: "procedure", label: "Procedure" },
  { value: "vaccination", label: "Vaccination" },
  { value: "checkup", label: "Routine Checkup" },
]

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
]

const durationOptions = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 90, label: "90 minutes" },
  { value: 120, label: "2 hours" },
]

export default function AppointmentForm({
  initialData,
  patients,
  doctors,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create"
}: AppointmentFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [showPatientDialog, setShowPatientDialog] = useState(false)
  const [date, setDate] = useState<Date | undefined>(
    initialData?.scheduledFor || new Date()
  )
  const [time, setTime] = useState<string>(
    initialData?.scheduledFor ? format(initialData.scheduledFor, "HH:mm") : "09:00"
  )
  
  const [formData, setFormData] = useState({
    patientId: initialData?.patientId || "",
    patientName: initialData?.patientName || "",
    doctorId: initialData?.doctorId || "",
    reason: initialData?.reason || "",
    notes: initialData?.notes || "",
    duration: initialData?.duration.toString() || "30",
    appointmentType: initialData?.appointmentType || "consultation",
    insuranceId: initialData?.insuranceId || "",
  })

  // Set time from initial data
  useEffect(() => {
    if (initialData?.scheduledFor) {
      setTime(format(initialData.scheduledFor, "HH:mm"))
    }
  }, [initialData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSelectPatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientId: patient.id,
        patientName: patient.name
      }))
      setShowPatientDialog(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const appointmentData: AppointmentFormData = {
        patientId: formData.patientId,
        patientName: formData.patientName,
        doctorId: formData.doctorId,
        reason: formData.reason,
        notes: formData.notes,
        duration: parseInt(formData.duration),
        appointmentType: formData.appointmentType,
        insuranceId: formData.insuranceId || undefined,
        scheduledFor: combineDateTime(date!, time),
        status: mode === "edit" ? initialData?.status : "scheduled"
      }

      await onSubmit(appointmentData)
      
      // Reset form after successful submission in create mode
      if (mode === "create") {
        resetForm()
      }
      
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const validateForm = () => {
    const errors = []

    if (!formData.patientId) {
      errors.push("Please select a patient")
    }
    if (!formData.doctorId) {
      errors.push("Please select a doctor")
    }
    if (!date) {
      errors.push("Please select a date")
    }
    if (!time) {
      errors.push("Please select a time")
    }
    if (!formData.reason.trim()) {
      errors.push("Please provide a reason for visit")
    }

    if (errors.length > 0) {
      toast.error(errors[0])
      return false
    }

    // Check if date/time is in the past
    const selectedDateTime = combineDateTime(date!, time)
    if (selectedDateTime < new Date()) {
      toast.error("Cannot schedule appointment in the past")
      return false
    }

    return true
  }

  const combineDateTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const newDate = new Date(date)
    newDate.setHours(hours, minutes, 0, 0)
    return newDate
  }

  const resetForm = () => {
    setFormData({
      patientId: "",
      patientName: "",
      doctorId: "",
      reason: "",
      notes: "",
      duration: "30",
      appointmentType: "consultation",
      insuranceId: "",
    })
    setDate(new Date())
    setTime("09:00")
    setStep(1)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Patient</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose an existing patient
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label htmlFor="patient-search">Search Patients</Label>
                    <div className="flex gap-2 mt-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="patient-search"
                          placeholder="Search by name, ID, or phone..."
                          className="pl-10"
                          value={formData.patientName}
                          onChange={(e) => handleInputChange("patientName", e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <Popover open={showPatientDialog} onOpenChange={setShowPatientDialog}>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" disabled={isLoading}>
                            <Search className="mr-2 h-4 w-4" />
                            Browse
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-75 p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search patients..." />
                            <CommandList>
                              <CommandEmpty>No patients found.</CommandEmpty>
                              <CommandGroup>
                                {patients.map((patient) => (
                                  <CommandItem
                                    key={patient.id}
                                    onSelect={() => handleSelectPatient(patient.id)}
                                    className="cursor-pointer"
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        formData.patientId === patient.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    />
                                    <div>
                                      <p className="font-medium">{patient.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {patient.id} {patient.phone && `• ${patient.phone}`}
                                      </p>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {formData.patientId && (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{formData.patientName}</h4>
                          <p className="text-sm text-muted-foreground">
                            ID: {formData.patientId}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">Selected</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Schedule Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set date, time, and appointment type
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <div className="mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          disabled={isLoading}
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label htmlFor="time">Time *</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={time === slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTime(slot)}
                        disabled={isLoading}
                        className="justify-center"
                      >
                        <Clock className="mr-2 h-3 w-3" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => handleInputChange("duration", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="appointmentType">Appointment Type *</Label>
                  <Select
                    value={formData.appointmentType}
                    onValueChange={(value) => handleInputChange("appointmentType", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="doctor">Doctor *</Label>
                  <Select
                    value={formData.doctorId}
                    onValueChange={(value) => handleInputChange("doctorId", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex flex-col">
                            <span>{doctor.name}</span>
                            {doctor.specialty && (
                              <span className="text-xs text-muted-foreground">
                                {doctor.specialty}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="insurance">Insurance (Optional)</Label>
                  <Input
                    id="insurance"
                    placeholder="Insurance provider or ID"
                    value={formData.insuranceId}
                    onChange={(e) => handleInputChange("insuranceId", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Visit Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Provide details about the visit
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Annual checkup, Follow-up consultation, Symptoms..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements, symptoms, or important information..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-muted/50">
              <h4 className="font-semibold mb-2">Appointment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-medium">{formData.patientName || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">
                    {doctors.find(d => d.id === formData.doctorId)?.name || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">
                    {date ? format(date, "MMM d, yyyy") : "Not selected"} at {time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{formData.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">
                    {appointmentTypes.find(t => t.value === formData.appointmentType)?.label}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Estimated Cost:</span>
                  <span>
                    {(() => {
                      const baseRate = 100
                      const durationMultiplier = parseInt(formData.duration) / 30
                      return `$${(baseRate * durationMultiplier).toFixed(2)}`
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Steps */}
      {mode === "create" && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step === stepNumber
                      ? "bg-primary text-primary-foreground"
                      : step > stepNumber
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                <span className="mt-2 text-sm">
                  {stepNumber === 1 && "Patient"}
                  {stepNumber === 2 && "Schedule"}
                  {stepNumber === 3 && "Details"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        {mode === "create" ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => step > 1 && setStep((step - 1) as 1 | 2 | 3)}
              disabled={step === 1 || isLoading}
            >
              Previous
            </Button>

            {step < 3 ? (
              <Button 
                type="button"
                onClick={() => setStep((step + 1) as 1 | 2 | 3)}
                disabled={isLoading}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  mode === "create" ? "Schedule Appointment" : "Update Appointment"
                )}
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Appointment"
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  )
}