// app/(dashboard)/records/new/page.tsx
import { NewRecordForm } from "@/app/components/records/new-record-form"

export default function NewRecordPage() {
  return (
    <div className="container mx-auto py-6">
      <NewRecordForm />
    </div>
  )
}