"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  Award,
  Target,
  MessageCircle,
  ThumbsUp,
  Eye,
  Code,
  Users,
  TrendingUp,
  Rocket,
  Zap,
  ArrowUp,
} from "lucide-react"

interface Achievement {
  id: number
  title: string
  description: string
  icon: any
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedAt: string
}

interface BlogContribution {
  id: number
  title: string
  type: "post" | "comment" | "help"
  content: string
  likes: number
  comments: number
  views: number
  createdAt: string
}

interface UserData {
  name: string
  email: string
  password: string
  wallet: string // important: matches localStorage key you saved in register page
}

const achievements: Achievement[] = [
  {
    id: 1,
    title: "First Steps",
    description: "Posted your first blog",
    icon: Star,
    rarity: "common",
    unlockedAt: "2024-01-01",
  },
  {
    id: 2,
    title: "Helper",
    description: "Helped 10 community members",
    icon: Users,
    rarity: "rare",
    unlockedAt: "2024-01-15",
  },
  {
    id: 3,
    title: "Bounty Hunter",
    description: "Completed 5 bounties",
    icon: Target,
    rarity: "epic",
    unlockedAt: "2024-01-20",
  },
  {
    id: 4,
    title: "Code Master",
    description: "Earned 1000+ skill points",
    icon: Code,
    rarity: "legendary",
    unlockedAt: "2024-01-25",
  },
  {
    id: 5,
    title: "Community Leader",
    description: "Top contributor for 3 months",
    icon: Award,
    rarity: "legendary",
    unlockedAt: "2024-01-30",
  },
  {
    id: 6,
    title: "Problem Solver",
    description: "Solved 50+ help requests",
    icon: Zap,
    rarity: "epic",
    unlockedAt: "2024-02-01",
  },
]

