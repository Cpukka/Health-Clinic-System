"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { AppointmentCalendar } from "@/app/components/appointments/appointment-calendar"
import { AppointmentList } from "@/app/components/appointments/appointment-list"
import { Plus, Calendar, List, Filter, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/app/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function AppointmentsPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [filter, setFilter] = useState("today")
  const [isLoading, setIsLoading] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState({
    today: 0,
    upcoming: 0,
    total: 0
  })

  const fetchAppointments = async (filterType: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/appointments?filter=${filterType}`)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments || [])
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
      toast.error("Failed to load appointments")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch stats from API or calculate from appointments
      const todayResponse = await fetch('/api/appointments?filter=today')
      const upcomingResponse = await fetch('/api/appointments?filter=upcoming')
      const allResponse = await fetch('/api/appointments?filter=all')

      if (todayResponse.ok && upcomingResponse.ok && allResponse.ok) {
        const todayData = await todayResponse.json()
        const upcomingData = await upcomingResponse.json()
        const allData = await allResponse.json()

        setStats({
          today: todayData.appointments?.length || 0,
          upcoming: upcomingData.appointments?.length || 0,
          total: allData.appointments?.length || 0
        })
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  useEffect(() => {
    fetchAppointments(filter)
    fetchStats()
  }, [filter])

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
              {["scheduled", "confirmed", "cancelled", "completed"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={filter === status}
                  onCheckedChange={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
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
          
          <Link href="/appointments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Loading appointments...</p>
          </div>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Appointment Overview</CardTitle>
              <CardDescription>
                View and manage all appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="today" value={filter} onValueChange={setFilter}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="today">Today ({stats.today})</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming ({stats.upcoming})</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="today" className="space-y-4 pt-4">
                  {view === "calendar" ? (
                    <AppointmentCalendar />
                  ) : (
                    <AppointmentList appointments={appointments} />
                  )}
                </TabsContent>
                
                <TabsContent value="upcoming" className="space-y-4 pt-4">
                  <AppointmentList appointments={appointments} />
                </TabsContent>
                
                <TabsContent value="past" className="space-y-4 pt-4">
                  <AppointmentList appointments={appointments} />
                </TabsContent>
                
                <TabsContent value="all" className="space-y-4 pt-4">
                  <AppointmentList appointments={appointments} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}