"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Check if we're on login or register pages
  const isAuthPage = pathname === '/login' || pathname === '/'
  
  if (isAuthPage) {
    // Auth pages without sidebar
    return (
      <main className="w-full space-bg min-h-screen">
        {children}
        <Toaster />
      </main>
    )
  }
  
  // Other pages with sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full space-bg">
        <AppSidebar />
        <main className="relative flex-1 pl-16 h-screen overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
} 