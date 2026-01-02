"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  Pill,
  Clock,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  MoreVertical,
  RefreshCw,
} from "lucide-react"
import { format } from "date-fns"

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const prescriptions = [
    {
      id: "RX-001",
      patientName: "John Doe",
      patientId: "PAT-001",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      refills: 2,
      status: "active",
      doctor: "Dr. Sarah Johnson",
      lastFilled: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: "RX-002",
      patientName: "Sarah Johnson",
      patientId: "PAT-002",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      refills: 0,
      status: "expiring",
      doctor: "Dr. Michael Chen",
      lastFilled: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: "RX-003",
      patientName: "Michael Chen",
      patientId: "PAT-003",
      medication: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      refills: 0,
      status: "expired",
      doctor: "Dr. Emma Wilson",
      lastFilled: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
    },
    {
      id: "RX-004",
      patientName: "Emma Wilson",
      patientId: "PAT-004",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      refills: 0,
      status: "active",
      doctor: "Dr. James Miller",
      lastFilled: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: "RX-005",
      patientName: "Robert Brown",
      patientId: "PAT-005",
      medication: "Levothyroxine",
      dosage: "50mcg",
      frequency: "Once daily",
      startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      refills: 3,
      status: "active",
      doctor: "Dr. Sarah Johnson",
      lastFilled: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  ]

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (statusFilter !== "all" && rx.status !== statusFilter) return false
    if (searchQuery) {
      return (
        rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        )
      case "expiring":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Expiring Soon
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        )
    }
  }

  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter(rx => rx.status === "active").length,
    expiring: prescriptions.filter(rx => rx.status === "expiring").length,
    expired: prescriptions.filter(rx => rx.status === "expired").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">
            Manage patient medications and prescriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All prescriptions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiring}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">Require renewal</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search prescriptions by patient, medication, or ID..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Prescriptions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("expiring")}>
                      Expiring Soon
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("expired")}>
                      Expired
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription List</CardTitle>
            <CardDescription>
              View and manage all patient prescriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
                <TabsTrigger value="expiring">Expiring ({stats.expiring})</TabsTrigger>
                <TabsTrigger value="expired">Expired ({stats.expired})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 pt-4">
                <PrescriptionList prescriptions={filteredPrescriptions} />
              </TabsContent>

              <TabsContent value="active" className="space-y-4 pt-4">
                <PrescriptionList prescriptions={filteredPrescriptions.filter(rx => rx.status === "active")} />
              </TabsContent>

              <TabsContent value="expiring" className="space-y-4 pt-4">
                <PrescriptionList prescriptions={filteredPrescriptions.filter(rx => rx.status === "expiring")} />
              </TabsContent>

              <TabsContent value="expired" className="space-y-4 pt-4">
                <PrescriptionList prescriptions={filteredPrescriptions.filter(rx => rx.status === "expired")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions and Statistics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common prescription tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Prescription
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Prescription Labels
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export to Pharmacy
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Process Refill Requests
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prescription Activity</CardTitle>
              <CardDescription>
                Recent prescription-related actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New prescription created", user: "Dr. Johnson", time: "10 min ago", patient: "John Doe" },
                  { action: "Refill request approved", user: "Pharmacist", time: "1 hour ago", patient: "Sarah Johnson" },
                  { action: "Prescription renewed", user: "Dr. Chen", time: "3 hours ago", patient: "Michael Chen" },
                  { action: "Medication change logged", user: "Nurse Jane", time: "5 hours ago", patient: "Emma Wilson" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <Pill className="h-3 w-3 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{activity.time}</span>
                        <span className="mx-2">•</span>
                        <span>by {activity.user}</span>
                        <span className="mx-2">•</span>
                        <span>for {activity.patient}</span>
                      </div>
                    </div>
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

// Prescription List Component
interface PrescriptionListProps {
  prescriptions: Array<{
    id: string
    patientName: string
    patientId: string
    medication: string
    dosage: string
    frequency: string
    startDate: Date
    endDate: Date
    refills: number
    status: string
    doctor: string
    lastFilled: Date
  }>
}

function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No prescriptions found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((rx) => (
        <Card key={rx.id}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <Pill className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{rx.medication}</h3>
                          {getStatusBadge(rx.status)}
                          <Badge variant="outline">{rx.dosage}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {rx.patientName}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {rx.doctor}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rx.frequency}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{format(rx.startDate, "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{format(rx.endDate, "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Filled</p>
                    <p className="font-medium">{format(rx.lastFilled, "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Refills Remaining</p>
                    <p className="font-medium">{rx.refills}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">Prescription ID</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{rx.id}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Printer className="mr-2 h-3 w-3" />
                      Print
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-3 w-3" />
                      PDF
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Renew Prescription</DropdownMenuItem>
                        <DropdownMenuItem>Request Refill</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Cancel Prescription
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Helper function for status badge (moved outside for reuse)
function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          Active
        </Badge>
      )
    case "expiring":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          Expiring Soon
        </Badge>
      )
    case "expired":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Expired
        </Badge>
      )
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      )
  }
}