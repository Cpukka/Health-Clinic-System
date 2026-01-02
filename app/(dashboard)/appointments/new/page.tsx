// app/(dashboard)/appointments/new/page.tsx
import { NewAppointmentForm } from "@/app/components/appointments/new-appointment-form"

export default function NewAppointmentPage() {
  return (
    <div className="container mx-auto py-6">
      <NewAppointmentForm />
    </div>
  )
}