"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Separator } from "@/app/components/ui/separator"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Calendar,
  Download,
  FileText,
  BarChart3,
  Users,
  Calendar as CalendarIcon,
  TrendingUp,
  Filter,
  Printer,
} from "lucide-react"
import { Calendar as CalendarComponent } from "@/app/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })
  const [reportType, setReportType] = useState("appointments")
  const [formatType, setFormatType] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTemplates = [
    {
      id: "appointments",
      name: "Appointments Report",
      description: "Daily, weekly, and monthly appointment statistics",
      icon: CalendarIcon,
    },
    {
      id: "patients",
      name: "Patient Demographics",
      description: "Patient age groups, gender distribution, and locations",
      icon: Users,
    },
    {
      id: "revenue",
      name: "Revenue Report",
      description: "Income, expenses, and profitability analysis",
      icon: TrendingUp,
    },
    {
      id: "medical",
      name: "Medical Statistics",
      description: "Common diagnoses, prescriptions, and treatment outcomes",
      icon: FileText,
    },
    {
      id: "performance",
      name: "Clinic Performance",
      description: "Staff productivity and operational metrics",
      icon: BarChart3,
    },
    {
      id: "custom",
      name: "Custom Report",
      description: "Build your own report with custom filters",
      icon: Filter,
    },
  ]

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      console.log("Generating report:", {
        reportType,
        dateRange,
        formatType,
      })
      // Implement report generation logic
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate delay
      alert("Report generated successfully!")
    } catch (error) {
      console.error("Failed to generate report:", error)
      alert("Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Generate detailed reports and analytics for your clinic
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Generator</CardTitle>
              <CardDescription>
                Configure and generate custom reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center">
                            <template.icon className="mr-2 h-4 w-4" />
                            {template.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={(range) =>
                            setDateRange(range as { from: Date; to: Date })
                          }
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Export Format</Label>
                    <Select value={formatType} onValueChange={setFormatType}>
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {reportType === "custom" && (
                  <div className="space-y-4">
                    <Separator />
                    <div>
                      <Label htmlFor="custom-filters">Custom Filters</Label>
                      <Input
                        id="custom-filters"
                        placeholder="Enter custom filter criteria..."
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="doctor-filter">Filter by Doctor</Label>
                        <Select>
                          <SelectTrigger id="doctor-filter">
                            <SelectValue placeholder="All doctors" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Doctors</SelectItem>
                            <SelectItem value="doc1">Dr. Sarah Johnson</SelectItem>
                            <SelectItem value="doc2">Dr. Michael Chen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status-filter">Filter by Status</Label>
                        <Select>
                          <SelectTrigger id="status-filter">
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Preview</Button>
                <Button onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Pre-configured report templates for common needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {reportTemplates.map((template) => {
                  const Icon = template.icon
                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        reportType === template.id
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                      onClick={() => setReportType(template.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`rounded-lg p-2 ${
                              reportType === template.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Monthly Appointments",
                    generated: "Today, 10:30 AM",
                    size: "2.4 MB",
                  },
                  {
                    name: "Q3 Revenue Analysis",
                    generated: "Yesterday, 2:15 PM",
                    size: "1.8 MB",
                  },
                  {
                    name: "Patient Demographics",
                    generated: "3 days ago",
                    size: "3.2 MB",
                  },
                  {
                    name: "Staff Performance",
                    generated: "1 week ago",
                    size: "1.5 MB",
                  },
                ].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Generated {report.generated}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {report.size}
                      </span>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Reports Generated", value: "1,248", change: "+124" },
                { label: "Avg. Report Size", value: "2.1 MB", change: "-0.3 MB" },
                { label: "Most Popular", value: "Appointments", change: "" },
                { label: "Export Success", value: "99.8%", change: "+0.2%" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                  {stat.change && (
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        stat.change.startsWith("+") || stat.change.endsWith("%")
                          ? "bg-green-500/20 text-green-700"
                          : "bg-red-500/20 text-red-700"
                      }`}
                    >
                      {stat.change}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "Weekly Summary",
                    schedule: "Every Monday, 8:00 AM",
                    recipients: 3,
                  },
                  {
                    name: "Monthly Billing",
                    schedule: "1st of month, 9:00 AM",
                    recipients: 2,
                  },
                  {
                    name: "Quarterly Review",
                    schedule: "Next quarter",
                    recipients: 5,
                  },
                ].map((scheduled, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{scheduled.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {scheduled.schedule}
                      </p>
                    </div>
                    <Badge variant="outline">{scheduled.recipients} recipients</Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                + Schedule New Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}