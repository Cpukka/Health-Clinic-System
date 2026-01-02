"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  Printer,
  Send,
  ArrowLeft,
} from "lucide-react"
import { format } from "date-fns"

export default function AppointmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [appointment, setAppointment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)

  useEffect(() => {
    // Fetch appointment details
    const fetchAppointment = async () => {
      setIsLoading(true)
      try {
        // In production, fetch from API
        const mockAppointment = {
          id: params.id,
          patientName: "John Doe",
          patientId: "P001",
          doctorName: "Dr. Sarah Johnson",
          scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
          duration: 30,
          status: "scheduled",
          reason: "Annual Checkup",
          notes: "Patient has history of hypertension. Please check BP.",
          phone: "+1 (555) 123-4567",
          email: "john.doe@example.com",
          address: "123 Main St, City, State 12345",
          insurance: "Premium Health HMO",
          lastVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          nextAppointment: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        }
        setAppointment(mockAppointment)
      } catch (error) {
        console.error("Failed to fetch appointment:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointment()
  }, [params.id])

  const handleCancel = async () => {
    // Cancel appointment logic
    console.log("Cancel appointment:", appointment.id)
    setShowCancelDialog(false)
    router.push("/appointments")
  }

  const handleConfirm = async () => {
    // Confirm appointment logic
    console.log("Confirm appointment:", appointment.id)
  }

  const handleSendReminder = async () => {
    // Send SMS reminder logic
    console.log("Send reminder for:", appointment.id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100px">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading appointment details...</p>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="mt-4 text-lg font-semibold">Appointment not found</h3>
        <p className="mt-2 text-muted-foreground">
          The appointment you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => router.push("/appointments")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Appointments
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/appointments")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Appointment Details</h2>
            <p className="text-muted-foreground">
              ID: {appointment.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleSendReminder} size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send Reminder
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Appointment Information</CardTitle>
                  <CardDescription>
                    Scheduled appointment details
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    appointment.status === "confirmed"
                      ? "default"
                      : appointment.status === "cancelled"
                      ? "destructive"
                      : "outline"
                  }
                  className={
                    appointment.status === "confirmed"
                      ? "bg-green-500/20 text-green-700 hover:bg-green-500/20"
                      : ""
                  }
                >
                  {appointment.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date & Time
                  </div>
                  <p className="font-medium">
                    {format(appointment.scheduledFor, "PPP")}
                  </p>
                  <p className="text-muted-foreground">
                    {format(appointment.scheduledFor, "h:mm a")} (
                    {appointment.duration} minutes)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    Doctor
                  </div>
                  <p className="font-medium">{appointment.doctorName}</p>
                  <p className="text-muted-foreground">General Practitioner</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    Reason for Visit
                  </div>
                  <p className="font-medium">{appointment.reason}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Estimated Duration
                  </div>
                  <p className="font-medium">{appointment.duration} minutes</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  Notes
                </div>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <p className="whitespace-pre-line">{appointment.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Contact and medical details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="contact">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="contact" className="space-y-4 pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone
                      </div>
                      <p className="font-medium">{appointment.phone}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </div>
                      <p className="font-medium">{appointment.email}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Address
                      </div>
                      <p className="font-medium">{appointment.address}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Insurance
                      </div>
                      <p className="font-medium">{appointment.insurance}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-4 pt-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground">
                      Medical information will be displayed here
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Last Visit</p>
                        <p className="text-sm text-muted-foreground">
                          {format(appointment.lastVisit, "PPP")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Record
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Next Appointment</p>
                        <p className="text-sm text-muted-foreground">
                          {format(appointment.nextAppointment, "PPP")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setShowRescheduleDialog(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Reschedule Appointment
              </Button>
              {appointment.status === "scheduled" && (
                <Button
                  className="w-full justify-start"
                  onClick={handleConfirm}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Appointment
                </Button>
              )}
              <Button
                className="w-full justify-start"
                variant="outline"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button
                className="w-full justify-start"
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: "Scheduled", status: "complete", date: "2 days ago" },
                  { step: "Confirmed", status: "pending", date: "" },
                  { step: "Check-in", status: "pending", date: "" },
                  { step: "In Progress", status: "pending", date: "" },
                  { step: "Completed", status: "pending", date: "" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === "complete"
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.status === "complete" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{item.step}</p>
                      {item.date && (
                        <p className="text-sm text-muted-foreground">
                          {item.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for this appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Date picker and time selector would go here */}
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="mt-2 text-muted-foreground">
                Date and time picker would be displayed here
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRescheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowRescheduleDialog(false)}>
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}