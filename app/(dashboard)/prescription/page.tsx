"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { Check } from "lucide-react"
import {
  Plus,
  Search,
  Filter,
  Pill,
  Calendar,
  User,
  Printer,
  Clock,
  AlertCircle,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { format } from "date-fns"

interface Prescription {
  id: string
  patientName: string
  patientId: string
  medication: string
  dosage: string
  frequency: string
  startDate: Date
  endDate?: Date
  refills: number
  status: "active" | "completed" | "expired" | "cancelled"
  doctorName: string
  lastFilled?: Date
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "RX001",
      patientName: "John Doe",
      patientId: "P001",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      refills: 2,
      status: "active",
      doctorName: "Dr. Sarah Johnson",
      lastFilled: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: "RX002",
      patientName: "Jane Smith",
      patientId: "P002",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      refills: 0,
      status: "completed",
      doctorName: "Dr. Michael Chen",
      lastFilled: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [view, setView] = useState<"list" | "expiring">("list")

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || rx.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const expiringSoon = prescriptions.filter((rx) => {
    if (!rx.endDate || rx.status !== "active") return false
    const daysUntilExpiry = Math.floor(
      (rx.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  })

  const handleRefill = (prescriptionId: string) => {
    console.log("Refilling prescription:", prescriptionId)
    // Implement refill logic
  }

  const handlePrint = (prescriptionId: string) => {
    console.log("Printing prescription:", prescriptionId)
    // Implement print logic
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prescriptions</h2>
          <p className="text-muted-foreground">
            Manage and track patient prescriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Prescription Management</CardTitle>
                <CardDescription>
                  View and manage all prescriptions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search prescriptions..."
                    className="pl-10 w-full sm:w-62.5"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-37.5">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" onClick={() => setView("list")}>
                  All Prescriptions
                </TabsTrigger>
                <TabsTrigger
                  value="expiring"
                  onClick={() => setView("expiring")}
                  className="relative"
                >
                  Expiring Soon
                  {expiringSoon.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2 h-5 w-5 p-0 flex items-center justify-center"
                    >
                      {expiringSoon.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4 pt-4">
                {filteredPrescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPrescriptions.map((rx) => (
                      <Card key={rx.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-2">
                                  <Pill className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{rx.medication}</h3>
                                    <Badge
                                      variant={
                                        rx.status === "active"
                                          ? "default"
                                          : rx.status === "expired"
                                          ? "destructive"
                                          : "secondary"
                                      }
                                      className={
                                        rx.status === "active"
                                          ? "bg-green-500/20 text-green-700 hover:bg-green-500/20"
                                          : ""
                                      }
                                    >
                                      {rx.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {rx.dosage} • {rx.frequency}
                                  </p>
                                </div>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <User className="mr-2 h-4 w-4" />
                                    Patient
                                  </div>
                                  <p className="font-medium">{rx.patientName}</p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Start Date
                                  </div>
                                  <p className="font-medium">
                                    {format(rx.startDate, "MMM d, yyyy")}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-2 h-4 w-4" />
                                    End Date
                                  </div>
                                  <p className="font-medium">
                                    {rx.endDate
                                      ? format(rx.endDate, "MMM d, yyyy")
                                      : "No end date"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">
                                    Refills Remaining
                                  </div>
                                  <p className="font-medium">{rx.refills}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {rx.status === "active" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleRefill(rx.id)}
                                >
                                  Refill
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePrint(rx.id)}
                              >
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                              </Button>
                            </div>
                          </div>

                          {rx.lastFilled && (
                            <>
                              <Separator className="my-4" />
                              <div className="text-sm text-muted-foreground">
                                Last filled: {format(rx.lastFilled, "MMM d, yyyy")}
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Pill className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold">No prescriptions found</h3>
                    <p className="mt-2 text-muted-foreground">
                      {searchQuery
                        ? "Try a different search term"
                        : "No prescriptions have been created yet"}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="expiring" className="space-y-4 pt-4">
                {expiringSoon.length > 0 ? (
                  <div className="space-y-4">
                    {expiringSoon.map((rx) => (
                      <Card key={rx.id} className="border-yellow-200 bg-yellow-50/50">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-yellow-500/20 p-2">
                              <AlertCircle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{rx.medication}</h3>
                                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                                  EXPIRING SOON
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {rx.dosage} • {rx.frequency} • {rx.patientName}
                              </p>
                              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                <div>
                                  <p className="text-sm text-muted-foreground">Expires</p>
                                  <p className="font-medium">
                                    {format(rx.endDate!, "MMM d, yyyy")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Doctor</p>
                                  <p className="font-medium">{rx.doctorName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Refills</p>
                                  <p className="font-medium">{rx.refills}</p>
                                </div>
                              </div>
                              <div className="mt-4 flex gap-2">
                                <Button size="sm">Renew</Button>
                                <Button size="sm" variant="outline">
                                  Contact Patient
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Check className="h-12 w-12 text-green-500 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold">No expiring prescriptions</h3>
                    <p className="mt-2 text-muted-foreground">
                      All active prescriptions are up to date
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Active Prescriptions", value: "124", change: "+12" },
                { label: "Expiring This Week", value: "8", change: "+2" },
                { label: "Avg. Refills", value: "2.3", change: "+0.2" },
                { label: "Most Prescribed", value: "Lisinopril", change: "" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  {stat.change && (
                    <div className={`rounded-full px-3 py-1 text-xs font-medium ${
                      stat.change.startsWith('+') 
                        ? 'bg-green-500/20 text-green-700'
                        : 'bg-red-500/20 text-red-700'
                    }`}>
                      {stat.change}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Prescription filled", patient: "John Doe", time: "2 hours ago" },
                  { action: "New prescription", patient: "Jane Smith", time: "1 day ago" },
                  { action: "Prescription renewed", patient: "Robert Wilson", time: "2 days ago" },
                  { action: "Refill requested", patient: "Emily Davis", time: "3 days ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{activity.patient}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Lisinopril", count: 45 },
                  { name: "Metformin", count: 32 },
                  { name: "Atorvastatin", count: 28 },
                  { name: "Levothyroxine", count: 22 },
                  { name: "Amlodipine", count: 18 },
                ].map((med, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{med.name}</span>
                    <Badge variant="outline">{med.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}