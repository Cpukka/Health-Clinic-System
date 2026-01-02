import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/providers/theme-provider"
import { AuthProvider } from "./components/providers/auth-provider"
import { Toaster } from "./components/ui/toaster" // Fixed path

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Health Clinic System",
  description: "Complete appointment and records management system for clinics and HMOs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}