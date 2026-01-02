"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { Progress } from "@/app/components/ui/progress"
import { Input } from "@/app/components/ui/input"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Heart,
  Activity,
  Thermometer,
  Scale,
  Droplets,
  Moon,
  Calendar,
  Plus,
  TrendingUp,
  TrendingDown,
  Bell,
  Download,
  Share2,
  Target,
  Zap,
  Coffee,
  Utensils,
} from "lucide-react"
import { format } from "date-fns"

export default function HealthTrackPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [healthData, setHealthData] = useState<any>(null)
  const [newEntry, setNewEntry] = useState({
    type: "bloodPressure",
    systolic: "",
    diastolic: "",
    heartRate: "",
    weight: "",
    temperature: "",
    bloodSugar: "",
    sleepHours: "",
    notes: "",
  })

  useEffect(() => {
    // Mock health data - in production, fetch from API
    const mockData = {
      overview: {
        currentHealthScore: 78,
        dailyGoalProgress: 85,
        weeklySteps: 45230,
        avgHeartRate: 72,
        avgSleep: 7.2,
        lastCheckup: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      vitals: {
        bloodPressure: [
          { date: "Mon", systolic: 120, diastolic: 80 },
          { date: "Tue", systolic: 122, diastolic: 82 },
          { date: "Wed", systolic: 118, diastolic: 78 },
          { date: "Thu", systolic: 121, diastolic: 79 },
          { date: "Fri", systolic: 119, diastolic: 80 },
          { date: "Sat", systolic: 120, diastolic: 81 },
          { date: "Sun", systolic: 118, diastolic: 79 },
        ],
        heartRate: [
          { time: "6 AM", rate: 68 },
          { time: "12 PM", rate: 72 },
          { time: "6 PM", rate: 75 },
          { time: "12 AM", rate: 65 },
        ],
        weight: [
          { date: "Week 1", weight: 75.2 },
          { date: "Week 2", weight: 74.8 },
          { date: "Week 3", weight: 74.5 },
          { date: "Week 4", weight: 74.2 },
        ],
        temperature: [
          { date: "Mon", temp: 36.6 },
          { date: "Tue", temp: 36.7 },
          { date: "Wed", temp: 36.5 },
          { date: "Thu", temp: 36.8 },
          { date: "Fri", temp: 36.6 },
        ],
      },
      dailyLogs: [
        {
          date: new Date(),
          steps: 8450,
          calories: 2200,
          water: 2.5,
          sleep: 7.5,
          mood: "good",
          activities: ["30min Walk", "Yoga"],
        },
        {
          date: new Date(Date.now() - 86400000),
          steps: 7210,
          calories: 2350,
          water: 2.0,
          sleep: 6.8,
          mood: "neutral",
          activities: ["Gym", "Meditation"],
        },
        {
          date: new Date(Date.now() - 2 * 86400000),
          steps: 9230,
          calories: 2100,
          water: 2.8,
          sleep: 8.2,
          mood: "excellent",
          activities: ["Running", "Swimming"],
        },
      ],
      goals: [
        { id: 1, title: "10,000 Steps Daily", progress: 84, target: 100, unit: "steps" },
        { id: 2, title: "8 Hours Sleep", progress: 94, target: 100, unit: "hours" },
        { id: 3, title: "2L Water Daily", progress: 75, target: 100, unit: "liters" },
        { id: 4, title: "Lose 5kg", progress: 60, target: 100, unit: "kg" },
      ],
      alerts: [
        { id: 1, type: "warning", message: "Blood pressure slightly elevated", time: "2 hours ago" },
        { id: 2, type: "info", message: "Sleep quality improved by 15%", time: "1 day ago" },
        { id: 3, type: "success", message: "Weight loss goal on track", time: "3 days ago" },
      ],
    }
    setHealthData(mockData)
  }, [])

  const handleNewEntry = () => {
    // In production, send to API
    console.log("New health entry:", newEntry)
    setNewEntry({
      type: "bloodPressure",
      systolic: "",
      diastolic: "",
      heartRate: "",
      weight: "",
      temperature: "",
      bloodSugar: "",
      sleepHours: "",
      notes: "",
    })
  }

  if (!healthData) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading health data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Track</h1>
          <p className="text-muted-foreground">
            Monitor and manage your health metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Log Health Data
          </Button>
        </div>
      </div>

      {/* Health Score & Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Health Score
            </CardTitle>
            <CardDescription>
              Overall health assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl font-bold text-primary">
                  {healthData.overview.currentHealthScore}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {healthData.overview.currentHealthScore >= 80
                    ? "Excellent health"
                    : healthData.overview.currentHealthScore >= 60
                    ? "Good health"
                    : "Needs improvement"}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  +5% from last month
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Daily goal progress: {healthData.overview.dailyGoalProgress}%
                </p>
              </div>
            </div>
            <Progress value={healthData.overview.currentHealthScore} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Steps This Week</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthData.overview.weeklySteps.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
              <span>12% increase from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.overview.avgHeartRate} BPM</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingDown className="mr-1 h-4 w-4 text-green-600" />
              <span>Normal resting rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="logs">Daily Logs</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Blood Pressure Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure</CardTitle>
                <CardDescription>7-day trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData.vitals.bloodPressure}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="systolic"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Systolic"
                      />
                      <Line
                        type="monotone"
                        dataKey="diastolic"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Diastolic"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Heart Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate</CardTitle>
                <CardDescription>Daily variation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={healthData.vitals.heartRate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#ef4444" name="BPM" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Log Entry */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Health Log</CardTitle>
              <CardDescription>
                Log your daily health metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Pressure</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="120"
                      value={newEntry.systolic}
                      onChange={(e) => setNewEntry({ ...newEntry, systolic: e.target.value })}
                    />
                    <span className="self-center">/</span>
                    <Input
                      placeholder="80"
                      value={newEntry.diastolic}
                      onChange={(e) => setNewEntry({ ...newEntry, diastolic: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heart Rate</label>
                  <Input
                    placeholder="72"
                    value={newEntry.heartRate}
                    onChange={(e) => setNewEntry({ ...newEntry, heartRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <Input
                    placeholder="75.0"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sleep (hours)</label>
                  <Input
                    placeholder="7.5"
                    value={newEntry.sleepHours}
                    onChange={(e) => setNewEntry({ ...newEntry, sleepHours: e.target.value })}
                  />
                </div>
              </div>
              <Button className="mt-4" onClick={handleNewEntry}>
                <Plus className="mr-2 h-4 w-4" />
                Log Entry
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals Tab */}
        <TabsContent value="vitals" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Weight Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData.vitals.weight}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={healthData.vitals.temperature}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="temp" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vitals Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Vitals Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Heart Rate</h3>
                  <p className="text-2xl font-bold">{healthData.overview.avgHeartRate} BPM</p>
                  <p className="text-sm text-muted-foreground">Resting average</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Blood Pressure</h3>
                  <p className="text-2xl font-bold">120/80</p>
                  <p className="text-sm text-muted-foreground">Normal range</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Scale className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Weight</h3>
                  <p className="text-2xl font-bold">74.2 kg</p>
                  <p className="text-sm text-muted-foreground">-1kg this month</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Thermometer className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold">Temperature</h3>
                  <p className="text-2xl font-bold">36.6°C</p>
                  <p className="text-sm text-muted-foreground">Normal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Logs</CardTitle>
              <CardDescription>
                Track your daily health activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthData.dailyLogs.map((log: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold">
                              {format(log.date, "EEEE, MMMM d")}
                            </h3>
                            <Badge variant="outline" className={
                              log.mood === "excellent" ? "bg-green-100 text-green-800" :
                              log.mood === "good" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }>
                              {log.mood}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {log.steps.toLocaleString()} steps
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Steps</p>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-600" />
                            <span className="text-xl font-bold">{log.steps.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Calories</p>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-600" />
                            <span className="text-xl font-bold">{log.calories}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Water</p>
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span className="text-xl font-bold">{log.water}L</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Sleep</p>
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-purple-600" />
                            <span className="text-xl font-bold">{log.sleep}h</span>
                          </div>
                        </div>
                      </div>
                      {log.activities.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Activities</p>
                          <div className="flex flex-wrap gap-2">
                            {log.activities.map((activity: string, idx: number) => (
                              <Badge key={idx} variant="outline">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Goals</CardTitle>
              <CardDescription>
                Track your progress towards health objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthData.goals.map((goal: any) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Progress: {goal.progress}% • Target: {goal.target}{goal.unit}
                        </p>
                      </div>
                      <Badge className={
                        goal.progress >= 80 ? "bg-green-100 text-green-800" :
                        goal.progress >= 50 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {goal.progress >= 80 ? "On Track" :
                         goal.progress >= 50 ? "Making Progress" :
                         "Needs Attention"}
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Goal Form */}
          <Card>
            <CardHeader>
              <CardTitle>Set New Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Goal Type</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Steps</option>
                      <option>Weight</option>
                      <option>Sleep</option>
                      <option>Water Intake</option>
                      <option>Exercise Minutes</option>
                      <option>Meditation</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Value</label>
                    <Input placeholder="e.g., 10000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Goal Description</label>
                  <Input placeholder="e.g., Walk 10,000 steps daily" />
                </div>
                <Button className="w-full">
                  <Target className="mr-2 h-4 w-4" />
                  Create Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Insights</CardTitle>
              <CardDescription>
                Personalized health recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthData.alerts.map((alert: any) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-4 rounded-lg ${
                      alert.type === "warning"
                        ? "bg-yellow-50 border border-yellow-200"
                        : alert.type === "info"
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <Bell className={`h-5 w-5 mt-0.5 ${
                      alert.type === "warning"
                        ? "text-yellow-600"
                        : alert.type === "info"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`} />
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Total Steps", value: "45,230", change: "+12%" },
                    { label: "Avg Sleep", value: "7.2h", change: "+0.5h" },
                    { label: "Water Intake", value: "2.3L/day", change: "+0.3L" },
                    { label: "Active Minutes", value: "245min", change: "+15%" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.value}</span>
                        <Badge variant="outline" className={
                          item.change.startsWith("+")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }>
                          {item.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Coffee, text: "Limit caffeine after 2 PM for better sleep" },
                  { icon: Utensils, text: "Include more vegetables in your meals" },
                  { icon: Activity, text: "Take short walking breaks every hour" },
                  { icon: Moon, text: "Maintain consistent sleep schedule" },
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <tip.icon className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm">{tip.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}