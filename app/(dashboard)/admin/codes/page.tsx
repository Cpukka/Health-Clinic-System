// app/(dashboard)/admin/codes/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Badge } from "@/app/components/ui/badge"
import { Copy, Plus, Trash2, RefreshCw } from "lucide-react"
import { toast } from "../../../../app/components/ui/use-toast"

export default function ClinicCodesPage() {
  const [codes, setCodes] = useState([
    { id: "1", code: "CLINIC2024", role: "ADMIN", used: false, createdAt: "2024-01-15" },
    { id: "2", code: "DOCTOR123", role: "DOCTOR", used: true, createdAt: "2024-01-10" },
    { id: "3", code: "NURSE456", role: "NURSE", used: false, createdAt: "2024-01-12" },
  ])
  const [newCode, setNewCode] = useState("")
  const [selectedRole, setSelectedRole] = useState("DOCTOR")

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 10; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewCode(code)
  }

  const createCode = () => {
    if (!newCode || !selectedRole) return
    
    const newCodeObj = {
      id: Date.now().toString(),
      code: newCode,
      role: selectedRole,
      used: false,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setCodes([newCodeObj, ...codes])
    setNewCode("")
    
    toast({
      title: "Code Created",
      description: `Code ${newCode} created for ${selectedRole} role`,
    })
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clinic Access Codes</h2>
          <p className="text-muted-foreground">
            Generate and manage clinic access codes for staff registration
          </p>
        </div>
      </div>

      {/* Generate New Code */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Code</CardTitle>
          <CardDescription>
            Create access codes for new staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full border rounded-md p-2"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
                <option value="ADMIN">Administrator</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="HMO_ADMIN">HMO Admin</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Access Code</label>
              <div className="flex gap-2">
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Generate or enter code"
                  className="flex-1"
                />
                <Button variant="outline" onClick={generateCode}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button onClick={createCode} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Code
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• Share this code with new staff members</p>
            <p>• Each code can only be used once</p>
            <p>• Codes are role-specific</p>
          </div>
        </CardContent>
      </Card>

      {/* Existing Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Access Codes</CardTitle>
          <CardDescription>
            All generated clinic access codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Access Code</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono">{code.code}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{code.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={code.used ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                      {code.used ? "Used" : "Available"}
                    </Badge>
                  </TableCell>
                  <TableCell>{code.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(code.code)}
                        disabled={code.used}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}