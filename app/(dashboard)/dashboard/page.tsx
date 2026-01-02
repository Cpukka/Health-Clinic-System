"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Calendar, Users, FileText, Bell, Activity, TrendingUp, Clock } from "lucide-react"
import { format } from "date-fns"

export default function DashboardPage() {
  const stats = [
    { title: "Total Appointments", value: "156", icon: Calendar, change: "+12%" },
    { title: "Active Patients", value: "342", icon: Users, change: "+8%" },
    { title: "Medical Records", value: "1,234", icon: FileText, change: "+23%" },
    { title: "Notifications", value: "3", icon: Bell, change: "New" },
  ]

  const appointments = [
    { id: 1, patient: "John Doe", time: "10:00 AM", type: "Consultation", status: "confirmed" },
    { id: 2, patient: "Sarah Johnson", time: "11:30 AM", type: "Follow-up", status: "pending" },
    { id: 3, patient: "Michael Chen", time: "2:00 PM", type: "Check-up", status: "confirmed" },
    { id: 4, patient: "Emma Wilson", time: "3:30 PM", type: "Vaccination", status: "cancelled" },
  ]

  const recentActivity = [
    { icon: Users, title: "New patient registered", time: "10 min ago" },
    { icon: TrendingUp, title: "Appointment confirmed", time: "30 min ago" },
    { icon: Activity, title: "Medical record updated", time: "1 hour ago" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your clinic today.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Appointments Overview</CardTitle>
            <CardDescription>
              Today&apos;s scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="font-medium text-primary">
                        {appointment.patient.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {appointment.time} • {appointment.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Clinic Activity</CardTitle>
            <CardDescription>
              Recent events and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>
              Recently added patient records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Robert Brown", lastVisit: "2 days ago", status: "Active" },
                { name: "Lisa Garcia", lastVisit: "1 week ago", status: "Active" },
                { name: "David Wilson", lastVisit: "3 days ago", status: "Urgent" },
              ].map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="font-medium text-primary">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">Last visit: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    patient.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {patient.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Patients
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create Medical Record
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              View Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}