"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Switch } from "@/app/components/ui/switch"
import { Label } from "@/app/components/ui/label"
import { Separator } from "@/app/components/ui/separator"
import { Input } from "@/app/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import {
  Bell,
  BellRing,
  Check,
  Clock,
  AlertTriangle,
  Info,
  User,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Trash2,
  Archive,
  Filter,
  MoreVertical,
  ChevronRight,
  Shield,
  Stethoscope,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  description: string
  timestamp: Date
  read: boolean
  type: "alert" | "appointment" | "message" | "system" | "reminder"
  priority: "high" | "medium" | "low"
  sender?: {
    id: string
    name: string
    role: string
  }
  action?: {
    label: string
    url: string
  }
  metadata?: Record<string, any>
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Appointment Reminder",
      description: "You have an appointment with John Doe in 30 minutes",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      type: "appointment",
      priority: "high",
      sender: {
        id: "p1",
        name: "John Doe",
        role: "Patient",
      },
      action: {
        label: "Join Appointment",
        url: "/appointments/123",
      },
      metadata: {
        appointmentId: "apt-001",
        patientId: "pat-001",
        startTime: new Date(Date.now() + 30 * 60 * 1000),
      },
    },
    {
      id: "2",
      title: "New Lab Results",
      description: "Lab results for Sarah Johnson are now available",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      type: "alert",
      priority: "high",
      sender: {
        id: "lab-001",
        name: "Lab Corp",
        role: "Laboratory",
      },
      action: {
        label: "View Results",
        url: "/records/lab/456",
      },
      metadata: {
        patientId: "pat-002",
        testType: "Blood Test",
        urgent: true,
      },
    },
    {
      id: "3",
      title: "System Maintenance",
      description: "Scheduled system maintenance this weekend",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      type: "system",
      priority: "medium",
      action: {
        label: "Learn More",
        url: "/system/maintenance",
      },
    },
    {
      id: "4",
      title: "New Message",
      description: "You have a new message from Dr. Smith",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      type: "message",
      priority: "medium",
      sender: {
        id: "doc-001",
        name: "Dr. Smith",
        role: "Doctor",
      },
      action: {
        label: "View Message",
        url: "/messages/789",
      },
    },
    {
      id: "5",
      title: "Medication Refill",
      description: "Robert Brown's medication needs refill",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      type: "reminder",
      priority: "medium",
      sender: {
        id: "p3",
        name: "Robert Brown",
        role: "Patient",
      },
      action: {
        label: "Prescribe",
        url: "/prescriptions/new",
      },
      metadata: {
        medication: "Lisinopril 10mg",
        daysRemaining: 2,
      },
    },
    {
      id: "6",
      title: "HIPAA Audit Log",
      description: "Security audit completed successfully",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      type: "system",
      priority: "low",
      action: {
        label: "View Report",
        url: "/security/audit",
      },
    },
  ])

  const [filter, setFilter] = useState("all")
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    appointmentReminders: true,
    labResultAlerts: true,
    securityAlerts: true,
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "07:00",
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const archiveAllRead = () => {
    setNotifications(prev => prev.filter(notification => !notification.read))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case "system":
        return <Info className="h-5 w-5 text-purple-500" />
      case "reminder":
        return <Clock className="h-5 w-5 text-amber-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High Priority
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read
    if (filter === "alerts") return notification.type === "alert"
    if (filter === "appointments") return notification.type === "appointment"
    if (filter === "messages") return notification.type === "message"
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with alerts, reminders, and important messages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={unreadCount > 0 ? "destructive" : "outline"} className="gap-2">
            <BellRing className="h-3 w-3" />
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark all as read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={archiveAllRead}
                    disabled={notifications.filter(n => n.read).length === 0}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive read
                  </Button>
                </div>
              </div>
              <CardDescription>
                {unreadCount} unread notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Unread
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="flex-1">Alerts</TabsTrigger>
                  <TabsTrigger value="appointments" className="flex-1">Appointments</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <NotificationList
                    notifications={filteredNotifications}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getNotificationIcon={getNotificationIcon}
                    getPriorityBadge={getPriorityBadge}
                  />
                </TabsContent>

                <TabsContent value="unread" className="mt-6">
                  <NotificationList
                    notifications={filteredNotifications}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getNotificationIcon={getNotificationIcon}
                    getPriorityBadge={getPriorityBadge}
                  />
                </TabsContent>

                <TabsContent value="alerts" className="mt-6">
                  <NotificationList
                    notifications={filteredNotifications}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getNotificationIcon={getNotificationIcon}
                    getPriorityBadge={getPriorityBadge}
                  />
                </TabsContent>

                <TabsContent value="appointments" className="mt-6">
                  <NotificationList
                    notifications={filteredNotifications}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getNotificationIcon={getNotificationIcon}
                    getPriorityBadge={getPriorityBadge}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Statistics</CardTitle>
              <CardDescription>Activity over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">Appointments</span>
                  </div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">Alerts</span>
                  </div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground">-1 from last week</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Messages</span>
                  </div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">+5 from last week</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="text-sm font-medium">System</span>
                  </div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">No change</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Email Notifications
                    </Label>
                    <Switch
                      id="email"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push" className="flex items-center gap-2">
                      <BellRing className="h-4 w-4" />
                      Push Notifications
                    </Label>
                    <Switch
                      id="push"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS Alerts
                    </Label>
                    <Switch
                      id="sms"
                      checked={settings.smsAlerts}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, smsAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appointments" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Appointment Reminders
                    </Label>
                    <Switch
                      id="appointments"
                      checked={settings.appointmentReminders}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, appointmentReminders: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lab-results" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Lab Result Alerts
                    </Label>
                    <Switch
                      id="lab-results"
                      checked={settings.labResultAlerts}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, labResultAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="security" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Security Alerts
                    </Label>
                    <Switch
                      id="security"
                      checked={settings.securityAlerts}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, securityAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Quiet Hours</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                    <Switch
                      id="quiet-hours"
                      checked={settings.quietHours}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, quietHours: checked }))
                      }
                    />
                  </div>
                  {settings.quietHours && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={settings.quietStart}
                          onChange={(e) =>
                            setSettings(prev => ({ ...prev, quietStart: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={settings.quietEnd}
                          onChange={(e) =>
                            setSettings(prev => ({ ...prev, quietEnd: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => console.log("Settings saved", settings)}>
                Save Settings
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Filter className="mr-2 h-4 w-4" />
                Create Custom Filter
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Test Notification
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Stethoscope className="mr-2 h-4 w-4" />
                Emergency Override
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Notification List Component
interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
 getNotificationIcon: (type: Notification["type"]) => React.ReactNode
 getPriorityBadge: (priority: Notification["priority"]) => React.ReactNode
}

function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getPriorityBadge,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No notifications</h3>
        <p className="text-muted-foreground">You're all caught up!</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-150 pr-4">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={cn(
              "transition-all hover:shadow-md",
              !notification.read && "border-l-4 border-l-primary"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="pt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{notification.title}</h4>
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        {notification.sender && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-3 w-3" />
                            <span className="font-medium">{notification.sender.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {notification.sender.role}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </div>
                        {notification.metadata?.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {notification.action && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(notification.action!.url, "_self")}
                          >
                            {notification.action.label}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}