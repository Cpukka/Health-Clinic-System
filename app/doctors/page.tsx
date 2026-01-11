// app/doctors/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Navbar } from "@/app/components/navbar"
import { Search, Star, MapPin, Phone, Mail, Calendar, Award, Users, Clock, Heart } from "lucide-react"
import Link from "next/link"

const specialties = [
  "All Specialties",
  "Cardiology",
  "Pediatrics", 
  "Orthopedics",
  "Dermatology",
  "Neurology",
  "Gynecology",
  "Dentistry",
  "Ophthalmology",
  "Psychiatry"
]

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: "15 years",
    rating: 4.9,
    reviews: 234,
    availability: "Mon-Fri, 9am-6pm",
    image: "/doctors/dr-johnson.jpg",
    education: "MD, Harvard Medical School",
    languages: ["English", "Spanish"],
    description: "Specialized in heart diseases and cardiovascular care with over 15 years of experience.",
    services: ["Echocardiogram", "Stress Test", "Cardiac Consultation"],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Pediatrics",
    experience: "12 years",
    rating: 4.8,
    reviews: 189,
    availability: "Tue-Sat, 8am-5pm",
    image: "/doctors/dr-chen.jpg",
    education: "MD, Stanford University",
    languages: ["English", "Mandarin"],
    description: "Expert in child healthcare with gentle approach and extensive experience.",
    services: ["Well-child Visits", "Vaccinations", "Developmental Screening"],
  },
  {
    id: 3,
    name: "Dr. Elena Rodriguez",
    specialty: "Orthopedics",
    experience: "18 years",
    rating: 4.9,
    reviews: 312,
    availability: "Mon-Thu, 10am-7pm",
    image: "/doctors/dr-rodriguez.jpg",
    education: "MD, Johns Hopkins University",
    languages: ["English", "Spanish", "French"],
    description: "Orthopedic surgeon specializing in joint replacements and sports injuries.",
    services: ["Joint Replacement", "Arthroscopy", "Fracture Care"],
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Dermatology",
    experience: "10 years",
    rating: 4.7,
    reviews: 167,
    availability: "Mon-Fri, 9am-4pm",
    image: "/doctors/dr-wilson.jpg",
    education: "MD, Yale School of Medicine",
    languages: ["English"],
    description: "Skin care specialist focusing on medical and cosmetic dermatology.",
    services: ["Skin Cancer Screening", "Acne Treatment", "Cosmetic Procedures"],
  },
  {
    id: 5,
    name: "Dr. Maria Garcia",
    specialty: "Gynecology",
    experience: "14 years",
    rating: 4.8,
    reviews: 198,
    availability: "Mon-Wed, Fri, 9am-5pm",
    image: "/doctors/dr-garcia.jpg",
    education: "MD, University of California",
    languages: ["English", "Spanish"],
    description: "Women's health specialist with expertise in reproductive health.",
    services: ["Annual Exams", "Prenatal Care", "Menopause Management"],
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialty: "Neurology",
    experience: "20 years",
    rating: 4.9,
    reviews: 276,
    availability: "Tue-Fri, 8am-6pm",
    image: "/doctors/dr-kim.jpg",
    education: "MD, Mayo Clinic",
    languages: ["English", "Korean"],
    description: "Neurologist specializing in headache disorders and neurological conditions.",
    services: ["EEG", "EMG", "Neurological Consultation"],
  },
]

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = selectedSpecialty === "All Specialties" || doctor.specialty === selectedSpecialty
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Meet Our <span className="text-blue-200">Expert Doctors</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Highly qualified healthcare professionals dedicated to your well-being.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search doctors by name or specialty..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/appointments">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{doctors.length}+</div>
                <div className="text-gray-600">Expert Doctors</div>
              </CardContent>
            </Card>
            
            <Card className="border-teal-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">{specialties.length - 1}</div>
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

          {/* Doctors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  {/* Doctor Image & Badge */}
                  <div className="relative h-48 bg-linear-to-br from-blue-100 to-teal-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-24 h-24 text-blue-600 opacity-20 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                      {doctor.specialty}
                    </Badge>
                    <Badge className="absolute top-4 right-4 bg-white text-blue-600 border-blue-200">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {doctor.rating}
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    {/* Doctor Info */}
                    <h3 className="text-xl font-bold mb-2">{doctor.name}</h3>
                    <p className="text-gray-600 mb-4">{doctor.description}</p>
                    
                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2 text-blue-600" />
                        {doctor.experience} experience
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                        {doctor.availability}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                        {doctor.reviews} reviews
                      </div>
                    </div>
                    
                    {/* Languages */}
                    <div className="mb-6">
                      <div className="text-sm font-semibold mb-2">Languages:</div>
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Services */}
                    <div className="mb-6">
                      <div className="text-sm font-semibold mb-2">Services:</div>
                      <div className="flex flex-wrap gap-2">
                        {doctor.services.slice(0, 3).map((service) => (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {doctor.services.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{doctor.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/doctors/${doctor.id}`}>
                          <Heart className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </Button>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                        <Link href={`/appointments?doctor=${doctor.id}`}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Can&apos;t Find the Right Doctor?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Our care coordinators can help you find the perfect specialist for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Call Us: (555) 123-4567
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}