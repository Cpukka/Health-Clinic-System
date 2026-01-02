"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Loader2, User, Phone, Mail, Calendar, Heart, Droplets, FileText, AlertCircle } from "lucide-react"

// Types
interface PatientFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "MALE" | "FEMALE" | "OTHER"
  phone: string
  email: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  bloodType: string
  allergies: string
  medications: string
  medicalHistory: string
  insuranceProvider: string
  insuranceId: string
  notes: string
}

interface PatientFormProps {
  patient?: PatientFormData
  isEditing?: boolean
  onSubmit?: (data: PatientFormData) => void
  onCancel?: () => void
}

export function PatientForm({
  patient: initialPatient,
  isEditing = false,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("personal")

  // Initial form data
  const [formData, setFormData] = useState<PatientFormData>(
    initialPatient || {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "MALE",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      bloodType: "",
      allergies: "",
      medications: "",
      medicalHistory: "",
      insuranceProvider: "",
      insuranceId: "",
      notes: "",
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.phone) {
        throw new Error("Please fill in all required fields")
      }

      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Default form submission
        const response = await fetch("/api/patients", {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to save patient")
        }

        // Redirect to patients list
        router.push("/patients")
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Patient" : "Add New Patient"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update patient information and medical records"
            : "Register a new patient in the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">
              <User className="mr-2 h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="medical">
              <Heart className="mr-2 h-4 w-4" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="insurance">
              <FileText className="mr-2 h-4 w-4" />
              Insurance
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, State 12345"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    placeholder="Jane Doe"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    placeholder="(555) 987-6543"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Medical Information Tab */}
            <TabsContent value="medical" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select
                    value={formData.bloodType}
                    onValueChange={(value) => handleSelectChange("bloodType", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not specified</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    placeholder="Penicillin, Peanuts, etc."
                    value={formData.allergies}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  name="medications"
                  placeholder="List current medications and dosages..."
                  value={formData.medications}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  placeholder="Chronic conditions, surgeries, family history..."
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any other relevant medical information..."
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Insurance Information Tab */}
            <TabsContent value="insurance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    name="insuranceProvider"
                    placeholder="Premium Health Insurance"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceId">Insurance ID Number</Label>
                  <Input
                    id="insuranceId"
                    name="insuranceId"
                    placeholder="INS-123456789"
                    value={formData.insuranceId}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Form Actions */}
            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel || (() => router.back())}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Patient" : "Create Patient"}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}