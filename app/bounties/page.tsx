"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Clock,
  Users,
  DollarSign,
  Target,
  Zap,
  Award,
  History,
  ArrowLeft,
  Upload,
  MessageCircle,
} from "lucide-react"

interface Bounty {
  id: number
  title: string
  description: string
  reward: number
  currency: string
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  timeLeft: string
  participants: number
  maxParticipants: number
  tags: string[]
  sponsor: string
  sponsorAvatar: string
}

interface BountyHistory {
  id: number
  title: string
  status: "completed" | "in-progress" | "failed"
  reward: number
  completedAt?: string
  progress: number
  description: string
  tags: string[]
  submissionUrl?: string
  feedback?: string
}

const mockBounties: Bounty[] = [
  {
    id: 1,
    title: "Build a React Component Library",
    description: "Create a comprehensive React component library with TypeScript, Storybook, and proper documentation.",
    reward: 500,
    currency: "USDC",
    difficulty: "Expert",
    timeLeft: "5 days left",
    participants: 12,
    maxParticipants: 20,
    tags: ["React", "TypeScript", "Storybook"],
    sponsor: "TechCorp",
    sponsorAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    title: "Smart Contract Audit",
    description: "Audit a DeFi smart contract for security vulnerabilities and gas optimization opportunities.",
    reward: 1000,
    currency: "ETH",
    difficulty: "Expert",
    timeLeft: "3 days left",
    participants: 5,
    maxParticipants: 10,
    tags: ["Solidity", "Security", "DeFi"],
    sponsor: "DeFi Protocol",
    sponsorAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    title: "API Integration Tutorial",
    description: "Create a comprehensive tutorial on integrating third-party APIs with proper error handling.",
    reward: 200,
    currency: "USDC",
    difficulty: "Medium",
    timeLeft: "1 week left",
    participants: 8,
    maxParticipants: 15,
    tags: ["API", "Tutorial", "JavaScript"],
    sponsor: "DevEducation",
    sponsorAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Build a cross-platform mobile app using React Native with authentication and real-time features.",
    reward: 750,
    currency: "USDC",
    difficulty: "Hard",
    timeLeft: "2 weeks left",
    participants: 15,
    maxParticipants: 25,
    tags: ["React Native", "Mobile", "Firebase"],
    sponsor: "MobileTech",
    sponsorAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    title: "Blockchain Integration",
    description: "Integrate Web3 functionality into an existing application with wallet connection and transactions.",
    reward: 600,
    currency: "ETH",
    difficulty: "Hard",
    timeLeft: "10 days left",
    participants: 7,
    maxParticipants: 12,
    tags: ["Web3", "Blockchain", "Ethereum"],
    sponsor: "CryptoStartup",
    sponsorAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    title: "AI Chatbot Development",
    description: "Create an intelligent chatbot using modern AI APIs with natural language processing capabilities.",
    reward: 400,
    currency: "USDC",
    difficulty: "Medium",
    timeLeft: "1 week left",
    participants: 20,
    maxParticipants: 30,
    tags: ["AI", "Chatbot", "NLP"],
    sponsor: "AI Solutions",
    sponsorAvatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockHistory: BountyHistory[] = [
  {
    id: 1,
    title: "Build a Todo App with React",
    status: "completed",
    reward: 100,
    completedAt: "2 days ago",
    progress: 100,
    description:
      "Created a fully functional todo application with React, including add, edit, delete, and filter functionality.",
    tags: ["React", "JavaScript", "CSS"],
    submissionUrl: "https://github.com/user/react-todo",
    feedback: "Excellent work! Clean code structure and great user experience.",
  },
  {
    id: 2,
    title: "Create NFT Marketplace",
    status: "in-progress",
    reward: 750,
    progress: 65,
    description: "Building a decentralized NFT marketplace with Web3 integration, smart contracts, and modern UI.",
    tags: ["React", "Solidity", "Web3", "IPFS"],
    submissionUrl: "https://github.com/user/nft-marketplace",
  },
  {
    id: 3,
    title: "Write Technical Blog Post",
    status: "failed",
    reward: 50,
    progress: 30,
    description: "Write a comprehensive blog post about advanced React patterns.",
    tags: ["Writing", "React", "Tutorial"],
    feedback: "Good start on the outline, but the submission was incomplete.",
  },
]

export default function BountiesPage() {
  const [selectedHistory, setSelectedHistory] = useState<BountyHistory | null>(null)
  const [showHistoryDetails, setShowHistoryDetails] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500"
      case "Hard":
        return "bg-orange-500/20 text-orange-400 border-orange-500"
      case "Expert":
        return "bg-red-500/20 text-red-400 border-red-500"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "in-progress":
        return "bg-blue-500/20 text-blue-400"
      case "failed":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const handleHistoryClick = (history: BountyHistory) => {
    setSelectedHistory(history)
    setShowHistoryDetails(true)
  }

  const handleBackToBounties = () => {
    setShowHistoryDetails(false)
    setSelectedHistory(null)
  }

  return (
    <div className="min-h-screen space-bg">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto space-bg bounties-scroll-area">
          <div className="p-6 min-h-full">
            {!showHistoryDetails ? (
              <>
                {/* Banner */}
                <div className="gradient-orange rounded-lg p-6 mb-6 text-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">🏆 Bounty Hunter Arena</h1>
                      <p className="text-lg opacity-90">Complete challenges, earn rewards, level up your skills</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-6 h-6" />
                        <span className="text-2xl font-bold">2,450</span>
                      </div>
                      <p className="opacity-90">Total Earned</p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Card className="space-card">
                    <CardContent className="p-4 text-center">
                      <Target className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">15</div>
                      <div className="text-sm text-gray-400">Active Bounties</div>
                    </CardContent>
                  </Card>
                  <Card className="space-card">
                    <CardContent className="p-4 text-center">
                      <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">8</div>
                      <div className="text-sm text-gray-400">Completed</div>
                    </CardContent>
                  </Card>
                  <Card className="space-card">
                    <CardContent className="p-4 text-center">
                      <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">3</div>
                      <div className="text-sm text-gray-400">In Progress</div>
                    </CardContent>
                  </Card>
                  <Card className="space-card">
                    <CardContent className="p-4 text-center">
                      <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">92%</div>
                      <div className="text-sm text-gray-400">Success Rate</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Available Bounties Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">🎯 Available Bounties</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-orange-500/20 border-orange-500 text-orange-500">
                      Filter by Difficulty
                    </Button>
                    <Button variant="outline" className="bg-orange-500/20 border-orange-500 text-orange-500">
                      Sort by Reward
                    </Button>
                  </div>
                </div>

                {/* Two Column Bounties Layout */}
                <div className="grid grid-cols-2 gap-6 pb-20 max-h-[600px] overflow-y-auto pr-2 hide-scrollbar">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {mockBounties
                      .filter((_, index) => index % 2 === 0)
                      .map((bounty) => (
                        <Card key={bounty.id} className="space-card">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge className={getDifficultyColor(bounty.difficulty)}>{bounty.difficulty}</Badge>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-green-500 font-bold">
                                  <DollarSign className="w-4 h-4" />
                                  {bounty.reward} {bounty.currency}
                                </div>
                              </div>
                            </div>
                            <CardTitle className="text-lg text-white mb-2">{bounty.title}</CardTitle>
                            <p className="text-gray-300 text-sm line-clamp-2">{bounty.description}</p>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex gap-1 mb-3 flex-wrap">
                              {bounty.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-gray-800/50 text-gray-300 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {bounty.timeLeft}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {bounty.participants}/{bounty.maxParticipants}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Avatar className="w-4 h-4">
                                  <AvatarImage src={bounty.sponsorAvatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">{bounty.sponsor[0]}</AvatarFallback>
                                </Avatar>
                                <span>{bounty.sponsor}</span>
                              </div>
                            </div>
                            <Button className="w-full gradient-orange text-black font-medium hover:glow-orange">
                              Accept Challenge
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {mockBounties
                      .filter((_, index) => index % 2 === 1)
                      .map((bounty) => (
                        <Card key={bounty.id} className="space-card">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge className={getDifficultyColor(bounty.difficulty)}>{bounty.difficulty}</Badge>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-green-500 font-bold">
                                  <DollarSign className="w-4 h-4" />
                                  {bounty.reward} {bounty.currency}
                                </div>
                              </div>
                            </div>
                            <CardTitle className="text-lg text-white mb-2">{bounty.title}</CardTitle>
                            <p className="text-gray-300 text-sm line-clamp-2">{bounty.description}</p>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex gap-1 mb-3 flex-wrap">
                              {bounty.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-gray-800/50 text-gray-300 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {bounty.timeLeft}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {bounty.participants}/{bounty.maxParticipants}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Avatar className="w-4 h-4">
                                  <AvatarImage src={bounty.sponsorAvatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">{bounty.sponsor[0]}</AvatarFallback>
                                </Avatar>
                                <span>{bounty.sponsor}</span>
                              </div>
                            </div>
                            <Button className="w-full gradient-orange text-black font-medium hover:glow-orange">
                              Accept Challenge
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              /* History Details View */
              selectedHistory && (
                <div className="min-h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      variant="ghost"
                      onClick={handleBackToBounties}
                      className="text-orange-500 hover:text-orange-400"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Bounties
                    </Button>
                    <h1 className="text-3xl font-bold text-white">Challenge Details</h1>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Main Details */}
                    <div className="space-y-6">
                      {/* Challenge Overview */}
                      <Card className="space-card">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <CardTitle className="text-2xl text-white">{selectedHistory.title}</CardTitle>
                                <Badge className={getStatusColor(selectedHistory.status)} variant="secondary">
                                  {selectedHistory.status}
                                </Badge>
                              </div>
                              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                                {selectedHistory.description}
                              </p>
                              <div className="flex gap-2 mb-6">
                                {selectedHistory.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="bg-gray-800/50 text-gray-300">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-6 h-6 text-green-500" />
                                <span className="text-3xl font-bold text-green-500">${selectedHistory.reward}</span>
                              </div>
                              <p className="text-gray-400">Reward</p>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>

                      {/* Progress Section */}
                      <Card className="space-card">
                        <CardHeader>
                          <CardTitle className="text-orange-500 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Progress & Milestones
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-400">Overall Completion</span>
                              <span className="text-white font-medium">{selectedHistory.progress}%</span>
                            </div>
                            <Progress value={selectedHistory.progress} className="h-3" />
                          </div>

                          {/* Milestone breakdown */}
                          <div className="space-y-3 mt-6">
                            <h4 className="text-white font-medium">Milestones</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="text-xs text-white">✓</span>
                                  </div>
                                  <span className="text-gray-300">Project Setup & Structure</span>
                                </div>
                                <span className="text-green-500 text-sm">Completed</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="text-xs text-white">✓</span>
                                  </div>
                                  <span className="text-gray-300">Core Functionality</span>
                                </div>
                                <span className="text-green-500 text-sm">Completed</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="text-xs text-white">✓</span>
                                  </div>
                                  <span className="text-gray-300">Testing & Documentation</span>
                                </div>
                                <span className="text-green-500 text-sm">Completed</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Skills Gained */}
                      <Card className="space-card">
                        <CardHeader>
                          <CardTitle className="text-orange-500 flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Skills Gained
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-300">React Hooks</span>
                                <span className="text-orange-500">+25 XP</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">State Management</span>
                                <span className="text-orange-500">+20 XP</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Component Design</span>
                                <span className="text-orange-500">+15 XP</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-300">CSS Styling</span>
                                <span className="text-orange-500">+10 XP</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Git Workflow</span>
                                <span className="text-orange-500">+15 XP</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Testing</span>
                                <span className="text-orange-500">+20 XP</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - Additional Info */}
                    <div className="space-y-6">
                      {/* Submission Details */}
                      {selectedHistory.submissionUrl && (
                        <Card className="space-card">
                          <CardHeader>
                            <CardTitle className="text-orange-500 flex items-center gap-2">
                              <Upload className="w-5 h-5" />
                              Submission
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="bg-gray-800/30 rounded-lg p-4">
                              <h4 className="text-white font-medium mb-2">Repository</h4>
                              <p className="text-gray-400 text-sm mb-3">GitHub repository with complete source code</p>
                              <Button
                                variant="outline"
                                className="bg-orange-500/20 border-orange-500 text-orange-500"
                                asChild
                              >
                                <a href={selectedHistory.submissionUrl} target="_blank" rel="noopener noreferrer">
                                  View Submission
                                </a>
                              </Button>
                            </div>

                            <div className="bg-gray-800/30 rounded-lg p-4">
                              <h4 className="text-white font-medium mb-2">Live Demo</h4>
                              <p className="text-gray-400 text-sm mb-3">Working application deployed on Vercel</p>
                              <Button variant="outline" className="bg-blue-500/20 border-blue-500 text-blue-500">
                                View Live Demo
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Feedback Section */}
                      {selectedHistory.feedback && (
                        <Card className="space-card">
                          <CardHeader>
                            <CardTitle className="text-orange-500 flex items-center gap-2">
                              <MessageCircle className="w-5 h-5" />
                              Reviewer Feedback
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-gray-800/30 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                  <AvatarFallback>RV</AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="text-white font-medium">Code Reviewer</span>
                                  <p className="text-xs text-gray-400">Senior Developer</p>
                                </div>
                              </div>
                              <p className="text-gray-300 leading-relaxed">{selectedHistory.feedback}</p>

                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span className="text-sm text-gray-400">Code Quality</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span className="text-sm text-gray-400">Functionality</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span className="text-sm text-gray-400">Documentation</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Related Challenges */}
                      <Card className="space-card">
                        <CardHeader>
                          <CardTitle className="text-orange-500 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Related Challenges
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                              <h4 className="text-white font-medium text-sm">Advanced React Patterns</h4>
                              <p className="text-gray-400 text-xs">Build complex components with render props</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">Medium</Badge>
                                <span className="text-green-500 text-sm">$250</span>
                              </div>
                            </div>

                            <div className="p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                              <h4 className="text-white font-medium text-sm">React Testing Library</h4>
                              <p className="text-gray-400 text-xs">Write comprehensive tests for React apps</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge className="bg-green-500/20 text-green-400 border-green-500">Easy</Badge>
                                <span className="text-green-500 text-sm">$150</span>
                              </div>
                            </div>

                            <div className="p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                              <h4 className="text-white font-medium text-sm">Full-Stack Todo App</h4>
                              <p className="text-gray-400 text-xs">Add backend API and database</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500">Hard</Badge>
                                <span className="text-green-500 text-sm">$400</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Achievement Earned */}
                      <Card className="space-card">
                        <CardHeader>
                          <CardTitle className="text-orange-500 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Achievement Unlocked
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center p-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-3">
                              <Trophy className="w-8 h-8 text-black" />
                            </div>
                            <h4 className="text-white font-bold mb-1">React Rookie</h4>
                            <p className="text-gray-400 text-sm mb-3">Completed your first React challenge</p>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
                              Rare Achievement
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Panel - Bounty History */}
        <div className="w-80 space-bg border-l border-orange-500/20 overflow-y-auto bounties-scroll-area">
          <div className="p-6 min-h-full">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-orange-500">Your Journey</h3>
            </div>

            <div className="space-y-4">
              {mockHistory.map((item) => (
                <Card key={item.id} className="space-card cursor-pointer" onClick={() => handleHistoryClick(item)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm line-clamp-2">{item.title}</h4>
                      <Badge className={getStatusColor(item.status)} variant="secondary">
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-green-500 font-medium">${item.reward}</span>
                      {item.completedAt && <span className="text-xs text-gray-400">{item.completedAt}</span>}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-400">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
