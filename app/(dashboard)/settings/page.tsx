"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Switch } from "../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Save, Bell, Lock, User, Database, Smartphone } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@clinic.com",
    phone: "+1 (555) 123-4567",
    specialty: "General Practitioner",
    licenseNumber: "MD123456",
  })

  const [notifications, setNotifications] = useState({
    emailAppointments: true,
    emailReminders: true,
    smsReminders: true,
    emailUpdates: false,
    pushNotifications: true,
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordLastChanged: "3 months ago",
  })

  const [clinic, setClinic] = useState({
    name: "City Medical Center",
    address: "123 Main St, City, State 12345",
    phone: "+1 (555) 987-6543",
    email: "contact@citymedical.com",
    workingHours: "9:00 AM - 6:00 PM",
    appointmentDuration: 30,
  })

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings...`)
    // Implement save logic
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and clinic preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="clinic">Clinic</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={profile.specialty}
                    onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Medical License Number</Label>
                  <Input
                    id="license"
                    value={profile.licenseNumber}
                    onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave("profile")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Appointment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for new appointments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailAppointments}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailAppointments: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email reminders for upcoming appointments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailReminders: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive SMS reminders for upcoming appointments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, smsReminders: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, pushNotifications: checked })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave("notifications")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setSecurity({ ...security, twoFactorEnabled: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout</Label>
                  <Select
                    value={security.sessionTimeout.toString()}
                    onValueChange={(value) =>
                      setSecurity({ ...security, sessionTimeout: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeout duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after inactivity
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Last changed: {security.passwordLastChanged}
                      </p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave("security")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinic Tab */}
        <TabsContent value="clinic" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                <CardTitle>Clinic Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your clinic information and working hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input
                    id="clinicName"
                    value={clinic.name}
                    onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicPhone">Clinic Phone</Label>
                  <Input
                    id="clinicPhone"
                    value={clinic.phone}
                    onChange={(e) => setClinic({ ...clinic, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicEmail">Clinic Email</Label>
                  <Input
                    id="clinicEmail"
                    type="email"
                    value={clinic.email}
                    onChange={(e) => setClinic({ ...clinic, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={clinic.workingHours}
                    onChange={(e) => setClinic({ ...clinic, workingHours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentDuration">Default Appointment Duration</Label>
                  <Select
                    value={clinic.appointmentDuration.toString()}
                    onValueChange={(value) =>
                      setClinic({ ...clinic, appointmentDuration: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicAddress">Clinic Address</Label>
                <Input
                  id="clinicAddress"
                  value={clinic.address}
                  onChange={(e) => setClinic({ ...clinic, address: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave("clinic")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Clinic Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5" />
                <CardTitle>Integrations</CardTitle>
              </div>
              <CardDescription>
                Connect with other services and platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-medium">Twilio SMS</p>
                    <p className="text-sm text-muted-foreground">
                      Send appointment reminders via SMS
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-medium">Payment Gateway</p>
                    <p className="text-sm text-muted-foreground">
                      Process payments and invoices
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-medium">Electronic Health Records</p>
                    <p className="text-sm text-muted-foreground">
                      Integrate with external EHR systems
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}