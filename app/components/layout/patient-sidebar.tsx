"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Home,
  FileText,
  Pill,
  Bell,
  MessageSquare,
  User,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"

const patientNavItems = [
  { name: "Dashboard", href: "/patient/dashboard", icon: Home },
  { name: "Appointments", href: "/patient/appointments", icon: Calendar },
  { name: "Medical Records", href: "/patient/records", icon: FileText },
  { name: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
  { name: "Health Track", href: "/patient/health", icon: Heart },
  { name: "Messages", href: "/patient/messages", icon: MessageSquare },
  { name: "Notifications", href: "/patient/notifications", icon: Bell },
  { name: "Profile", href: "/patient/profile", icon: User },
  { name: "Patients", href: "/patients", icon: User }, // Add this
]

export function PatientSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:block lg:w-64">
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Patient Portal
          </h2>
          <div className="space-y-1">
            {patientNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-accent"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}