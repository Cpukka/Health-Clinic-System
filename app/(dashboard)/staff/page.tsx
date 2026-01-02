"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Shield,
  MoreVertical,
  CheckCircle,
  Clock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"

interface StaffMember {
  id: string
  name: string
  email: string
  role: "doctor" | "nurse" | "receptionist" | "admin"
  phone: string
  status: "active" | "inactive" | "on_leave"
  joinDate: Date
  specialization?: string
  schedule: string
  appointmentsToday: number
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: "S001",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@clinic.com",
      role: "doctor",
      phone: "+1 (555) 123-4567",
      status: "active",
      joinDate: new Date("2020-03-15"),
      specialization: "General Practitioner",
      schedule: "Mon-Fri, 9AM-5PM",
      appointmentsToday: 8,
    },
    {
      id: "S002",
      name: "Dr. Michael Chen",
      email: "michael.chen@clinic.com",
      role: "doctor",
      phone: "+1 (555) 234-5678",
      status: "active",
      joinDate: new Date("2021-07-22"),
      specialization: "Cardiology",
      schedule: "Tue-Sat, 10AM-6PM",
      appointmentsToday: 6,
    },
    {
      id: "S003",
      name: "Nurse Jane Smith",
      email: "jane.smith@clinic.com",
      role: "nurse",
      phone: "+1 (555) 345-6789",
      status: "active",
      joinDate: new Date("2022-01-10"),
      schedule: "Mon-Fri, 8AM-4PM",
      appointmentsToday: 12,
    },
    {
      id: "S004",
      name: "Robert Wilson",
      email: "robert.wilson@clinic.com",
      role: "receptionist",
      phone: "+1 (555) 456-7890",
      status: "active",
      joinDate: new Date("2022-11-05"),
      schedule: "Mon-Sat, 9AM-6PM",
      appointmentsToday: 0,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialization?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const variants = {
      doctor: { color: "bg-blue-500/20 text-blue-700", label: "Doctor" },
      nurse: { color: "bg-green-500/20 text-green-700", label: "Nurse" },
      receptionist: { color: "bg-purple-500/20 text-purple-700", label: "Receptionist" },
      admin: { color: "bg-red-500/20 text-red-700", label: "Admin" },
    }

    const variant = variants[role as keyof typeof variants] || variants.doctor
    return <Badge className={`${variant.color} hover:${variant.color}`}>{variant.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { color: "bg-green-500/20 text-green-700", icon: CheckCircle },
      inactive: { color: "bg-gray-500/20 text-gray-700", icon: Clock },
      on_leave: { color: "bg-yellow-500/20 text-yellow-700", icon: Clock },
    }

    const variant = variants[status as keyof typeof variants] || variants.active
    const Icon = variant.icon

    return (
      <Badge className={`${variant.color} hover:${variant.color}`}>
        <Icon className="mr-1 h-3 w-3" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const handleAction = (action: string, staffId: string) => {
    console.log(`${action} staff member ${staffId}`)
    // Implement action logic
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
          <p className="text-muted-foreground">
            Manage clinic staff, roles, and schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter((s) => s.role === "doctor" && s.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.reduce((sum, s) => sum + s.appointmentsToday, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Patient Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                staff
                  .filter((s) => s.role === "doctor")
                  .reduce((sum, s) => sum + s.appointmentsToday, 0) /
                  Math.max(
                    staff.filter((s) => s.role === "doctor" && s.status === "active").length,
                    1
                  )
              )}
            </div>
            <p className="text-xs text-muted-foreground">Per doctor today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staff">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="staff">Staff List</TabsTrigger>
          <TabsTrigger value="schedule">Schedules</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        {/* Staff List Tab */}
        <TabsContent value="staff" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Clinic Staff</CardTitle>
                  <CardDescription>
                    View and manage all staff members
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search staff..."
                      className="pl-10 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="doctor">Doctors</SelectItem>
                      <SelectItem value="nurse">Nurses</SelectItem>
                      <SelectItem value="receptionist">Receptionists</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredStaff.length > 0 ? (
                <div className="space-y-4">
                  {filteredStaff.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="text-lg">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{member.name}</h3>
                                {getRoleBadge(member.role)}
                                {getStatusBadge(member.status)}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Mail className="mr-2 h-4 w-4" />
                                  {member.email}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="mr-2 h-4 w-4" />
                                  {member.phone}
                                </div>
                                {member.specialization && (
                                  <div className="flex items-center">
                                    <Shield className="mr-2 h-4 w-4" />
                                    {member.specialization}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Joined {member.joinDate.toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <Users className="mr-2 h-4 w-4" />
                                  {member.appointmentsToday} appointments today
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              View Schedule
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleAction("edit", member.id)}
                                >
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleAction("schedule", member.id)}
                                >
                                  Update Schedule
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleAction("message", member.id)}
                                >
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleAction("deactivate", member.id)}
                                  className="text-red-600"
                                >
                                  Deactivate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold">No staff found</h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : "No staff members have been added yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedule" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Schedules</CardTitle>
              <CardDescription>
                View and manage staff working hours and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff
                  .filter((s) => s.status === "active")
                  .map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{member.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {getRoleBadge(member.role)}
                                <span className="text-sm text-muted-foreground">
                                  • {member.schedule}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {member.appointmentsToday} appointments
                            </p>
                            <p className="text-sm text-muted-foreground">Today</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Configure access permissions for different roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    role: "Admin",
                    description: "Full system access and management",
                    permissions: [
                      "Manage all patients",
                      "Manage all appointments",
                      "Manage staff and roles",
                      "View all reports",
                      "System configuration",
                    ],
                  },
                  {
                    role: "Doctor",
                    description: "Medical staff with patient care access",
                    permissions: [
                      "View assigned patients",
                      "Create and update medical records",
                      "Prescribe medications",
                      "View patient history",
                      "Update appointment status",
                    ],
                  },
                  {
                    role: "Nurse",
                    description: "Clinical support staff",
                    permissions: [
                      "View patient vitals",
                      "Update basic patient info",
                      "Schedule appointments",
                      "View medication lists",
                      "Basic record updates",
                    ],
                  },
                  {
                    role: "Receptionist",
                    description: "Front desk and scheduling staff",
                    permissions: [
                      "Schedule appointments",
                      "Register new patients",
                      "View appointment calendar",
                      "Send reminders",
                      "Basic patient updates",
                    ],
                  },
                ].map((roleConfig, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{roleConfig.role}</h3>
                            <Badge variant="outline">
                              {staff.filter((s) => s.role === roleConfig.role.toLowerCase())
                                .length}{" "}
                              staff
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {roleConfig.description}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {roleConfig.permissions.map((permission, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Edit Permissions
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
  )
}