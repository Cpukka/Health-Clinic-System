"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Badge } from "@/app/components/ui/badge"
import { User, Phone, Mail, Calendar, ArrowUpRight } from "lucide-react"

const patients = [
  {
    id: "1",
    name: "John Doe",
    initials: "JD",
    lastVisit: "Today, 10:30 AM",
    nextAppointment: "Tomorrow, 2:00 PM",
    status: "active" as const,
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    initials: "JS",
    lastVisit: "Yesterday, 3:15 PM",
    nextAppointment: "Next week",
    status: "active" as const,
    phone: "+1 (555) 234-5678",
    email: "jane.smith@example.com",
  },
  {
    id: "3",
    name: "Robert Wilson",
    initials: "RW",
    lastVisit: "2 days ago",
    nextAppointment: "Not scheduled",
    status: "inactive" as const,
    phone: "+1 (555) 345-6789",
    email: "robert.wilson@example.com",
  },
]

export function RecentPatients() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Patients</CardTitle>
          <CardDescription>Recently active patients</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {patient.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{patient.name}</p>
                    <Badge
                      variant={patient.status === "active" ? "default" : "secondary"}
                      className={
                        patient.status === "active"
                          ? "bg-green-500/20 text-green-700 hover:bg-green-500/20"
                          : ""
                      }
                    >
                      {patient.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Phone className="mr-1 h-3 w-3" />
                      {patient.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      {patient.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      Last visit: {patient.lastVisit}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Next: {patient.nextAppointment}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  Profile
                </Button>
                <Button size="sm">Schedule</Button>
              </div>
            </div>
          ))}
        </div>
        
        {patients.length === 0 && (
          <div className="py-8 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No recent patients</p>
            <Button className="mt-4" variant="outline">
              Add Patient
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}