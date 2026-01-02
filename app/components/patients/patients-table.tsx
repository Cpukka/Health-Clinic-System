"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Phone,
  Mail,
  Calendar,
  Heart,
  Droplets,
  Eye,
  Edit,
  FileText,
  History,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Types
interface Patient {
  id: string
  firstName: string
  lastName: string
  fullName: string
  dateOfBirth: Date
  age: number
  gender: "MALE" | "FEMALE" | "OTHER"
  phone: string
  email?: string
  bloodType?: string
  allergies?: string[]
  lastVisit?: Date
  status: "active" | "inactive" | "follow-up"
  hmo?: string
  clinic?: string
}

interface PatientsTableProps {
  patients?: Patient[]
  showFilters?: boolean
  onView?: (patient: Patient) => void
  onEdit?: (patient: Patient) => void
  onViewRecords?: (patient: Patient) => void
  onViewHistory?: (patient: Patient) => void
  onDelete?: (patientId: string) => void
  filter: "all" | "active" | "inactive"  // ✅ Add this
  searchQuery: string
}

export function PatientsTable({
  patients: initialPatients,
  showFilters = true,
  onView,
  onEdit,
  onViewRecords,
  onViewHistory,
  onDelete,
}: PatientsTableProps) {
  const [patients] = useState<Patient[]>(
    initialPatients || generateMockPatients()
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [genderFilter, setGenderFilter] = useState<string>("all")

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      (patient.email && patient.email.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    const matchesGender = genderFilter === "all" || patient.gender === genderFilter

    return matchesSearch && matchesStatus && matchesGender
  })

  // Get status badge variant
  const getStatusVariant = (status: Patient["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "follow-up":
        return "secondary"
      case "inactive":
        return "outline"
      default:
        return "outline"
    }
  }

  // Calculate age from date of birth
  const calculateAge = (dob: Date) => {
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    
    return age
  }

  // Format date
  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy")
  }

  // Get gender icon and color
  const getGenderInfo = (gender: Patient["gender"]) => {
    switch (gender) {
      case "MALE":
        return { text: "Male", color: "text-blue-600", bg: "bg-blue-100" }
      case "FEMALE":
        return { text: "Female", color: "text-pink-600", bg: "bg-pink-100" }
      case "OTHER":
        return { text: "Other", color: "text-purple-600", bg: "bg-purple-100" }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Patients</CardTitle>
            <CardDescription>
              Manage patient information and records
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <History className="mr-2 h-4 w-4" />
              Import Patients
            </Button>
            <Button size="sm">
              <User className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-37.5">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-37.5">
                    <User className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => {
                  const genderInfo = getGenderInfo(patient.gender)
                  
                  return (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{patient.fullName}</span>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            DOB: {formatDate(patient.dateOfBirth)}
                          </div>
                          {patient.allergies && patient.allergies.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                              <Heart className="h-3 w-3" />
                              Allergies: {patient.allergies.join(", ")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {patient.phone}
                          </div>
                          {patient.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {patient.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn("rounded-full p-2", genderInfo.bg)}>
                            <User className={cn("h-4 w-4", genderInfo.color)} />
                          </div>
                          <div>
                            <div className="font-medium">{patient.age} years</div>
                            <div className="text-sm text-muted-foreground">{genderInfo.text}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.bloodType ? (
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-red-600" />
                            <span className="font-mono">{patient.bloodType}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.lastVisit ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(patient.lastVisit)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No visits yet</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(patient.status)}>
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onView?.(patient)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit?.(patient)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewRecords?.(patient)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Records
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewHistory?.(patient)}>
                              <History className="mr-2 h-4 w-4" />
                              Visit History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete?.(patient.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredPatients.length} of {patients.length} patients
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to generate mock patients
function generateMockPatients(): Patient[] {
  const patients: Patient[] = []
  
  const firstNames = ["John", "Sarah", "Michael", "Emma", "Robert", "Lisa", "David", "Maria", "James", "Jennifer"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const allergies = ["Penicillin", "Peanuts", "Dust", "Latex", "Shellfish", "Eggs", "Soy", "None"]
  
  for (let i = 0; i < 15; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const dob = new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28))
    const age = new Date().getFullYear() - dob.getFullYear()
    const lastVisit = Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : undefined
    
    patients.push({
      id: `pat-${i + 1}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      dateOfBirth: dob,
      age,
      gender: Math.random() > 0.5 ? "MALE" : "FEMALE",
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: Math.random() > 0.3 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com` : undefined,
      bloodType: Math.random() > 0.3 ? bloodTypes[Math.floor(Math.random() * bloodTypes.length)] : undefined,
      allergies: Math.random() > 0.5 ? [allergies[Math.floor(Math.random() * allergies.length)]] : undefined,
      lastVisit,
      status: Math.random() > 0.7 ? "inactive" : Math.random() > 0.8 ? "follow-up" : "active",
      hmo: Math.random() > 0.5 ? "Premium Health HMO" : undefined,
      clinic: "City Medical Center",
    })
  }
  
  return patients
}