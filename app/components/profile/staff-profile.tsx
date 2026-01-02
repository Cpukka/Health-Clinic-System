// Move your staff profile code here
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import { useSession } from "next-auth/react"
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

export default function StaffProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    // Your staff profile data and logic...
    // (Copy from your existing staff profile page)
  }, [session])

  // Rest of your staff profile code...
  return (
    <div>Staff Profile Content</div>
  )
}