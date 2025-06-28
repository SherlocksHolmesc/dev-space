"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Trophy, Shield, User, Zap, Star, Award, Wallet, LogOut, UserCheck } from "lucide-react"
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
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication status on component mount and when pathname changes
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isLoggedInStatus = localStorage.getItem('is_logged_in')
        const userData = localStorage.getItem('devspace_user')
        
        if (isLoggedInStatus === 'true' && userData) {
          const userInfo = JSON.parse(userData)
          setUser(userInfo)
          setIsLoggedIn(true)
        } else {
          setUser(null)
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setUser(null)
        setIsLoggedIn(false)
      }
    }

    checkAuth()
  }, [pathname]) // Re-check auth when pathname changes

  const handleLogout = () => {
    try {
      localStorage.removeItem('is_logged_in')
      // Keep user data for re-login, but remove login status
      setUser(null)
      setIsLoggedIn(false)
      router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen space-bg border-r border-orange-500/20 transition-all duration-300 z-40 flex flex-col overflow-hidden",
        isHovered ? "w-64" : "w-16",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-4 flex-shrink-0">
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

      {/* Navigation Menu - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
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

      {/* Bottom Section - Always Visible */}
      <div className="p-2 space-y-2 flex-shrink-0">
        {/* Level Progress */}
        <div className="space-card p-3 rounded-lg mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-orange-500" />
            <span className={cn(
              "text-sm font-medium text-orange-500 transition-all duration-300 overflow-hidden whitespace-nowrap",
              isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
            )}>
              Level 5
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="gradient-orange h-2 rounded-full" style={{ width: "75%" }}></div>
          </div>
          <p className={cn(
            "text-xs text-gray-400 mt-1 transition-all duration-300 overflow-hidden whitespace-nowrap",
            isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
          )}>
            750/1000 XP
          </p>
        </div>

        {/* Logout Button */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group space-card border border-red-500/20",
              isHovered ? "hover:bg-red-600/10" : "hover:bg-red-600/5"
            )}
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors flex-shrink-0" />
            <div
              className={cn(
                "transition-all duration-300 overflow-hidden whitespace-nowrap",
                isHovered ? "w-auto opacity-100" : "w-0 opacity-0",
              )}
            >
              <span className="text-sm font-medium text-red-400 group-hover:text-red-300">Logout</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
