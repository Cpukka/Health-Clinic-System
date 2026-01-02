"use client"

import { useState } from "react"
import { Search, Filter, Calendar, User } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { Calendar as CalendarComponent } from "../../components/ui/calendar"

interface SearchFilters {
  query: string
  type: 'patient' | 'appointment' | 'record'
  status?: string
  dateRange?: {
    from: Date
    to: Date
  }
  doctorId?: string
}

export function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'patient',
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = async () => {
    // Implement search logic
    console.log('Searching with filters:', filters)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients, appointments, records..."
            className="pl-10"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
        </div>
        <Select
          value={filters.type}
          onValueChange={(value: 'patient' | 'appointment' | 'record') =>
            setFilters({ ...filters, type: value })
          }
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Search type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patient">
              <User className="mr-2 h-4 w-4 inline" />
              Patients
            </SelectItem>
            <SelectItem value="appointment">
              <Calendar className="mr-2 h-4 w-4 inline" />
              Appointments
            </SelectItem>
            <SelectItem value="record">Medical Records</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="rounded-lg border p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Select dates
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: filters.dateRange?.from,
                      to: filters.dateRange?.to,
                    }}
                    onSelect={(range) =>
                      setFilters({
                        ...filters,
                        dateRange: range as { from: Date; to: Date },
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Status
              </label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Doctor
              </label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, doctorId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doc1">Dr. Sarah Johnson</SelectItem>
                  <SelectItem value="doc2">Dr. Michael Chen</SelectItem>
                  <SelectItem value="doc3">Dr. Emily Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  query: '',
                  type: 'patient',
                })
                setShowFilters(false)
              }}
            >
              Clear All
            </Button>
            <Button onClick={handleSearch}>Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  )
}