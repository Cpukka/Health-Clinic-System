"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  User,
  Stethoscope,
  AlertCircle,
  Pill,
  Upload,
  Printer,
  FileUp,
  FileSearch,
  FolderOpen,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Types
interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  visitDate: Date
  diagnosis: string
  type: "consultation" | "follow-up" | "emergency" | "routine" | "lab"
  status: "draft" | "finalized" | "archived"
  prescriptions: Prescription[]
  attachments: number
  lastUpdated: Date
}

interface Prescription {
  id: string
  medication: string
  dosage: string
}

interface Patient {
  id: string
  name: string
  age: number
  gender: string
}

export default function MedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  // Mock data
  const [records] = useState<MedicalRecord[]>(generateMockRecords())
  const [patients] = useState<Patient[]>(generateMockPatients())

  // Filter records
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesType = typeFilter === "all" || record.type === typeFilter

    if (activeTab === "all") {
      return matchesSearch && matchesStatus && matchesType
    } else if (activeTab === "recent") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return matchesSearch && matchesStatus && matchesType && record.visitDate >= oneWeekAgo
    } else if (activeTab === "pending") {
      return matchesSearch && matchesStatus && matchesType && record.status === "draft"
    }

    return matchesSearch && matchesStatus && matchesType
  })

  // Get record type badge variant
  const getTypeVariant = (type: MedicalRecord["type"]) => {
    switch (type) {
      case "emergency":
        return "destructive"
      case "consultation":
        return "default"
      case "follow-up":
        return "secondary"
      case "lab":
        return "outline"
      default:
        return "outline"
    }
  }

  // Get status badge variant
  const getStatusVariant = (status: MedicalRecord["status"]) => {
    switch (status) {
      case "finalized":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "outline"
    }
  }

  // Format date
  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy")
  }

  // Handle actions
  const handleViewRecord = (record: MedicalRecord) => {
    console.log("View record:", record)
    // Implement view logic
  }

  const handleEditRecord = (record: MedicalRecord) => {
    console.log("Edit record:", record)
    // Implement edit logic
  }

  const handleDeleteRecord = (recordId: string) => {
    console.log("Delete record:", recordId)
    // Implement delete logic
  }

  const handleDownloadRecord = (record: MedicalRecord) => {
    console.log("Download record:", record)
    // Implement download logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medical Records</h2>
          <p className="text-muted-foreground">
            Manage patient medical records and documentation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import Records
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{records.length}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {records.filter(r => {
                    const now = new Date()
                    const recordDate = r.visitDate
                    return recordDate.getMonth() === now.getMonth() && 
                           recordDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">
                  {records.filter(r => r.status === "draft").length}
                </p>
              </div>
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-2">
                <User className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search records by patient, diagnosis, or doctor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("finalized")}>
                      Finalized
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("archived")}>
                      Archived
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("consultation")}>
                      Consultation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("follow-up")}>
                      Follow-up
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("emergency")}>
                      Emergency
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("lab")}>
                      Lab Results
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="all">
                  <FileText className="mr-2 h-4 w-4" />
                  All Records
                </TabsTrigger>
                <TabsTrigger value="recent">
                  <Calendar className="mr-2 h-4 w-4" />
                  Recent (7 days)
                </TabsTrigger>
                <TabsTrigger value="pending">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Pending Review
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Records Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prescriptions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <FileSearch className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="text-lg font-semibold">No records found</p>
                          <p className="text-muted-foreground">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{record.patientName}</span>
                          <span className="text-sm text-muted-foreground">
                            ID: {record.patientId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          {record.doctorName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(record.visitDate)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{record.diagnosis}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeVariant(record.type)}>
                          {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.prescriptions.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-muted-foreground" />
                            <span>{record.prescriptions.length} meds</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewRecord(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadRecord(record)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <FileUp className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.print()}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Record
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteRecord(record.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Quick Add</p>
                    <p className="text-sm text-muted-foreground">Create new record</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <Upload className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Bulk Upload</p>
                    <p className="text-sm text-muted-foreground">Import multiple records</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <Printer className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Print Reports</p>
                    <p className="text-sm text-muted-foreground">Generate summaries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500/10 p-2">
                    <Download className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Export All</p>
                    <p className="text-sm text-muted-foreground">Download all records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Recent Patients */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Patients with Records</CardTitle>
          <CardDescription>
            Patients with medical records from the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patients.slice(0, 6).map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper functions to generate mock data
function generateMockRecords(): MedicalRecord[] {
  const records: MedicalRecord[] = []
  const patients = [
    { id: "pat-001", name: "John Smith" },
    { id: "pat-002", name: "Sarah Johnson" },
    { id: "pat-003", name: "Michael Chen" },
    { id: "pat-004", name: "Emma Wilson" },
    { id: "pat-005", name: "Robert Brown" },
    { id: "pat-006", name: "Lisa Garcia" },
    { id: "pat-007", name: "David Miller" },
    { id: "pat-008", name: "Maria Rodriguez" },
  ]
  
  const doctors = [
    { id: "doc-001", name: "Dr. Sarah Johnson" },
    { id: "doc-002", name: "Dr. Michael Chen" },
    { id: "doc-003", name: "Dr. Emma Wilson" },
  ]
  
  const diagnoses = [
    "Hypertension - Stage 1",
    "Type 2 Diabetes Mellitus",
    "Upper Respiratory Infection",
    "Migraine without Aura",
    "Acute Gastroenteritis",
    "Allergic Rhinitis",
    "Anxiety Disorder",
    "Low Back Pain",
    "Osteoarthritis, Knee",
    "Asthma, Mild Persistent",
  ]
  
  const medications = [
    { medication: "Lisinopril 10mg", dosage: "Once daily" },
    { medication: "Metformin 850mg", dosage: "Twice daily" },
    { medication: "Amoxicillin 500mg", dosage: "Three times daily" },
    { medication: "Ibuprofen 400mg", dosage: "As needed" },
    { medication: "Loratadine 10mg", dosage: "Once daily" },
    { medication: "Sertraline 50mg", dosage: "Once daily" },
  ]
  
  for (let i = 0; i < 20; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)]
    const doctor = doctors[Math.floor(Math.random() * doctors.length)]
    const visitDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    const type: MedicalRecord["type"] = 
      Math.random() > 0.8 ? "emergency" :
      Math.random() > 0.6 ? "follow-up" :
      Math.random() > 0.4 ? "lab" : "consultation"
    
    const status: MedicalRecord["status"] = 
      Math.random() > 0.7 ? "draft" :
      Math.random() > 0.8 ? "archived" : "finalized"
    
    const prescriptionCount = Math.floor(Math.random() * 3)
    
    records.push({
      id: `rec-${i + 1}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      visitDate,
      diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
      type,
      status,
      prescriptions: Array.from({ length: prescriptionCount }, (_, idx) => ({
        id: `pres-${i}-${idx}`,
        ...medications[Math.floor(Math.random() * medications.length)],
      })),
      attachments: Math.floor(Math.random() * 5),
      lastUpdated: new Date(visitDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
    })
  }
  
  return records.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime())
}

function generateMockPatients(): Patient[] {
  const patients: Patient[] = []
  const names = [
    "John Smith", "Sarah Johnson", "Michael Chen", "Emma Wilson",
    "Robert Brown", "Lisa Garcia", "David Miller", "Maria Rodriguez",
    "James Martinez", "Jennifer Davis", "Thomas Anderson", "Susan Taylor"
  ]
  
  for (let i = 0; i < 12; i++) {
    patients.push({
      id: `pat-${i + 1}`,
      name: names[i % names.length],
      age: 25 + Math.floor(Math.random() * 50),
      gender: Math.random() > 0.5 ? "Male" : "Female",
    })
  }
  
  return patients
}