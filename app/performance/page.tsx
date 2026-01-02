"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Activity, Database, Users, Clock } from "lucide-react"

export default function PerformancePage() {
  const [metrics, setMetrics] = useState({
    dbQueries: 0,
    responseTime: 0,
    activeUsers: 0,
    memoryUsage: 0,
  })

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch('/api/metrics')
      const data = await response.json()
      setMetrics(data)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Performance Metrics</h2>
        <p className="text-muted-foreground">
          Real-time system performance and health monitoring
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Queries</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dbQueries}/sec</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              -8.2% from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              +4 from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB
            </div>
            <p className="text-xs text-muted-foreground">
              +0.5% from last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-75 flex items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">
              Real-time performance graph would be displayed here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}