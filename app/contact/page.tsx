// app/contact/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, Calendar, Users, HelpCircle, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/app/components/navbar"
import { toast } from "sonner"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success("Message sent successfully! We'll get back to you within 24 hours.")
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us directly for immediate assistance",
      details: "(555) 123-4567",
      subtext: "24/7 Emergency Line Available",
      color: "blue",
      action: { text: "Call Now", href: "tel:5551234567" }
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email for non-urgent inquiries",
      details: "contact@healthclinic.com",
      subtext: "Response within 24 hours",
      color: "teal",
      action: { text: "Send Email", href: "mailto:contact@healthclinic.com" }
    },
    {
      icon: MapPin,
      title: "Visit Clinic",
      description: "Come see us at our modern facility",
      details: "123 Healthcare Avenue",
      subtext: "Medical City, MC 12345",
      color: "green",
      action: { text: "Get Directions", href: "https://maps.google.com" }
    }
  ]

  const quickLinks = [
    { icon: Calendar, text: "Schedule Appointment", href: "/appointments" },
    { icon: Users, text: "Find a Doctor", href: "/doctors" },
    { icon: MessageSquare, text: "View Services", href: "/services" },
    { icon: HelpCircle, text: "FAQ & Support", href: "/faq" },
  ]

  const operatingHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Emergency Services', hours: '24/7' },
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-teal-600 dark:from-blue-800 dark:to-teal-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Contact <span className="text-blue-200 dark:text-blue-300">HealthClinic</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 max-w-3xl mx-auto mb-8">
              We&apos;re here to help you with all your healthcare needs. Reach out to us for appointments, 
              questions, or feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              const colorClasses = {
                blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
                teal: "border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20",
                green: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
              }
              
              return (
                <Card 
                  key={index} 
                  className={`border-2 ${colorClasses[method.color as keyof typeof colorClasses]} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-full mb-4 ${
                      method.color === 'blue' ? 'bg-blue-100 dark:bg-blue-800' :
                      method.color === 'teal' ? 'bg-teal-100 dark:bg-teal-800' :
                      'bg-green-100 dark:bg-green-800'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        method.color === 'blue' ? 'text-blue-600 dark:text-blue-300' :
                        method.color === 'teal' ? 'text-teal-600 dark:text-teal-300' :
                        'text-green-600 dark:text-green-300'
                      }`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{method.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{method.description}</p>
                    
                    <a 
                      href={method.action.href}
                      className={`text-lg font-bold block mb-2 hover:underline ${
                        method.color === 'blue' ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700' :
                        method.color === 'teal' ? 'text-teal-600 dark:text-teal-400 hover:text-teal-700' :
                        'text-green-600 dark:text-green-400 hover:text-green-700'
                      }`}
                    >
                      {method.details}
                    </a>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{method.subtext}</p>
                    
                    {/* FIX: Use regular anchor tag for external URLs */}
                    {method.action.href.startsWith('http') || method.action.href.startsWith('tel') || method.action.href.startsWith('mailto') ? (
                      <a 
                        href={method.action.href}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 ${
                          method.color === 'blue' ? 'border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400' :
                          method.color === 'teal' ? 'border-teal-300 text-teal-600 dark:border-teal-600 dark:text-teal-400' :
                          'border-green-300 text-green-600 dark:border-green-600 dark:text-green-400'
                        }`}
                      >
                        {method.action.text}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    ) : (
                      // Use Link component for internal routes
                      <Link 
                        href={method.action.href}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 ${
                          method.color === 'blue' ? 'border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400' :
                          method.color === 'teal' ? 'border-teal-300 text-teal-600 dark:border-teal-600 dark:text-teal-400' :
                          'border-green-300 text-green-600 dark:border-green-600 dark:text-green-400'
                        }`}
                      >
                        {method.action.text}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold dark:text-white">Send Us a Message</h2>
              </div>
              
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="dark:text-gray-300">First Name</Label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="dark:text-gray-300">Last Name</Label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="dark:text-gray-300">Phone</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="dark:text-gray-300">Subject</Label>
                      <Input 
                        id="subject"
                        name="subject"
                        placeholder="Appointment inquiry"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="dark:text-gray-300">Message</Label>
                      <Textarea 
                        id="message"
                        name="message"
                        placeholder="Please describe your inquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      By submitting, you agree to our Privacy Policy and Terms of Service
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Hours & Quick Links */}
            <div className="space-y-8">
              {/* Operating Hours */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold dark:text-white">Clinic Hours</h2>
                </div>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {operatingHours.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                            <span className="font-medium dark:text-gray-300">{item.day}</span>
                          </div>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">Note:</span> Emergency services are available 24/7. 
                        For life-threatening emergencies, call 911 or visit our emergency department immediately.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-2xl font-bold mb-4 dark:text-white">Quick Links</h3>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="w-full justify-between h-14 px-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        asChild
                      >
                        <Link href={link.href} passHref legacyBehavior>
                          <a>
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="dark:text-gray-300">{link.text}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </a>
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Additional Info */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 dark:text-white">Additional Information</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Average response time: 2-4 hours during business hours
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Online appointments available 24/7
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Insurance verification support
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Multilingual support available
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Find Our Location</h2>
          <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-0">
              {/* Map Placeholder */}
              <div className="h-64 bg-linear-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 flex flex-col items-center justify-center">
                <MapPin className="w-16 h-16 text-blue-600 dark:text-blue-400 mb-4" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">123 Healthcare Avenue</p>
                <p className="text-gray-600 dark:text-gray-400">Medical City, MC 12345</p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-6"
                >
                  <MapPin className="mr-2 w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
              
              {/* Location Details */}
              <div className="p-6 grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Parking</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Free parking available in our underground garage
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Accessibility</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Wheelchair accessible with ramps and elevators
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Public Transport</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Bus lines 101, 203, and subway station nearby
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}