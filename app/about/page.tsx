// app/about/page.tsx
import Image from 'next/image'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

import { 
  Heart, 
  Shield, 
  Users, 
  Clock, 
  Award, 
  Stethoscope,
  Building,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '../components/header'
import { Navbar } from '../components/navbar'

export const metadata = {
  title: 'About Us | HealthCare Clinic System',
  description: 'Learn about our mission, values, and commitment to providing exceptional healthcare services to our community.',
}

const teamMembers = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Chief Medical Officer',
    specialty: 'Internal Medicine',
    experience: '15 years',
    image: '/images/team/dr-johnson.jpg',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Head of Pediatrics',
    specialty: 'Pediatric Care',
    experience: '12 years',
    image: '/images/team/dr-chen.jpg',
  },
  {
    name: 'Dr. Elena Rodriguez',
    role: 'Senior Surgeon',
    specialty: 'General Surgery',
    experience: '18 years',
    image: '/images/team/dr-rodriguez.jpg',
  },
  {
    name: 'Dr. James Wilson',
    role: 'Clinical Director',
    specialty: 'Family Medicine',
    experience: '20 years',
    image: '/images/team/dr-wilson.jpg',
  },
]

const values = [
  {
    icon: Heart,
    title: 'Patient-Centered Care',
    description: 'We put our patients at the heart of everything we do, ensuring personalized treatment plans.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Maintaining the highest standards of safety and hygiene in all our facilities.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Our multidisciplinary teams work together for comprehensive patient care.',
  },
  {
    icon: Clock,
    title: 'Timely Access',
    description: 'Minimizing wait times and providing prompt medical attention when needed.',
  },
]

const achievements = [
  { number: '10,000+', label: 'Patients Treated' },
  { number: '50+', label: 'Specialists' },
  { number: '24/7', label: 'Emergency Support' },
  { number: '98%', label: 'Patient Satisfaction' },
]

const services = [
  'Emergency Care',
  'Preventive Medicine',
  'Chronic Disease Management',
  'Pediatric Services',
  'Women\'s Health',
  'Mental Health Services',
  'Diagnostic Imaging',
  'Laboratory Services',
  'Physical Therapy',
  'Nutrition Counseling',
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <Navbar />
      
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white hover:bg-white/30">
              <Heart className="w-4 h-4 mr-2" />
              Since 2005
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Compassionate Care, <span className="text-blue-200">Advanced Medicine</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              For nearly two decades, we&apos;ve been committed to providing exceptional healthcare 
              with a personal touch to our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href={{ pathname: "/contact" }}>
                  Contact Us
                  <Phone className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href={{ pathname: "/services" }}>
                  Our Services
                  <Stethoscope className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-blue-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold ml-4">Our Mission</h2>
                </div>
                <p className="text-gray-600 text-lg">
                  To provide accessible, high-quality healthcare that improves the lives of our patients 
                  through compassionate service, advanced technology, and evidence-based medicine.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <Award className="w-8 h-8 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold ml-4">Our Vision</h2>
                </div>
                <p className="text-gray-600 text-lg">
                  To be the leading healthcare provider in our region, recognized for excellence in 
                  patient care, innovation, and community health improvement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {achievement.number}
                </div>
                <div className="text-gray-600">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              These principles guide every decision we make and every service we provide.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Expert Team</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our dedicated healthcare professionals bring years of experience and specialized 
              knowledge to provide you with the best possible care.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-linear-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                  <Users className="w-16 h-16 text-blue-600 opacity-20" />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                    <Stethoscope className="w-4 h-4 mr-1" />
                    {member.specialty}
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {member.experience} experience
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href={{ pathname: "/doctors" }}>
                View All Medical Staff
                <Users className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Services</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We offer a wide range of medical services to meet all your healthcare needs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <div 
                key={index}
                className="flex items-center p-4 bg-white border rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href={{ pathname: "/services" }}>
                Explore All Services
                <Calendar className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">State-of-the-Art Facilities</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Building className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                      <span className="text-gray-700">Modern, fully-equipped examination rooms</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                      <span className="text-gray-700">Advanced diagnostic imaging center</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                      <span className="text-gray-700">Certified laboratory with rapid testing</span>
                    </li>
                    <li className="flex items-start">
                      <Heart className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                      <span className="text-gray-700">Comfortable patient recovery areas</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-linear-to-br from-blue-100 to-teal-100 rounded-xl h-64 flex items-center justify-center">
                  <Building className="w-32 h-32 text-blue-600 opacity-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience <span className="text-blue-600">Exceptional Care</span>?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Schedule your appointment today or visit our clinic to learn more about our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={{ pathname: "/appointments" }}>
                Book Appointment
                <Calendar className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={{ pathname: "/contact" }}>
                <Phone className="mr-2 w-4 h-4" />
                Call Now: (555) 123-4567
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}