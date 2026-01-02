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
import { Badge } from "@/app/components/ui/badge"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Loader2, FileText, Stethoscope, Calendar, Pill, Upload, X, Plus } from "lucide-react"

interface NewRecordFormProps {
  patientId?: string
  patientName?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function NewRecordForm({ patientId, patientName, onSuccess, onCancel }: NewRecordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("basic")
  const [prescriptions, setPrescriptions] = useState([{ id: 1, medication: "", dosage: "", frequency: "", duration: "" }])

  const [formData, setFormData] = useState({
    patientId: patientId || "",
    patientName: patientName || "",
    visitDate: new Date().toISOString().split('T')[0],
    visitType: "consultation",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    notes: "",
    attachments: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.patientId || !formData.diagnosis || !formData.treatment) {
        throw new Error("Please fill in all required fields")
      }

      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          prescriptions: prescriptions.filter(p => p.medication.trim() !== ""),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create medical record")
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/records")
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

  const addPrescription = () => {
    setPrescriptions(prev => [...prev, {
      id: prev.length + 1,
      medication: "",
      dosage: "",
      frequency: "",
      duration: ""
    }])
  }

  const removePrescription = (id: number) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id))
  }

  const updatePrescription = (id: number, field: string, value: string) => {
    setPrescriptions(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Medical Record</CardTitle>
        <CardDescription>
          {patientName ? `For patient: ${patientName}` : "Add a new medical record for a patient"}
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
              <TabsTrigger value="basic">
                <FileText className="mr-2 h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="clinical">
                <Stethoscope className="mr-2 h-4 w-4" />
                Clinical Details
              </TabsTrigger>
              <TabsTrigger value="medications">
                <Pill className="mr-2 h-4 w-4" />
                Medications
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!patientId && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input
                        id="patientId"
                        name="patientId"
                        placeholder="PAT-001"
                        value={formData.patientId}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        name="patientName"
                        placeholder="John Doe"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="visitDate">Visit Date</Label>
                  <Input
                    id="visitDate"
                    name="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitType">Visit Type</Label>
                  <Select
                    value={formData.visitType}
                    onValueChange={(value) => handleSelectChange("visitType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="routine">Routine Checkup</SelectItem>
                      <SelectItem value="lab">Lab Visit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Clinical Details Tab */}
            <TabsContent value="clinical" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">
                  Diagnosis <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="diagnosis"
                  name="diagnosis"
                  placeholder="Primary diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="List patient symptoms..."
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">
                  Treatment Plan <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="treatment"
                  name="treatment"
                  placeholder="Describe treatment plan..."
                  value={formData.treatment}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional notes..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Medications Tab */}
            <TabsContent value="medications" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Prescriptions</h3>
                <Button type="button" variant="outline" size="sm" onClick={addPrescription}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </div>

              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <Card key={prescription.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">Medication #{prescription.id}</Badge>
                        {prescriptions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePrescription(prescription.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Medication Name</Label>
                          <Input
                            placeholder="e.g., Amoxicillin 500mg"
                            value={prescription.medication}
                            onChange={(e) => updatePrescription(prescription.id, "medication", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dosage</Label>
                          <Input
                            placeholder="e.g., 500mg"
                            value={prescription.dosage}
                            onChange={(e) => updatePrescription(prescription.id, "dosage", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Frequency</Label>
                          <Select
                            value={prescription.frequency}
                            onValueChange={(value) => updatePrescription(prescription.id, "frequency", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="once-daily">Once daily</SelectItem>
                              <SelectItem value="twice-daily">Twice daily</SelectItem>
                              <SelectItem value="three-times-daily">Three times daily</SelectItem>
                              <SelectItem value="four-times-daily">Four times daily</SelectItem>
                              <SelectItem value="as-needed">As needed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            placeholder="e.g., 7 days"
                            value={prescription.duration}
                            onChange={(e) => updatePrescription(prescription.id, "duration", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop files or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, JPG, PNG up to 10MB
                  </p>
                  <Button type="button" variant="outline" className="mt-4">
                    Browse Files
                  </Button>
                </div>
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
              Create Medical Record
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}