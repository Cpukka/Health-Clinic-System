"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import {
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Heart,
  AlertCircle,
  Pill,
  Edit,
  Printer,
  MessageSquare,
  ArrowLeft,
} from "lucide-react"
import { format } from "date-fns"

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPatient = async () => {
      setIsLoading(true)
      try {
        // Mock patient data
        const mockPatient = {
          id: params.id,
          firstName: "John",
          lastName: "Doe",
          fullName: "John Doe",
          dateOfBirth: new Date("1990-05-15"),
          age: 33,
          gender: "Male",
          phone: "+1 (555) 123-4567",
          email: "john.doe@example.com",
          address: "123 Main St, City, State 12345",
          emergencyContact: "+1 (555) 987-6543",
          bloodType: "O+",
          allergies: "Penicillin, Peanuts",
          medications: "Lisinopril 10mg daily",
          conditions: ["Hypertension", "Asthma"],
          insurance: "Premium Health HMO",
          lastVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          nextAppointment: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          totalVisits: 12,
        }
        setPatient(mockPatient)
      } catch (error) {
        console.error("Failed to fetch patient:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatient()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading patient details...</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="mt-4 text-lg font-semibold">Patient not found</h3>
        <p className="mt-2 text-muted-foreground">
          The patient you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => router.push("/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
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
            onClick={() => router.push("/patients")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Patient Profile</h2>
            <p className="text-muted-foreground">
              ID: {patient.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Basic patient details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-2 h-4 w-4" />
                        Full Name
                      </div>
                      <p className="font-medium">{patient.fullName}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        Date of Birth
                      </div>
                      <p className="font-medium">
                        {format(patient.dateOfBirth, "PPP")} ({patient.age} years)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone
                      </div>
                      <p className="font-medium">{patient.phone}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </div>
                      <p className="font-medium">{patient.email}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Address
                      </div>
                      <p className="font-medium">{patient.address}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Emergency Contact
                      </div>
                      <p className="font-medium">{patient.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="medical" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="medical" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center text-sm font-medium mb-2">
                          <Heart className="mr-2 h-4 w-4" />
                          Blood Type & Allergies
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Blood Type</span>
                            <Badge variant="outline">{patient.bloodType}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Allergies</span>
                            <span className="text-sm font-medium">{patient.allergies}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <div className="flex items-center text-sm font-medium mb-2">
                          <Pill className="mr-2 h-4 w-4" />
                          Current Medications
                        </div>
                        <div className="rounded-lg border p-3">
                          <p className="text-sm">{patient.medications}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center text-sm font-medium mb-2">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Medical Conditions
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {patient.conditions.map((condition: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <div className="flex items-center text-sm font-medium mb-2">
                          <FileText className="mr-2 h-4 w-4" />
                          Insurance Information
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Provider</span>
                            <span className="text-sm font-medium">{patient.insurance}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Policy Number</span>
                            <span className="text-sm font-medium">P-7890123</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visit History Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Last Visit</p>
                        <p className="text-sm text-muted-foreground">
                          {format(patient.lastVisit, "PPP")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Next Appointment</p>
                        <p className="text-sm text-muted-foreground">
                          {format(patient.nextAppointment, "PPP")}
                        </p>
                      </div>
                      <Button size="sm">
                        Schedule New
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Total Visits</p>
                        <p className="text-sm text-muted-foreground">
                          Past 12 months
                        </p>
                      </div>
                      <div className="text-2xl font-bold">{patient.totalVisits}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="mt-2 text-muted-foreground">
                      Appointment history would be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="mt-2 text-muted-foreground">
                      Medical records would be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="mt-2 text-muted-foreground">
                      Billing information would be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Add Medical Record
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium">
                    {format(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), "MMM yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Preferred Doctor</span>
                  <span className="text-sm font-medium">Dr. Sarah Johnson</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Emergency Contact</p>
                <p className="text-sm">{patient.emergencyContact}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Known Allergies</p>
                <p className="text-sm">{patient.allergies}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Blood Type</p>
                <Badge variant="outline">{patient.bloodType}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}