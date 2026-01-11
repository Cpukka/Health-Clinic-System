"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { AlertCircle, ArrowLeft } from "lucide-react"
import AppointmentForm, { AppointmentFormData } from "@/app/components/appointments/appointment-form"
import { toast } from "sonner"

export default function NewAppointmentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Fetch patients and doctors
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patients
        const patientsResponse = await fetch('/api/patients')
        if (patientsResponse.ok) {
          const patientsData = await patientsResponse.json()
          setPatients(patientsData.patients || [])
        }

        // Fetch doctors
        const doctorsResponse = await fetch('/api/doctors')
        if (doctorsResponse.ok) {
          const doctorsData = await doctorsResponse.json()
          setDoctors(doctorsData.doctors || [])
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to load form data")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: data.patientId,
          doctorId: data.doctorId,
          scheduledFor: data.scheduledFor.toISOString(),
          duration: data.duration,
          reason: data.reason,
          notes: data.notes,
          type: data.appointmentType.toUpperCase(),
          insuranceProvider: data.insuranceId ? "Provider" : undefined,
          insuranceId: data.insuranceId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create appointment')
      }

      toast.success("Appointment created successfully!")
      
      // Redirect to appointments list
      router.push("/appointments")
      
    } catch (error: any) {
      console.error("Failed to create appointment:", error)
      
      // Handle scheduling conflicts
      if (error.message.includes("conflict")) {
        toast.error("Scheduling conflict: Doctor or patient already has an appointment at this time")
      } else {
        toast.error(error.message || "Failed to create appointment. Please try again.")
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/appointments")
      }
    } else {
      router.push("/appointments")
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading form data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBackClick}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">New Appointment</h2>
            <p className="text-muted-foreground">
              Schedule a new appointment for a patient
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">New</Badge>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-700" />
            <p className="text-sm font-medium text-yellow-700">
              You have unsaved changes
            </p>
          </div>
          <p className="mt-1 text-sm text-yellow-600">
            Please save or discard your changes before leaving this page.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Schedule Appointment</CardTitle>
          <CardDescription>
            Complete all steps to schedule a new appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentForm
            patients={patients.map((p: any) => ({
              id: p.id,
              name: `${p.firstName} ${p.lastName}`,
              email: p.email,
              phone: p.phone
            }))}
            doctors={doctors.map((d: any) => ({
              id: d.id,
              name: d.name,
              specialty: d.specialty
            }))}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            mode="create"
          />
        </CardContent>
      </Card>
    </div>
  )
}