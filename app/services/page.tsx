// app/services/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import { Navbar } from "@/app/components/navbar"
import { Search, Clock, Users, Award, Shield, Heart, Stethoscope, Calendar, Phone, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const serviceCategories = [
  "All Services",
  "Primary Care", 
  "Specialty Care",
  "Emergency & Urgent",
  "Diagnostic Services",
  "Surgical Services",
  "Wellness & Prevention",
  "Mental Health",
  "Women's Health",
  "Pediatric Care"
]

const services = [
  {
    id: 1,
    name: "Primary Care Consultation",
    category: "Primary Care",
    description: "Comprehensive health assessment and management of common illnesses by our experienced primary care physicians.",
    duration: "30-60 mins",
    price: "$120",
    features: ["Annual Physicals", "Chronic Disease Management", "Preventive Care", "Vaccinations"],
    doctors: "Dr. Sarah Johnson, Dr. Michael Chen",
    icon: "🩺"
  },
  {
    id: 2,
    name: "Cardiology Consultation",
    category: "Specialty Care",
    description: "Expert evaluation and treatment of heart conditions including hypertension, arrhythmias, and heart disease.",
    duration: "45-90 mins",
    price: "$180",
    features: ["ECG Testing", "Echocardiogram", "Stress Test", "Holter Monitoring"],
    doctors: "Dr. Sarah Johnson",
    icon: "❤️"
  },
  {
    id: 3,
    name: "Pediatric Check-up",
    category: "Pediatric Care",
    description: "Complete health assessment for children including growth monitoring, vaccinations, and developmental screening.",
    duration: "30-45 mins",
    price: "$100",
    features: ["Growth Assessment", "Vaccination Schedule", "Nutrition Counseling", "Development Tracking"],
    doctors: "Dr. Michael Chen, Dr. Lisa Wang",
    icon: "👶"
  },
  {
    id: 4,
    name: "Emergency Care",
    category: "Emergency & Urgent",
    description: "24/7 emergency medical services for accidents, acute illnesses, and life-threatening conditions.",
    duration: "Varies",
    price: "$250+",
    features: ["Trauma Care", "Critical Care", "Emergency Procedures", "Ambulance Service"],
    doctors: "Emergency Team",
    icon: "🚑"
  },
  {
    id: 5,
    name: "MRI & CT Scan",
    category: "Diagnostic Services",
    description: "Advanced imaging services for accurate diagnosis of injuries, diseases, and medical conditions.",
    duration: "30-60 mins",
    price: "$300-800",
    features: ["High-Resolution Imaging", "Contrast Studies", "Radiologist Report", "Quick Results"],
    doctors: "Dr. Robert Kim",
    icon: "📊"
  },
  {
    id: 6,
    name: "Orthopedic Surgery",
    category: "Surgical Services",
    description: "Surgical treatment for bone, joint, and muscle conditions including fractures and joint replacements.",
    duration: "1-3 hours",
    price: "$2,500+",
    features: ["Joint Replacement", "Arthroscopy", "Fracture Repair", "Sports Injury Surgery"],
    doctors: "Dr. Elena Rodriguez",
    icon: "🦴"
  },
  {
    id: 7,
    name: "Annual Wellness Exam",
    category: "Wellness & Prevention",
    description: "Comprehensive health screening and preventive care plan tailored to your individual health needs.",
    duration: "60 mins",
    price: "$150",
    features: ["Health Risk Assessment", "Cancer Screening", "Lifestyle Counseling", "Health Plan"],
    doctors: "All Primary Care Physicians",
    icon: "⭐"
  },
  {
    id: 8,
    name: "Mental Health Counseling",
    category: "Mental Health",
    description: "Professional counseling and therapy services for anxiety, depression, stress, and other mental health concerns.",
    duration: "50 mins",
    price: "$120",
    features: ["Individual Therapy", "Group Sessions", "Cognitive Behavioral Therapy", "Stress Management"],
    doctors: "Dr. Jennifer Smith",
    icon: "🧠"
  },
  {
    id: 9,
    name: "Women's Health Services",
    category: "Women's Health",
    description: "Comprehensive care for women including gynecological exams, prenatal care, and menopause management.",
    duration: "45-60 mins",
    price: "$140",
    features: ["Pap Smear", "Mammography", "Prenatal Care", "Family Planning"],
    doctors: "Dr. Maria Garcia",
    icon: "🌸"
  },
  {
    id: 10,
    name: "Dental Check-up & Cleaning",
    category: "Specialty Care",
    description: "Complete dental examination, professional cleaning, and oral health assessment.",
    duration: "60 mins",
    price: "$110",
    features: ["Teeth Cleaning", "X-rays", "Cavity Detection", "Oral Cancer Screening"],
    doctors: "Dr. David Patel",
    icon: "🦷"
  },
  {
    id: 11,
    name: "Physical Therapy",
    category: "Specialty Care",
    description: "Rehabilitation services for injury recovery, pain management, and improved mobility.",
    duration: "45 mins",
    price: "$95",
    features: ["Exercise Therapy", "Manual Therapy", "Pain Management", "Mobility Training"],
    doctors: "Dr. Alex Thompson",
    icon: "💪"
  },
  {
    id: 12,
    name: "Dermatology Consultation",
    category: "Specialty Care",
    description: "Diagnosis and treatment of skin conditions, acne, eczema, psoriasis, and skin cancer screening.",
    duration: "30 mins",
    price: "$130",
    features: ["Skin Cancer Screening", "Acne Treatment", "Biopsy", "Cosmetic Consultation"],
    doctors: "Dr. James Wilson",
    icon: "🌟"
  }
]

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Services")
  const [expandedService, setExpandedService] = useState<number | null>(null)

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Services" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleService = (id: number) => {
    setExpandedService(expandedService === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our <span className="text-blue-200">Medical Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Comprehensive healthcare services delivered with compassion and expertise.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search services by name or category..."
                  className="pl-12 pr-4 py-6 text-lg rounded-full border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{services.length}+</div>
                <div className="text-gray-600">Medical Services</div>
              </CardContent>
            </Card>
            
            <Card className="border-teal-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">{serviceCategories.length - 1}</div>
                <div className="text-gray-600">Specialties</div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-600">Emergency Care</div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-gray-600">Patient Satisfaction</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              {serviceCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card 
                key={service.id} 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-blue-100"
                onClick={() => toggleService(service.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{service.icon}</div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {service.category}
                        </Badge>
                        <h3 className="text-xl font-bold">{service.name}</h3>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                    >
                      <ArrowRight className={`w-5 h-5 transition-transform ${
                        expandedService === service.id ? "rotate-90" : ""
                      }`} />
                    </Button>
                  </div>

                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      Duration: {service.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />
                      Starting at: {service.price}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Stethoscope className="w-4 h-4 mr-2 text-blue-600" />
                      Available with: {service.doctors}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="text-sm font-semibold mb-2">Features:</div>
                    <div className="flex flex-wrap gap-2">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                      {service.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{service.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedService === service.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold mb-3">Complete Service Details</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-sm">All Features:</span>
                          <ul className="mt-1 space-y-1">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center justify-between pt-3">
                          <div>
                            <div className="font-medium">Ready to book?</div>
                            <div className="text-sm text-gray-600">Available slots this week</div>
                          </div>
                          <Button asChild>
                            <Link href={`/appointments?service=${service.name}`}>
                              <Calendar className="w-4 h-4 mr-2" />
                              Book Now
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/doctors?specialty=${service.category}`}>
                        <Users className="w-4 h-4 mr-2" />
                        Find Doctors
                      </Link>
                    </Button>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={`/appointments?service=${service.name}`}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Service
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All Services")
              }}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Services?</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We provide exceptional healthcare services with patient-centered approach and advanced technology.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Board Certified Specialists</h3>
                <p className="text-gray-600">
                  All our doctors are board-certified with extensive training and experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Same-Day Appointments</h3>
                <p className="text-gray-600">
                  Get seen quickly with our same-day appointment system for urgent needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Advanced Technology</h3>
                <p className="text-gray-600">
                  State-of-the-art medical equipment for accurate diagnosis and treatment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-4 bg-teal-100 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Patient-Centered Care</h3>
                <p className="text-gray-600">
                  Personalized treatment plans and compassionate care for every patient.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get the Care You Need?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Schedule your appointment today or speak with our care coordinators to find the right service for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/appointments">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Call: (555) 123-4567
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}