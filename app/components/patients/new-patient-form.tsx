"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Loader2, User, Phone, Mail, Calendar, Heart, FileText, Upload } from "lucide-react"

interface NewPatientFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function NewPatientForm({ onSuccess, onCancel }: NewPatientFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("personal")

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "MALE",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Medical Information
    bloodType: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
    height: "",
    weight: "",
    
    // Insurance Information
    insuranceProvider: "",
    insuranceId: "",
    insuranceGroup: "",
    
    // Additional
    occupation: "",
    maritalStatus: "SINGLE",
    referredBy: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.phone) {
        throw new Error("Please fill in all required fields")
      }

      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create patient")
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/patients")
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Calculate age from date of birth
  const calculateAge = () => {
    if (!formData.dateOfBirth) return ""
    const dob = new Date(formData.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    
    return `${age} years`
  }

  // Calculate BMI
  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return ""
    const heightInMeters = parseFloat(formData.height) / 100
    const weight = parseFloat(formData.weight)
    const bmi = weight / (heightInMeters * heightInMeters)
    
    let category = ""
    if (bmi < 18.5) category = "Underweight"
    else if (bmi < 25) category = "Normal"
    else if (bmi < 30) category = "Overweight"
    else category = "Obese"
    
    return `${bmi.toFixed(1)} (${category})`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Patient</CardTitle>
        <CardDescription>
          Add a new patient to the clinic management system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
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
                  />
                  {formData.dateOfBirth && (
                    <p className="text-sm text-muted-foreground">
                      Age: {calculateAge()}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                      <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    placeholder="Software Engineer"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="MARRIED">Married</SelectItem>
                      <SelectItem value="DIVORCED">Divorced</SelectItem>
                      <SelectItem value="WIDOWED">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referredBy">Referred By</Label>
                <Input
                  id="referredBy"
                  name="referredBy"
                  placeholder="Dr. Smith or Clinic Name"
                  value={formData.referredBy}
                  onChange={handleChange}
                />
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
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    placeholder="170"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>BMI</Label>
                  <div className="h-10 px-3 py-2 text-sm border rounded-md bg-muted">
                    {formData.height && formData.weight ? calculateBMI() : "Enter height and weight"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  placeholder="List any allergies (e.g., Penicillin, Peanuts, Dust)"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  name="medications"
                  placeholder="List current medications and dosages..."
                  value={formData.medications}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  placeholder="Chronic conditions, past surgeries, family medical history..."
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Medical Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any other relevant medical information..."
                  value={formData.notes}
                  onChange={handleChange}
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceGroup">Group Number</Label>
                  <Input
                    id="insuranceGroup"
                    name="insuranceGroup"
                    placeholder="GRP-789012"
                    value={formData.insuranceGroup}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload insurance card (front & back)
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, PDF up to 5MB
                </p>
                <Button type="button" variant="outline" className="mt-4">
                  Upload Insurance Card
                </Button>
              </div>
            </TabsContent>
          </Tabs>

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
              Register Patient
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}