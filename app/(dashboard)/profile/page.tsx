"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  Edit,
  Save,
  Camera,
  Lock,
  Bell,
  Globe,
} from "lucide-react"
import { format } from "date-fns"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    // Mock profile data - in production, fetch from API
    const mockData = {
      personalInfo: {
        fullName: session?.user?.name || "Dr. Sarah Johnson",
        email: session?.user?.email || "sarah.johnson@clinic.com",
        phone: "+1 (555) 123-4567",
        address: "123 Medical Center Drive, Suite 100",
        city: "New York, NY 10001",
        dateOfBirth: new Date("1985-06-15"),
        gender: "Female",
        bloodType: "O+",
        emergencyContact: {
          name: "John Johnson",
          relationship: "Spouse",
          phone: "+1 (555) 987-6543",
        },
      },
      professionalInfo: {
        role: session?.user?.role || "DOCTOR",
        specialty: "General Medicine",
        licenseNumber: "MED123456",
        licenseExpiry: new Date("2025-12-31"),
        department: "Internal Medicine",
        yearsOfExperience: 12,
        education: [
          { degree: "MD", institution: "Harvard Medical School", year: "2010" },
          { degree: "Residency", institution: "Massachusetts General Hospital", year: "2014" },
        ],
        certifications: [
          "Board Certified - Internal Medicine",
          "Advanced Cardiac Life Support (ACLS)",
          "Basic Life Support (BLS)",
        ],
        languages: ["English", "Spanish", "French"],
      },
      schedule: {
        workingHours: "Mon-Fri: 9:00 AM - 5:00 PM",
        appointmentDuration: "30 minutes",
        maxPatientsPerDay: 16,
        breakTime: "12:00 PM - 1:00 PM",
      },
      stats: {
        totalPatients: 1245,
        totalAppointments: 8920,
        avgRating: 4.8,
        yearsAtClinic: 7,
      },
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        privacy: {
          profileVisibility: "staff-only",
          shareStatistics: true,
        },
        theme: "light",
        language: "en",
      },
    }
    setProfileData(mockData)
  }, [session])

  const handleSave = () => {
    // In production, save to API
    console.log("Saving profile:", profileData)
    setIsEditing(false)
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and professional information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="/api/placeholder/128/128" alt="Profile" />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {profileData.personalInfo.fullName
                        .split(" ")
                        .map(n => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <h2 className="text-2xl font-bold">{profileData.personalInfo.fullName}</h2>
                <Badge className="mt-2 bg-primary/20 text-primary hover:bg-primary/20">
                  {profileData.professionalInfo.role}
                </Badge>
                <p className="text-muted-foreground mt-2">
                  {profileData.professionalInfo.specialty}
                </p>

                <Separator className="my-4" />

                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profileData.personalInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profileData.personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profileData.personalInfo.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Member since {format(new Date(Date.now() - profileData.stats.yearsAtClinic * 365 * 24 * 60 * 60 * 1000), "yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Career Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Total Patients", value: profileData.stats.totalPatients.toLocaleString(), icon: User },
                  { label: "Appointments", value: profileData.stats.totalAppointments.toLocaleString(), icon: Calendar },
                  { label: "Avg. Rating", value: profileData.stats.avgRating, icon: Award },
                  { label: "Experience", value: `${profileData.professionalInfo.yearsOfExperience} years`, icon: Clock },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <stat.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="fullName"
                            value={profileData.personalInfo.fullName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                personalInfo: {
                                  ...profileData.personalInfo,
                                  fullName: e.target.value,
                                },
                              })
                            }
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{profileData.personalInfo.fullName}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={profileData.personalInfo.email}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                personalInfo: {
                                  ...profileData.personalInfo,
                                  email: e.target.value,
                                },
                              })
                            }
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{profileData.personalInfo.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={profileData.personalInfo.phone}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                personalInfo: {
                                  ...profileData.personalInfo,
                                  phone: e.target.value,
                                },
                              })
                            }
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{profileData.personalInfo.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        {isEditing ? (
                          <Input
                            id="dob"
                            type="date"
                            value={format(profileData.personalInfo.dateOfBirth, "yyyy-MM-dd")}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                personalInfo: {
                                  ...profileData.personalInfo,
                                  dateOfBirth: new Date(e.target.value),
                                },
                              })
                            }
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(profileData.personalInfo.dateOfBirth, "MMMM d, yyyy")}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            id="address"
                            placeholder="Street address"
                            value={profileData.personalInfo.address}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                personalInfo: {
                                  ...profileData.personalInfo,
                                  address: e.target.value,
                                },
                              })
                            }
                          />
                          <Input
                            placeholder="City, State, ZIP"
                            value={profileData.personalInfo.city}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                personalInfo: {
                                  ...profileData.personalInfo,
                                  city: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 p-2 border rounded">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p>{profileData.personalInfo.address}</p>
                            <p className="text-sm text-muted-foreground">{profileData.personalInfo.city}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Emergency Contact
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Contact Name</Label>
                          <div className="p-2 border rounded">
                            {profileData.personalInfo.emergencyContact.name}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Relationship</Label>
                          <div className="p-2 border rounded">
                            {profileData.personalInfo.emergencyContact.relationship}
                          </div>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Phone Number</Label>
                          <div className="p-2 border rounded">
                            {profileData.personalInfo.emergencyContact.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>
                    Your credentials and work details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{profileData.professionalInfo.role.toLowerCase()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Specialty</Label>
                      <div className="p-2 border rounded">
                        {profileData.professionalInfo.specialty}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>License Number</Label>
                      <div className="p-2 border rounded">
                        {profileData.professionalInfo.licenseNumber}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>License Expiry</Label>
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(profileData.professionalInfo.licenseExpiry, "MMMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </h3>
                    <div className="space-y-3">
                      {profileData.professionalInfo.education.map((edu: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{edu.degree}</h4>
                              <p className="text-sm text-muted-foreground">{edu.institution}</p>
                            </div>
                            <Badge variant="outline">{edu.year}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.professionalInfo.certifications.map((cert: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.professionalInfo.languages.map((lang: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule & Availability</CardTitle>
                  <CardDescription>
                    Your working hours and appointment settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Working Hours</Label>
                        <div className="p-2 border rounded">
                          {profileData.schedule.workingHours}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Appointment Duration</Label>
                        <div className="p-2 border rounded">
                          {profileData.schedule.appointmentDuration}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Max Patients Per Day</Label>
                        <div className="p-2 border rounded">
                          {profileData.schedule.maxPatientsPerDay}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Break Time</Label>
                        <div className="p-2 border rounded">
                          {profileData.schedule.breakTime}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Weekly Schedule</h3>
                    <div className="space-y-2">
                      {[
                        { day: "Monday", hours: "9:00 AM - 5:00 PM" },
                        { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
                        { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
                        { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
                        { day: "Friday", hours: "9:00 AM - 5:00 PM" },
                        { day: "Saturday", hours: "Closed" },
                        { day: "Sunday", hours: "Closed" },
                      ].map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{schedule.day}</span>
                          <span className={schedule.hours === "Closed" ? "text-muted-foreground" : ""}>
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your preferences and security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notifications */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(profileData.preferences.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={`notif-${key}`} className="capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <input
                            type="checkbox"
                            id={`notif-${key}`}
                            checked={value as boolean}
                            onChange={(e) => {
                              setProfileData({
                                ...profileData,
                                preferences: {
                                  ...profileData.preferences,
                                  notifications: {
                                    ...profileData.preferences.notifications,
                                    [key]: e.target.checked,
                                  },
                                },
                              })
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Privacy */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Privacy
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Profile Visibility</Label>
                          <p className="text-sm text-muted-foreground">
                            Who can see your profile
                          </p>
                        </div>
                        <select
                          value={profileData.preferences.privacy.profileVisibility}
                          onChange={(e) => {
                            setProfileData({
                              ...profileData,
                              preferences: {
                                ...profileData.preferences,
                                privacy: {
                                  ...profileData.preferences.privacy,
                                  profileVisibility: e.target.value,
                                },
                              },
                            })
                          }}
                          className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                        >
                          <option value="public">Public</option>
                          <option value="patients-only">Patients Only</option>
                          <option value="staff-only">Staff Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Share Statistics</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow sharing of your career statistics
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={profileData.preferences.privacy.shareStatistics}
                          onChange={(e) => {
                            setProfileData({
                              ...profileData,
                              preferences: {
                                ...profileData.preferences,
                                privacy: {
                                  ...profileData.preferences.privacy,
                                  shareStatistics: e.target.checked,
                                },
                              },
                            })
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Preferences
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <select
                          id="theme"
                          value={profileData.preferences.theme}
                          onChange={(e) => {
                            setProfileData({
                              ...profileData,
                              preferences: {
                                ...profileData.preferences,
                                theme: e.target.value,
                              },
                            })
                          }}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select
                          id="language"
                          value={profileData.preferences.language}
                          onChange={(e) => {
                            setProfileData({
                              ...profileData,
                              preferences: {
                                ...profileData.preferences,
                                language: e.target.value,
                              },
                            })
                          }}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Security */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Security</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                        Deactivate Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}