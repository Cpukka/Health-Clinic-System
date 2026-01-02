"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Users, Calendar, Clock, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "Total Patients",
    value: "1,254",
    change: "+12%",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Today's Appointments",
    value: "24",
    change: "+2",
    icon: Calendar,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Waiting Patients",
    value: "8",
    change: "-3",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Completed Today",
    value: "16",
    change: "+4",
    icon: CheckCircle,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{stat.change}</span> from yesterday
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}