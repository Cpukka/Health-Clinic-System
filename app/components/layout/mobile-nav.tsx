// app/components/mobile-nav.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../../../app/components/ui/sheet"
import {
  Menu,
  Home,
  Stethoscope,
  Calendar,
  Users,
  FileText,
  HelpCircle,
  Phone,
  Info,
  X,
} from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Doctors", href: "/doctors", icon: Stethoscope },
  { name: "Services", href: "/services", icon: FileText },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-75 sm:w-100">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">HealthClinic</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start gap-3 h-12"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={item.href}>
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}