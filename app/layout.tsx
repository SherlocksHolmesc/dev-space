import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevSpace",
  description: "A gamified developer community platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen space-bg">
            <AppSidebar />
            <main className="flex-1 pl-16">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
