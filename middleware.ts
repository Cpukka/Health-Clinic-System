// middleware.ts - UPDATED VERSION
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname
    
    // Always allow public routes
    if (
      pathname.startsWith('/api/') ||
      pathname === '/login' ||
      pathname === '/register' ||
      pathname.startsWith('/forgot-password')
    ) {
      return NextResponse.next()
    }

    // Redirect authenticated users from auth pages
    if ((pathname === '/login' || pathname === '/register') && token) {
      const userRole = token?.role as string
      
      if (userRole === "PATIENT") {
        return NextResponse.redirect(new URL('/portal', req.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Redirect unauthenticated users
    if (!token) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(url)
    }

    // Get user role from token
    const userRole = token?.role as string
    
    // PATIENTS: Redirect to portal if trying to access staff areas
    if (userRole === "PATIENT" && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/portal', req.url))
    }
    
    // STAFF/ADMIN: Redirect to dashboard if trying to access patient portal
    if (userRole !== "PATIENT" && pathname.startsWith('/portal')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname
        
        // Always allow public routes
        if (
          pathname.startsWith('/api/') ||
          pathname === '/login' ||
          pathname === '/register' ||
          pathname.startsWith('/forgot-password')
        ) {
          return true
        }
        
        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/portal/:path*',
    '/login',
    '/register',
  ],
}