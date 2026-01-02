"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import {
  DollarSign,
  CreditCard,
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { format } from "date-fns"

interface Invoice {
  id: string
  patientName: string
  patientId: string
  amount: number
  status: "paid" | "pending" | "overdue" | "cancelled"
  dueDate: Date
  paidDate?: Date
  services: string[]
  insuranceCovered: number
  patientResponsibility: number
}

interface InsuranceClaim {
  id: string
  patientName: string
  claimNumber: string
  status: "submitted" | "approved" | "rejected" | "pending"
  amount: number
  submittedDate: Date
  processedDate?: Date
  insuranceProvider: string
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-2023-001",
      patientName: "John Doe",
      patientId: "P001",
      amount: 250.00,
      status: "paid",
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      paidDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      services: ["Consultation", "Lab Tests"],
      insuranceCovered: 200.00,
      patientResponsibility: 50.00,
    },
    {
      id: "INV-2023-002",
      patientName: "Jane Smith",
      patientId: "P002",
      amount: 150.00,
      status: "pending",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      services: ["Follow-up Visit"],
      insuranceCovered: 100.00,
      patientResponsibility: 50.00,
    },
  ])

  const [claims, setClaims] = useState<InsuranceClaim[]>([
    {
      id: "CLM-001",
      patientName: "John Doe",
      claimNumber: "IC-7890123",
      status: "approved",
      amount: 200.00,
      submittedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      processedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      insuranceProvider: "Premium Health HMO",
    },
    {
      id: "CLM-002",
      patientName: "Jane Smith",
      claimNumber: "IC-7890124",
      status: "submitted",
      amount: 100.00,
      submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      insuranceProvider: "Premium Health HMO",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("invoices")

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || inv.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const overdueInvoices = invoices.filter(
    (inv) => inv.status === "pending" && new Date() > inv.dueDate
  )

  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const handleSendReminder = (invoiceId: string) => {
    console.log("Sending reminder for invoice:", invoiceId)
    // Implement reminder logic
  }

  const handleProcessPayment = (invoiceId: string) => {
    console.log("Processing payment for invoice:", invoiceId)
    // Implement payment processing
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: { color: "bg-green-500/20 text-green-700", icon: CheckCircle },
      pending: { color: "bg-yellow-500/20 text-yellow-700", icon: Clock },
      overdue: { color: "bg-red-500/20 text-red-700", icon: AlertCircle },
      cancelled: { color: "bg-gray-500/20 text-gray-700", icon: AlertCircle },
    }

    const statusInfo = variants[status as keyof typeof variants] || variants.pending
    const Icon = statusInfo.icon

    return (
      <Badge className={`${statusInfo.color} hover:${statusInfo.color}`}>
        <Icon className="mr-1 h-3 w-3" />
        {status.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Billing & Insurance</h2>
          <p className="text-muted-foreground">
            Manage invoices, payments, and insurance claims
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {overdueInvoices.length} overdue invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-0.5 days</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Claims Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2.1%</span> from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="claims">Insurance Claims</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>
                    View and manage all patient invoices
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-10 w-full sm:w-62.5"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-37.5">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredInvoices.length > 0 ? (
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <Card key={invoice.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-full bg-primary/10 p-2">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{invoice.id}</h3>
                                  {getStatusBadge(invoice.status)}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <User className="mr-1 h-3 w-3" />
                                    {invoice.patientName}
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    Due: {format(invoice.dueDate, "MMM d, yyyy")}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                  Total Amount
                                </div>
                                <p className="text-xl font-bold">
                                  ${invoice.amount.toFixed(2)}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                  Insurance Covered
                                </div>
                                <p className="font-medium">
                                  ${invoice.insuranceCovered.toFixed(2)}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                  Patient Responsibility
                                </div>
                                <p className="font-medium">
                                  ${invoice.patientResponsibility.toFixed(2)}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                  Services
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {invoice.services.map((service, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {invoice.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleProcessPayment(invoice.id)}
                                >
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Process Payment
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendReminder(invoice.id)}
                                >
                                  Send Reminder
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                        </div>

                        {invoice.paidDate && (
                          <>
                            <Separator className="my-4" />
                            <div className="text-sm text-muted-foreground">
                              Paid on {format(invoice.paidDate, "MMM d, yyyy")}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold">No invoices found</h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : "No invoices have been created yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {overdueInvoices.length > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Overdue Invoices ({overdueInvoices.length})
                </CardTitle>
                <CardDescription>
                  These invoices are past their due date and require immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between rounded-lg border border-red-200 bg-white p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{invoice.id}</span>
                          <Badge variant="destructive">OVERDUE</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {invoice.patientName} • Due {format(invoice.dueDate, "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-red-700">
                          ${invoice.amount.toFixed(2)}
                        </p>
                        <Button size="sm" variant="destructive">
                          Send Urgent Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Claims</CardTitle>
              <CardDescription>
                Track and manage insurance claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claims.map((claim) => (
                  <Card key={claim.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-blue-500/10 p-2">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{claim.claimNumber}</h3>
                                <Badge
                                  variant={
                                    claim.status === "approved"
                                      ? "default"
                                      : claim.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className={
                                    claim.status === "approved"
                                      ? "bg-green-500/20 text-green-700 hover:bg-green-500/20"
                                      : ""
                                  }
                                >
                                  {claim.status.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <User className="mr-1 h-3 w-3" />
                                  {claim.patientName}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  Submitted: {format(claim.submittedDate, "MMM d, yyyy")}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">
                                Claim Amount
                              </div>
                              <p className="text-xl font-bold">
                                ${claim.amount.toFixed(2)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">
                                Insurance Provider
                              </div>
                              <p className="font-medium">{claim.insuranceProvider}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">
                                Status
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{claim.status}</span>
                                {claim.processedDate && (
                                  <span className="text-sm text-muted-foreground">
                                    • Processed: {format(claim.processedDate, "MMM d")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {claim.status === "submitted" && (
                            <Button size="sm" variant="outline">
                              Check Status
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download Documents
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { patient: "John Doe", amount: "$250.00", method: "Credit Card", date: "Today" },
                { patient: "Jane Smith", amount: "$150.00", method: "Insurance", date: "Yesterday" },
                { patient: "Robert Wilson", amount: "$180.00", method: "Cash", date: "2 days ago" },
                { patient: "Emily Davis", amount: "$95.00", method: "Credit Card", date: "3 days ago" },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.patient}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • {payment.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{payment.amount}</p>
                    <Badge variant="outline" className="text-xs">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insurance Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Premium Health HMO", claims: 45, successRate: "96%" },
                { name: "MediCare Plus", claims: 32, successRate: "92%" },
                { name: "HealthFirst Insurance", claims: 28, successRate: "89%" },
                { name: "WellCare Plans", claims: 22, successRate: "94%" },
              ].map((provider, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {provider.claims} claims processed
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20">
                      {provider.successRate} success
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}