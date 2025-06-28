"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trophy, Shield, User, Zap, Star, Award, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Blogs",
    url: "/",
    icon: Home,
    description: "Community Posts & Help",
  },
  {
    title: "Bounties",
    url: "/bounties",
    icon: Trophy,
    description: "Earn Rewards",
  },
  {
    title: "On-Chain",
    url: "/onchain",
    icon: Shield,
    description: "Certifications",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    description: "Your Journey",
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
    description: "Manage Funds",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full space-bg border-r border-orange-500/20 transition-all duration-300 z-40",
        isHovered ? "w-64" : "w-16",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden whitespace-nowrap",
              isHovered ? "w-auto opacity-100" : "w-0 opacity-0",
            )}
          >
            <h2 className="text-lg font-bold text-orange-500">DevSpace</h2>
          </div>
        </div>
      </div>

      <div className="px-2">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-300 group relative",
              pathname === item.url ? "bg-orange-500/20 border-r-2 border-orange-500" : "hover:bg-gray-800/50",
            )}
          >
            <item.icon
              className={cn(
                "w-5 h-5 transition-colors flex-shrink-0",
                pathname === item.url ? "text-orange-500" : "text-gray-400 group-hover:text-white",
              )}
            />
            <div
              className={cn(
                "transition-all duration-300 overflow-hidden whitespace-nowrap",
                isHovered ? "w-auto opacity-100" : "w-0 opacity-0",
              )}
            >
              <div className="flex flex-col">
                <span className={cn("font-medium", pathname === item.url ? "text-orange-500" : "text-white")}>
                  {item.title}
                </span>
                <span className="text-xs text-gray-400">{item.description}</span>
              </div>
            </div>
            {pathname === item.url && isHovered && (
              <div className="absolute right-2">
                <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 left-2 right-2">
        <div className={cn("transition-all duration-300", isHovered ? "opacity-100" : "opacity-0")}>
          <div className="space-card p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">Level 5</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="gradient-orange h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">750/1000 XP</p>
          </div>
        </div>
      </div>
    </div>
  )
}
