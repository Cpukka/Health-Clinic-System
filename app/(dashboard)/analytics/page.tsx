"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const appointmentData = [
  { month: 'Jan', scheduled: 400, completed: 380, cancelled: 20 },
  { month: 'Feb', scheduled: 450, completed: 420, cancelled: 30 },
  { month: 'Mar', scheduled: 500, completed: 480, cancelled: 20 },
  { month: 'Apr', scheduled: 520, completed: 500, cancelled: 20 },
  { month: 'May', scheduled: 550, completed: 530, cancelled: 20 },
  { month: 'Jun', scheduled: 600, completed: 580, cancelled: 20 },
]

const specialtyData = [
  { name: 'General', value: 35 },
  { name: 'Cardiology', value: 20 },
  { name: 'Pediatrics', value: 15 },
  { name: 'Orthopedics', value: 15 },
  { name: 'Dermatology', value: 10 },
  { name: 'Other', value: 5 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Insights and performance metrics for your clinic
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scheduled" fill="#8884d8" />
                <Bar dataKey="completed" fill="#82ca9d" />
                <Bar dataKey="cancelled" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specialty Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={specialtyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {specialtyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Patient Satisfaction Score</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { month: 'Jan', score: 4.2 },
                { month: 'Feb', score: 4.3 },
                { month: 'Mar', score: 4.5 },
                { month: 'Apr', score: 4.6 },
                { month: 'May', score: 4.7 },
                { month: 'Jun', score: 4.8 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Wait Time</span>
                <span className="font-semibold">12 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">No-show Rate</span>
                <span className="font-semibold">4.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Patient Retention</span>
                <span className="font-semibold">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Consultation</span>
                <span className="font-semibold">22 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}