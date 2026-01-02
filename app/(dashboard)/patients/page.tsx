"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { AdvancedSearch } from "@/app/components/search/advanced-search"
import { PatientsTable } from "../../components/patients/patients-table"
import { Plus, Download, Upload, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"all" | "active" | "inactive">("all")

  const handleExport = () => {
    console.log("Exporting patients...")
  }

  const handleImport = () => {
    console.log("Importing patients...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">
            Manage patient records and information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport()}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport()}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport()}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>
            Search, filter, and manage patient records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Search</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4 pt-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search patients by name, phone, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Button>Search</Button>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <AdvancedSearch />
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4 pt-4">
              <div className="rounded-lg border p-6 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-lg font-semibold">Bulk Operations</h3>
                <p className="mt-2 text-muted-foreground">
                  Upload CSV files to import multiple patients or perform bulk updates
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={handleImport}>
                    Import Patients
                  </Button>
                  <Button variant="outline">
                    Bulk Update
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    Export All
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>
              All registered patients in the system
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg">
              <Button
                variant={view === "all" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("all")}
                className="rounded-r-none"
              >
                All Patients
              </Button>
              <Button
                variant={view === "active" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("active")}
                className="rounded-none"
              >
                Active
              </Button>
              <Button
                variant={view === "inactive" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("inactive")}
                className="rounded-l-none"
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PatientsTable filter={view} searchQuery={searchQuery} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,254</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">984</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-green-500">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avg. Visits/Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.2</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-green-500">+0.4</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}