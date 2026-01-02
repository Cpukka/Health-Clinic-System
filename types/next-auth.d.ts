import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      clinicId?: string
      hmoId?: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    clinicId?: string
    hmoId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    clinicId?: string
    hmoId?: string
  }
}