export default function ProfilePage() {
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [userContributions, setUserContributions] = useState<BlogContribution[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem('devspace_user')
    let parsedUser: UserData | null = null
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (err) {
        console.error("Failed to parse user data", err)
      }
    }

    // Get posts and comments from localStorage
    const postsRaw = localStorage.getItem('devspace_blogs')
    const commentsRaw = localStorage.getItem('devspace_comments')
    let posts: any[] = []
    let comments: any[] = []
    if (postsRaw) posts = JSON.parse(postsRaw)
    if (commentsRaw) comments = JSON.parse(commentsRaw)

    // Filter by user (by name or wallet)
    let userPosts = posts
    let userComments = comments
    if (parsedUser) {
      userPosts = posts.filter(
        (p) => p.author === parsedUser.name || (parsedUser.wallet && p.wallet === parsedUser.wallet)
      )
      userComments = comments.filter(
        (c) => c.author === parsedUser.name || (parsedUser.wallet && c.wallet === parsedUser.wallet)
      )
    }

    // Map to BlogContribution format
    const postContribs: BlogContribution[] = userPosts.map((p) => ({
      id: p.id,
      title: p.title,
      type: "post",
      content: p.content,
      likes: p.likes || 0,
      comments: p.comments || 0,
      views: p.views || 0,
      createdAt: p.time || "Unknown",
    }))
    const commentContribs: BlogContribution[] = userComments.map((c) => ({
      id: c.id,
      title: `Commented on post #${c.postId}`,
      type: "comment",
      content: c.content,
      likes: c.votes || 0,
      comments: 0,
      views: 0,
      createdAt: c.time || "Unknown",
    }))
    // Combine and sort by createdAt (if possible)
    const all = [...postContribs, ...commentContribs].sort((a, b) => {
      // Try to sort by timestamp if available
      const aTime = Date.parse(a.createdAt) || 0
      const bTime = Date.parse(b.createdAt) || 0
      return bTime - aTime
    })
    setUserContributions(all)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/20 text-gray-400 border-gray-500"
      case "rare":
        return "bg-blue-500/20 text-blue-400 border-blue-500"
      case "epic":
        return "bg-purple-500/20 text-purple-400 border-purple-500"
      case "legendary":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <Code className="w-4 h-4" />
      case "comment":
        return <MessageCircle className="w-4 h-4" />
      case "help":
        return <Users className="w-4 h-4" />
      default:
        return <Code className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "post":
        return "bg-green-500/20 text-green-400"
      case "comment":
        return "bg-blue-500/20 text-blue-400"
      case "help":
        return "bg-orange-500/20 text-orange-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="min-h-screen space-bg">
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full gradient-orange text-black shadow-lg hover:glow-orange"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      {/* Full Width Container */}
      <div className="w-full px-6 py-12 space-y-8">
        {/* Profile Header Section - Centered */}
        <div className="text-center space-y-8">
          <Avatar className="w-32 h-32 mx-auto border-4 border-orange-500 shadow-2xl shadow-orange-500/20">
            <AvatarImage src="/placeholder.svg?height=128&width=128" />
            <AvatarFallback className="text-4xl bg-gradient-to-br from-orange-500 to-yellow-500 text-black">
              JD
            </AvatarFallback>
          </Avatar>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Rocket className="w-6 h-6 text-orange-500" />
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    {user?.name
                      ? user.name
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')
                      : "Unknown User"}
                  </h1>
                  {user?.wallet && (
                    <p className="mt-2 text-sm text-gray-400 break-all">
                      {user.wallet}
                    </p>
                  )}
                </div>
              <Zap className="w-6 h-6 text-orange-500" />
            </div>

            <p className="text-xl text-gray-300">🚀 Space Explorer & Code Architect in the DevSpace Universe</p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">Level 12</div>
                <div className="text-gray-300">Space Rank</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">2,450</div>
                <div className="text-gray-300">Cosmic XP</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">89</div>
                <div className="text-gray-300">Missions</div>
              </div>
            </div>

            {/* Achievement Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {achievements.slice(0, 4).map((achievement) => (
                <div key={achievement.id} className="text-center group cursor-pointer">
                  <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-3 border-2 border-orange-500/30 group-hover:border-orange-500 transition-all group-hover:scale-105 mx-auto">
                    <achievement.icon className="w-10 h-10 text-orange-500" />
                  </div>
                  <div className="text-sm font-medium text-white">{achievement.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Sidebar - Stats & Skills */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Posts Created</span>
                  <span className="text-white font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Comments Made</span>
                  <span className="text-white font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bounties Completed</span>
                  <span className="text-white font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Likes</span>
                  <span className="text-white font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Certifications</span>
                  <span className="text-white font-medium">5</span>
                </div>
              </CardContent>
            </Card>

            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Top Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">React</span>
                    <span className="text-orange-500">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">TypeScript</span>
                    <span className="text-orange-500">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">Node.js</span>
                    <span className="text-orange-500">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">Python</span>
                    <span className="text-orange-500">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area - Expanded */}
          <div className="lg:col-span-4 space-y-8">
            {/* Achievement Gallery */}
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievement Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="group cursor-pointer p-4 rounded-lg border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105"
                    >
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 rounded-full border-2 ${getRarityColor(achievement.rarity)} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-all`}
                        >
                          <achievement.icon className="w-8 h-8" />
                        </div>
                        <h4 className="font-semibold text-white text-sm mb-2">{achievement.title}</h4>
                        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                            {achievement.rarity}
                          </Badge>
                          <span className="text-xs text-gray-500">{achievement.unlockedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Contributions */}
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Recent Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userContributions.length === 0 ? (
                    <div className="text-gray-400 text-center col-span-2 py-8">
                      No recent contributions yet. Go post or comment to see them here!
                    </div>
                  ) : (
                    userContributions.map((contribution: BlogContribution) => (
                      <div
                        key={contribution.id + contribution.type}
                        className="p-4 rounded-lg border border-gray-700 hover:border-orange-500/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={getTypeColor(contribution.type)} variant="secondary">
                                {getTypeIcon(contribution.type)}
                                <span className="ml-1 capitalize">{contribution.type}</span>
                              </Badge>
                              <span className="text-sm text-gray-400">{contribution.createdAt}</span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">{contribution.title}</h4>
                            <p className="text-gray-300 text-sm line-clamp-2">{contribution.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {contribution.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {contribution.comments}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {contribution.views}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-orange-500/20 border-orange-500 text-orange-500"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700">
                Load More Contributions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}