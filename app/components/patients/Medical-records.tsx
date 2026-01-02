"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../app/components/ui/accordion"
import {
  FileText,
  Heart,
  Pill,
  Stethoscope,
  Calendar,
  User,
  Download,
  Printer,
  Plus,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Types
interface MedicalRecord {
  id: string
  date: Date
  type: "consultation" | "follow-up" | "emergency" | "routine"
  doctor: string
  diagnosis: string
  symptoms: string[]
  treatment: string
  prescriptions: Prescription[]
  notes: string
  attachments: string[]
}

interface Prescription {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  status: "active" | "completed" | "cancelled"
}

interface VitalSigns {
  date: Date
  bloodPressure: string
  heartRate: number
  temperature: number
  respiratoryRate: number
  oxygenSaturation: number
  weight: number
  height: number
  bmi: number
}

interface MedicalRecordsProps {
  patientId?: string
  patientName?: string
  records?: MedicalRecord[]
  vitalSigns?: VitalSigns[]
  onAddRecord?: () => void
  onViewRecord?: (record: MedicalRecord) => void
  onEditRecord?: (record: MedicalRecord) => void
}

export function MedicalRecords({
  patientId = "pat-001",
  patientName = "John Smith",
  records: initialRecords,
  vitalSigns: initialVitalSigns,
  onAddRecord,
  onViewRecord,
  onEditRecord,
}: MedicalRecordsProps) {
  const [activeTab, setActiveTab] = useState("records")
  const [records] = useState<MedicalRecord[]>(
    initialRecords || generateMockRecords()
  )
  const [vitalSigns] = useState<VitalSigns[]>(
    initialVitalSigns || generateMockVitalSigns()
  )

  // Get record type badge variant
  const getRecordTypeVariant = (type: MedicalRecord["type"]) => {
    switch (type) {
      case "emergency":
        return "destructive"
      case "consultation":
        return "default"
      case "follow-up":
        return "secondary"
      case "routine":
        return "outline"
      default:
        return "outline"
    }
  }

  // Format date
  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy")
  }

  // Calculate BMI category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: "Underweight", color: "text-yellow-600" }
    if (bmi < 25) return { text: "Normal", color: "text-green-600" }
    if (bmi < 30) return { text: "Overweight", color: "text-orange-600" }
    return { text: "Obese", color: "text-red-600" }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Medical Records</h2>
          <p className="text-muted-foreground">
            Medical history and records for {patientName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={onAddRecord}>
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="records">
            <FileText className="mr-2 h-4 w-4" />
            Records
          </TabsTrigger>
          <TabsTrigger value="vitals">
            <Heart className="mr-2 h-4 w-4" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <Pill className="mr-2 h-4 w-4" />
            Prescriptions
          </TabsTrigger>
        </TabsList>

        {/* Medical Records Tab */}
        <TabsContent value="records" className="space-y-4">
          {records.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No Medical Records</h3>
                  <p className="text-muted-foreground mt-2">
                    No medical records found for this patient.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {records.map((record) => (
                <AccordionItem key={record.id} value={record.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2">
                            <Badge variant={getRecordTypeVariant(record.type)}>
                              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                            </Badge>
                            <span className="font-medium">{record.diagnosis}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(record.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {record.doctor}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        {/* Symptoms */}
                        {record.symptoms.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Symptoms
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {record.symptoms.map((symptom, index) => (
                                <Badge key={index} variant="outline">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Diagnosis */}
                        <div>
                          <h4 className="font-semibold mb-2">Diagnosis</h4>
                          <p className="text-muted-foreground">{record.diagnosis}</p>
                        </div>

                        {/* Treatment */}
                        <div>
                          <h4 className="font-semibold mb-2">Treatment</h4>
                          <p className="text-muted-foreground">{record.treatment}</p>
                        </div>

                        {/* Prescriptions */}
                        {record.prescriptions.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Pill className="h-4 w-4" />
                              Prescriptions
                            </h4>
                            <div className="space-y-2">
                              {record.prescriptions.map((prescription) => (
                                <div
                                  key={prescription.id}
                                  className="border rounded-lg p-3"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">
                                      {prescription.medication}
                                    </span>
                                    <Badge
                                      variant={
                                        prescription.status === "active"
                                          ? "default"
                                          : prescription.status === "completed"
                                          ? "outline"
                                          : "destructive"
                                      }
                                    >
                                      {prescription.status}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Dosage:</span>{" "}
                                      {prescription.dosage}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Frequency:</span>{" "}
                                      {prescription.frequency}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Duration:</span>{" "}
                                      {prescription.duration}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Instructions:</span>{" "}
                                      {prescription.instructions}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {record.notes && (
                          <div>
                            <h4 className="font-semibold mb-2">Notes</h4>
                            <p className="text-muted-foreground">{record.notes}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewRecord?.(record)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditRecord?.(record)}
                          >
                            Edit Record
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        {/* Vital Signs Tab */}
        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs History</CardTitle>
              <CardDescription>
                Track patient&apos;s vital signs over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Blood Pressure</th>
                      <th className="text-left py-3 px-4 font-semibold">Heart Rate</th>
                      <th className="text-left py-3 px-4 font-semibold">Temperature</th>
                      <th className="text-left py-3 px-4 font-semibold">O₂ Sat</th>
                      <th className="text-left py-3 px-4 font-semibold">Weight</th>
                      <th className="text-left py-3 px-4 font-semibold">BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitalSigns.map((vital, index) => {
                      const bmiCategory = getBMICategory(vital.bmi)
                      return (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(vital.date)}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {vital.bloodPressure}
                          </td>
                          <td className="py-3 px-4">{vital.heartRate} bpm</td>
                          <td className="py-3 px-4">{vital.temperature}°C</td>
                          <td className="py-3 px-4">{vital.oxygenSaturation}%</td>
                          <td className="py-3 px-4">{vital.weight} kg</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span>{vital.bmi.toFixed(1)}</span>
                              <span className={cn("text-sm", bmiCategory.color)}>
                                ({bmiCategory.text})
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
              <CardDescription>
                Current and past medication prescriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.flatMap((record) =>
                  record.prescriptions
                    .filter((p) => p.status === "active")
                    .map((prescription) => (
                      <div
                        key={prescription.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {prescription.medication}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              From {formatDate(record.date)} • {record.doctor}
                            </p>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Dosage</div>
                            <div className="font-medium">{prescription.dosage}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Frequency</div>
                            <div className="font-medium">{prescription.frequency}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Duration</div>
                            <div className="font-medium">{prescription.duration}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Status</div>
                            <div className="font-medium">{prescription.status}</div>
                          </div>
                        </div>
                        {prescription.instructions && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-muted-foreground">Instructions</div>
                            <div className="font-medium">{prescription.instructions}</div>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions to generate mock data
function generateMockRecords(): MedicalRecord[] {
  const records: MedicalRecord[] = []
  const doctors = ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emma Wilson"]
  const diagnoses = [
    "Hypertension",
    "Type 2 Diabetes",
    "Upper Respiratory Infection",
    "Migraine",
    "Gastroenteritis",
    "Allergic Rhinitis",
  ]
  const symptoms = [
    "Fever",
    "Headache",
    "Cough",
    "Fatigue",
    "Nausea",
    "Shortness of breath",
    "Chest pain",
    "Dizziness",
  ]
  const medications = [
    "Amoxicillin 500mg",
    "Lisinopril 10mg",
    "Metformin 850mg",
    "Ibuprofen 400mg",
    "Loratadine 10mg",
    "Albuterol Inhaler",
  ]

  for (let i = 0; i < 5; i++) {
    const recordDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    const recordType: MedicalRecord["type"] = 
      Math.random() > 0.8 ? "emergency" :
      Math.random() > 0.6 ? "follow-up" :
      Math.random() > 0.4 ? "consultation" : "routine"

    records.push({
      id: `rec-${i + 1}`,
      date: recordDate,
      type: recordType,
      doctor: doctors[Math.floor(Math.random() * doctors.length)],
      diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
      symptoms: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
        symptoms[Math.floor(Math.random() * symptoms.length)]
      ),
      treatment: "Prescribed medication and advised rest. Follow-up in 2 weeks.",
      prescriptions: Array.from({ length: Math.floor(Math.random() * 2) + 1 }, (_, idx) => ({
        id: `pres-${i}-${idx}`,
        medication: medications[Math.floor(Math.random() * medications.length)],
        dosage: `${Math.floor(Math.random() * 500) + 100}mg`,
        frequency: ["Once daily", "Twice daily", "Three times daily"][Math.floor(Math.random() * 3)],
        duration: `${Math.floor(Math.random() * 14) + 7} days`,
        instructions: "Take with food. Avoid alcohol.",
        status: Math.random() > 0.7 ? "completed" : Math.random() > 0.8 ? "cancelled" : "active",
      })),
      notes: "Patient responded well to treatment. Vital signs stable.",
      attachments: [],
    })
  }

  return records.sort((a, b) => b.date.getTime() - a.date.getTime())
}

function generateMockVitalSigns(): VitalSigns[] {
  const vitalSigns: VitalSigns[] = []
  const today = new Date()

  for (let i = 0; i < 6; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i * 30)

    const weight = 70 + Math.random() * 20
    const height = 1.7 + Math.random() * 0.3
    const bmi = weight / (height * height)

    vitalSigns.push({
      date,
      bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 30) + 60}`,
      heartRate: Math.floor(Math.random() * 40) + 60,
      temperature: 36.5 + Math.random() * 1.5,
      respiratoryRate: Math.floor(Math.random() * 10) + 12,
      oxygenSaturation: Math.floor(Math.random() * 5) + 95,
      weight: Math.round(weight * 10) / 10,
      height: Math.round(height * 100) / 100,
      bmi: Math.round(bmi * 10) / 10,
    })
  }

  return vitalSigns.sort((a, b) => b.date.getTime() - a.date.getTime())
}