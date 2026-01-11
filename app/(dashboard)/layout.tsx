// app/(dashboard)/layout.tsx
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Shield, Home, Calendar } from "lucide-react"
import { Sidebar } from "@/app/components/layout/sidebar"
import { Header } from "@/app/components/layout/header"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!session) {
    router.push("/login?callbackUrl=/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar with Public Site Link */}
      <div className="sticky top-0 z-50 border-b bg-white dark:bg-gray-800 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Home className="h-4 w-4" />
              Patient Site
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold">Staff Dashboard</span>
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {session.user?.role || "Staff"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href="/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Public Booking
              </Link>
            </Button>
            <div className="text-sm text-gray-500">
              Logged in as: <span className="font-medium">{session.user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="container mx-auto">
              {/* Welcome Banner */}
              <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold">Welcome back, {session.user?.name?.split(' ')[0] || 'Staff'}!</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You&apos;re viewing the clinic management dashboard
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}