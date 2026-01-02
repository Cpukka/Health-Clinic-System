"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import {
  Calendar,
  FileText,
  Pill,
  MessageSquare,
  CreditCard,
  User,
  Bell,
  Download,
  Clock,
  CheckCircle,
  LogOut, // ADD THIS IMPORT
} from "lucide-react"
import { format } from "date-fns"

export default function PatientPortalPage() {
  const { data: session } = useSession()
  const [patientData, setPatientData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    // Fetch patient data
    const fetchPatientData = async () => {
      // In production, fetch from API
      const mockData = {
        name: session?.user?.name || "John Doe",
        nextAppointment: {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          doctor: "Dr. Sarah Johnson",
          reason: "Follow-up Checkup",
          status: "confirmed",
        },
        recentAppointments: [
          {
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            doctor: "Dr. Michael Chen",
            reason: "Annual Physical",
            status: "completed",
          },
          {
            date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
            doctor: "Dr. Sarah Johnson",
            reason: "Consultation",
            status: "completed",
          },
        ],
        prescriptions: [
          {
            medication: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            refills: 2,
            status: "active",
          },
          {
            medication: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            refills: 0,
            status: "completed",
          },
        ],
        medicalRecords: [
          {
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            type: "Lab Results",
            doctor: "Dr. Michael Chen",
            summary: "Blood test results - all within normal range",
          },
          {
            date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
            type: "Visit Summary",
            doctor: "Dr. Sarah Johnson",
            summary: "Initial consultation and assessment",
          },
        ],
        bills: [
          {
            id: "INV-2023-001",
            amount: 250.00,
            status: "paid",
            dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            services: ["Consultation", "Lab Tests"],
          },
          {
            id: "INV-2023-002",
            amount: 150.00,
            status: "pending",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            services: ["Follow-up Visit"],
          },
        ],
        messages: [
          {
            from: "Dr. Sarah Johnson",
            content: "Your test results are back. Everything looks good!",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: false,
          },
          {
            from: "Clinic Reminders",
            content: "Reminder: Your appointment is in 2 days",
            time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            read: true,
          },
        ],
      }
      setPatientData(mockData)
    }

    fetchPatientData()
  }, [session])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (!patientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading patient portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Patient Portal</h1>
              <p className="text-muted-foreground">
                Welcome back, {patientData.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              {/* LOGOUT BUTTON ADDED HERE */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {format(patientData.nextAppointment.date, "MMM d")}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      with {patientData.nextAppointment.doctor}
                    </p>
                    <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20">
                      {patientData.nextAppointment.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {patientData.prescriptions.filter((p: any) => p.status === "active").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {patientData.messages.filter((m: any) => !m.read).length}
                  </div>
                  <p className="text-sm text-muted-foreground">From your care team</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${patientData.bills
                      .filter((b: any) => b.status === "pending")
                      .reduce((sum: number, b: any) => sum + b.amount, 0)
                      .toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total pending</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upcoming Appointment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Upcoming Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {format(patientData.nextAppointment.date, "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(patientData.nextAppointment.date, "h:mm a")}
                        </p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20">
                        Confirmed
                      </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Doctor</span>
                        <span className="font-medium">{patientData.nextAppointment.doctor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Reason</span>
                        <span className="font-medium">{patientData.nextAppointment.reason}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline">
                        Reschedule
                      </Button>
                      <Button className="flex-1">Join Video Call</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patientData.messages.slice(0, 3).map((message: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${!message.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{message.from}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {message.content}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {format(message.time, "h:mm a")}
                            </p>
                            {!message.read && (
                              <Badge className="mt-1 bg-blue-500 text-white">New</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">
                      View All Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Button className="h-auto py-4 flex flex-col items-center justify-center gap-2" variant="outline">
                    <Calendar className="h-6 w-6" />
                    <span>Schedule Appointment</span>
                  </Button>
                  <Button className="h-auto py-4 flex flex-col items-center justify-center gap-2" variant="outline">
                    <FileText className="h-6 w-6" />
                    <span>View Records</span>
                  </Button>
                  <Button className="h-auto py-4 flex flex-col items-center justify-center gap-2" variant="outline">
                    <Pill className="h-6 w-6" />
                    <span>Request Refill</span>
                  </Button>
                  <Button className="h-auto py-4 flex flex-col items-center justify-center gap-2" variant="outline">
                    <CreditCard className="h-6 w-6" />
                    <span>Pay Bill</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
                <CardDescription>
                  View and manage your appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Upcoming Appointments */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Upcoming</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">
                                {format(patientData.nextAppointment.date, "EEEE, MMMM d, yyyy")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(patientData.nextAppointment.date, "h:mm a")} •{" "}
                                {patientData.nextAppointment.doctor}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20">
                                Confirmed
                              </Badge>
                              <Button size="sm" variant="outline">
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Past Appointments */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Past Appointments</h3>
                    <div className="space-y-4">
                      {patientData.recentAppointments.map((appointment: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">
                                  {format(appointment.date, "EEEE, MMMM d, yyyy")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {format(appointment.date, "h:mm a")} • {appointment.doctor}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {appointment.reason}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/20">
                                  Completed
                                </Badge>
                                <Button size="sm" variant="outline">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Summary
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>
                  Your medical records and prescriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="prescriptions">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                    <TabsTrigger value="records">Medical Records</TabsTrigger>
                  </TabsList>

                  <TabsContent value="prescriptions" className="space-y-4 pt-4">
                    {patientData.prescriptions.map((prescription: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{prescription.medication}</h3>
                                <Badge
                                  className={
                                    prescription.status === "active"
                                      ? "bg-green-500/20 text-green-700 hover:bg-green-500/20"
                                      : "bg-gray-500/20 text-gray-700 hover:bg-gray-500/20"
                                  }
                                >
                                  {prescription.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {prescription.dosage} • {prescription.frequency}
                              </p>
                              <div className="text-sm">
                                Started {format(prescription.startDate, "MMM d, yyyy")}
                                {prescription.refills > 0 && (
                                  <span className="ml-4">
                                    {prescription.refills} refills remaining
                                  </span>
                                )}
                              </div>
                            </div>
                            {prescription.status === "active" && (
                              <Button size="sm" variant="outline">
                                Request Refill
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="records" className="space-y-4 pt-4">
                    {patientData.medicalRecords.map((record: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{record.type}</h3>
                                <Badge variant="outline">
                                  {format(record.date, "MMM d, yyyy")}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                By {record.doctor}
                              </p>
                              <p className="text-sm">{record.summary}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
                <CardDescription>
                  View and pay your bills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientData.bills.map((bill: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{bill.id}</h3>
                              <Badge
                                className={
                                  bill.status === "paid"
                                    ? "bg-green-500/20 text-green-700 hover:bg-green-500/20"
                                    : "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/20"
                                }
                              >
                                {bill.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Due {format(bill.dueDate, "MMM d, yyyy")}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {bill.services.map((service: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${bill.amount.toFixed(2)}</p>
                            {bill.status === "pending" && (
                              <Button className="mt-2">Pay Now</Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Communicate with your care team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientData.messages.map((message: any, index: number) => (
                    <Card key={index} className={!message.read ? "border-blue-200 bg-blue-50/50" : ""}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{message.from}</h3>
                              {!message.read && (
                                <Badge className="bg-blue-500 text-white">New</Badge>
                              )}
                            </div>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(message.time, "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Reply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold">Need Help?</p>
              <p className="text-sm text-muted-foreground">
                Contact clinic support: (555) 123-4567
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Health Clinic System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}