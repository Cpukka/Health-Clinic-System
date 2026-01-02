"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function TestToastPage() {
  const { toast } = useToast()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Toast Test Page</h1>
      
      <div className="space-y-4">
        <Button
          onClick={() => {
            toast({
              title: "Default Toast",
              description: "This is a default toast message.",
            })
          }}
        >
          Show Default Toast
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Destructive Toast",
              description: "This is a destructive toast message.",
            })
          }}
        >
          Show Destructive Toast
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Success!",
              description: "Your action was completed successfully.",
            })
          }}
        >
          Show Success Toast
        </Button>
      </div>
    </div>
  )
}