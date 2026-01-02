// app/(dashboard)/patients/new/page.tsx
import { NewPatientForm } from "@/app/components/patients/new-patient-form"

export default function NewPatientPage() {
  return (
    <div className="container mx-auto py-6">
      <NewPatientForm />
    </div>
  )
}