"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/app/components/ui/button"
import { Bell, Search, User, Heart } from "lucide-react"
import { Input } from "@/app/components/ui/input"

export function PatientHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Health Clinic</span>
        </div>
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search records, appointments..."
            className="w-full rounded-lg bg-background pl-8 md:w-62.5 lg:w-84"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
            3
          </span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">Patient</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  )
}