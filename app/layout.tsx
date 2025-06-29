 import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Toaster } from "sonner"

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
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}