"use client"

// Change this import
import { ScrollArea } from "../../components/ui/simple-scroll-area"
//import { ScrollArea } from "../../components/ui/scroll-area-fallback"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
//import { ScrollArea } from "../../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Send,
  Search,
  User,
  Clock,
  Check,
  CheckCheck,
  MoreVertical,
  Paperclip,
  Phone,
  Video,
} from "lucide-react"
import { format } from "date-fns"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: string[]
}

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      participant: {
        id: "p1",
        name: "John Doe",
        role: "Patient",
      },
      lastMessage: "Thank you for the prescription!",
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
    },
    {
      id: "2",
      participant: {
        id: "p2",
        name: "Dr. Sarah Johnson",
        role: "Doctor",
      },
      lastMessage: "Can you send me the test results?",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
    },
  ])

  const [activeConversation, setActiveConversation] = useState<string>("1")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      senderId: "p1",
      receiverId: session?.user?.id || "current-user",
      content: "Hello Doctor, I'm feeling better today.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: true,
    },
    {
      id: "m2",
      senderId: session?.user?.id || "current-user",
      receiverId: "p1",
      content: "That's great to hear! How's the medication working?",
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      read: true,
    },
    {
      id: "m3",
      senderId: "p1",
      receiverId: session?.user?.id || "current-user",
      content: "Much better, thank you for the prescription!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
  ])
  
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: session?.user?.id || "current-user",
      receiverId: conversations.find(c => c.id === activeConversation)?.participant.id || "",
      content: newMessage,
      timestamp: new Date(),
      read: false,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const activeConversationData = conversations.find(c => c.id === activeConversation)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          Secure messaging with patients and staff
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Conversations</CardTitle>
              <Button size="sm" variant="outline">
                New Chat
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                  <Badge variant="destructive" className="ml-2">
                    {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="patients" className="flex-1">Patients</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <ScrollArea className="h-125">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
                        activeConversation === conversation.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setActiveConversation(conversation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {conversation.participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">
                                {conversation.participant.name}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {format(conversation.lastMessageTime, "h:mm a")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {conversation.participant.role}
                              </Badge>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="default" className="h-5 px-1.5">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {activeConversationData ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {activeConversationData.participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {activeConversationData.participant.name}
                      </CardTitle>
                      <CardDescription>
                        {activeConversationData.participant.role} • Last seen recently
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="icon" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-125 p-6">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isSender = message.senderId === session?.user?.id
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              isSender
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                                isSender
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span>{format(message.timestamp, "h:mm a")}</span>
                              {isSender && (
                                message.read ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="outline">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-lg font-semibold">No conversation selected</h3>
                <p className="mt-2 text-muted-foreground">
                  Select a conversation or start a new one
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}