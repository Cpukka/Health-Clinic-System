"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { AppointmentCalendar } from "@/app/components/appointments/appointment-calendar"
import { AppointmentList } from "@/app/components/appointments/appointment-list"
import { Plus, Calendar, List, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../../components/ui/dropdown-menu"

export default function AppointmentsPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [statusFilter, setStatusFilter] = useState({
    scheduled: true,
    confirmed: true,
    cancelled: false,
    completed: true,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">
            Manage and schedule patient appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(statusFilter).map(([key, value]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    setStatusFilter({ ...statusFilter, [key]: checked })
                  }
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="hidden sm:flex border rounded-lg">
            <Button
              variant={view === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
              className="rounded-r-none"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="rounded-l-none"
            >
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
          </div>
          
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Overview</CardTitle>
            <CardDescription>
              View and manage all appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="space-y-4 pt-4">
                {view === "calendar" ? (
                  <AppointmentCalendar />
                ) : (
                  <AppointmentList filter="today" />
                )}
              </TabsContent>
              
              <TabsContent value="upcoming" className="space-y-4 pt-4">
                <AppointmentList filter="upcoming" />
              </TabsContent>
              
              <TabsContent value="past" className="space-y-4 pt-4">
                <AppointmentList filter="past" />
              </TabsContent>
              
              <TabsContent value="all" className="space-y-4 pt-4">
                <AppointmentList filter="all" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Today's Appointments", value: "12", change: "+2" },
                  { label: "Waiting Patients", value: "3", change: "-1" },
                  { label: "Avg. Wait Time", value: "15 min", change: "-2 min" },
                  { label: "No-show Rate", value: "4.2%", change: "-0.8%" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-medium ${
                      stat.change.startsWith('+') 
                        ? 'bg-green-500/20 text-green-700'
                        : stat.change.startsWith('-')
                        ? 'bg-red-500/20 text-red-700'
                        : 'bg-blue-500/20 text-blue-700'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Appointment confirmed", time: "10 min ago", user: "Dr. Smith" },
                  { action: "Patient checked in", time: "25 min ago", user: "Nurse Jane" },
                  { action: "Appointment rescheduled", time: "1 hour ago", user: "John Doe" },
                  { action: "New patient registered", time: "2 hours ago", user: "System" },
                ].map((action, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{action.action}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{action.time}</span>
                        <span className="mx-2">•</span>
                        <span>by {action.user}</span>
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