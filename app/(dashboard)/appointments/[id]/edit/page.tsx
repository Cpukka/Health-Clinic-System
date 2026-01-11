"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { AlertCircle, ArrowLeft } from "lucide-react"
import AppointmentForm, { AppointmentFormData } from "@/app/components/appointments/appointment-form"
import { toast } from "sonner"

// Mock data - replace with API calls
const mockDoctors = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "General Practitioner" },
  { id: "2", name: "Dr. Michael Chen", specialty: "Cardiology" },
  { id: "3", name: "Dr. Emily Rodriguez", specialty: "Pediatrics" },
  { id: "4", name: "Dr. James Wilson", specialty: "Orthopedics" },
  { id: "5", name: "Dr. Lisa Wong", specialty: "Dermatology" },
]

const mockPatients = [
  { id: "P001", name: "John Doe", email: "john@example.com", phone: "+1 (555) 123-4567" },
  { id: "P002", name: "Jane Smith", email: "jane@example.com", phone: "+1 (555) 987-6543" },
  { id: "P003", name: "Robert Johnson", email: "robert@example.com", phone: "+1 (555) 456-7890" },
  { id: "P004", name: "Maria Garcia", email: "maria@example.com", phone: "+1 (555) 234-5678" },
  { id: "P005", name: "David Lee", email: "david@example.com", phone: "+1 (555) 876-5432" },
]

const mockAppointment = {
  id: "APT001",
  patientId: "P001",
  patientName: "John Doe",
  doctorId: "1",
  reason: "Annual checkup",
  notes: "Patient has history of hypertension",
  duration: 30,
  appointmentType: "consultation",
  insuranceId: "INS12345",
  scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
  status: "scheduled"
}

export default function EditAppointmentPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [appointment, setAppointment] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    // Fetch appointment data
    const fetchAppointment = async () => {
      setIsLoadingData(true)
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        setAppointment(mockAppointment)
      } catch (error) {
        console.error("Failed to fetch appointment:", error)
        toast.error("Failed to load appointment")
        router.push("/appointments")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchAppointment()
  }, [params.id, router])

  const handleSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true)
    try {
      console.log("Updating appointment:", params.id, data)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Appointment updated successfully!")
      
      // Redirect to appointment detail
      router.push(`/appointments/${params.id}`)
      
    } catch (error) {
      console.error("Failed to update appointment:", error)
      toast.error("Failed to update appointment. Please try again.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push(`/appointments/${params.id}`)
      }
    } else {
      router.push(`/appointments/${params.id}`)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading appointment...</p>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="mt-4 text-lg font-semibold">Appointment not found</h3>
        <p className="mt-2 text-muted-foreground">
          The appointment you're trying to edit doesn't exist.
        </p>
        <button
          onClick={() => router.push("/appointments")}
          className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Back to Appointments
        </button>
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
            <h2 className="text-3xl font-bold tracking-tight">Edit Appointment</h2>
            <p className="text-muted-foreground">
              Update appointment details for {appointment.patientName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Editing</Badge>
          <Badge variant={
            appointment.status === "confirmed" ? "default" :
            appointment.status === "cancelled" ? "destructive" : "outline"
          }>
            {appointment.status}
          </Badge>
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
          <CardTitle>Update Appointment</CardTitle>
          <CardDescription>
            Make changes to the appointment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentForm
            initialData={appointment}
            patients={mockPatients}
            doctors={mockDoctors}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/appointments/${params.id}`)}
            isLoading={isLoading}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  )
}