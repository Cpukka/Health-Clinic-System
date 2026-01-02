"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Calendar,
  Home,
  Users,
  FileText,
  Settings,
  Bell,
  MessageSquare,
  Pill,
  Heart,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()

  const isPatient = session?.user?.role === 'PATIENT'

  // Patient-specific navigation
  const patientNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Medical Records", href: "/records", icon: FileText },
    { name: "Prescriptions", href: "/prescriptions", icon: Pill },
    { name: "Health Track", href: "/health", icon: Heart },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Notifications", href: "/notifications", icon: Bell },
     { name: "Settings", href: "/settings", icon: Settings },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Patients", href: "/patients", icon: User }, // Add this
  ]

  // Doctor/Staff navigation
  const staffNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Medical Records", href: "/records", icon: FileText },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const navItems = isPatient ? patientNavItems : staffNavItems

  return (
    <div className="hidden border-r bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:block lg:w-64">
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {isPatient ? "Patient Portal" : "Health Clinic"}
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-accent"
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              )
            })}
          </div>
        </div>
        
        <div className="mt-auto p-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">
              {session?.user?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}