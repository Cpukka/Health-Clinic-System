// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "./components/providers/theme-provider"
import { AuthProvider } from "./components/providers/auth-provider"
import { Toaster } from "./components/ui/toaster"

let fontClassName = "font-sans"

// Only load Inter if Google Fonts is not disabled
if (!process.env.NEXT_PUBLIC_GOOGLE_FONTS_DISABLED) {
  try {
    const { Inter } = await import("next/font/google")
    const inter = Inter({ subsets: ["latin"] })
    fontClassName = inter.className
  } catch (error) {
    console.log("Google Fonts not available, using system font")
  }
}

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
      <body className={fontClassName}>
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