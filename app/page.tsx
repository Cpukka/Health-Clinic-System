import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { CheckCircle, Calendar, Users, Shield } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/app/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Comprehensive Health Clinic
              <span className="block text-primary">Management System</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Streamline your clinic operations with our all-in-one solution for appointments, 
              patient records, and healthcare management. Secure, efficient, and designed for 
              modern healthcare providers.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Clinics Trust Us</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Patients Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything You Need in One Platform
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Designed specifically for clinics and HMOs to optimize healthcare delivery
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Appointment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Schedule, reschedule, and track appointments with automated reminders
                  and real-time availability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Patient Records</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure electronic health records with comprehensive medical history,
                  prescriptions, and treatment plans.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>SMS Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reduce no-shows with automated SMS reminders and confirmations sent
                  directly to patients.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>HIPAA Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enterprise-grade security with encryption, access controls, and audit
                  trails to protect patient data.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-linear-to-r from-primary to-blue-600">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Clinic?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Join thousands of healthcare providers who trust our platform for their
            daily operations.
          </p>
          <div className="mt-10">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="ml-4 bg-transparent text-white" asChild>
              <a href="/contact">
                Schedule Demo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold">Health Clinic System</h3>
              <p className="mt-2 text-sm text-gray-400">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <a href="/contact" className="text-sm text-gray-400 hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}