"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Home,
  Users,
  FileText,
  Settings,
  Bell,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Medical Records", href: "/records", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-40">
      <div className="flex items-center justify-around p-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.name}
              variant="ghost"
              size="icon"
              className={cn(
                "h-12 w-12",
                pathname === item.href && "bg-accent"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.name}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}