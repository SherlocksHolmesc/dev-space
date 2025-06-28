"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Plus, MessageCircle, ThumbsUp, Eye, HelpCircle, Code, X, Send, ChevronUp, ChevronDown } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  content: string
  author: string
  avatar: string
  type: "blog" | "help"
  tags: string[]
  likes: number
  comments: number
  views: number
  timeAgo: string
  level: number
}

interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  timeAgo: string
  votes: number
  userVote: "up" | "down" | null
  level: number
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Scalable React Applications with TypeScript",
    content:
      "In this comprehensive guide, I'll walk you through the best practices for building scalable React applications using TypeScript. We'll cover component architecture, state management patterns, and performance optimization techniques that will help you build maintainable applications. First, let's start with setting up a proper project structure. When building large-scale applications, organization is key. I recommend using a feature-based folder structure where each feature has its own components, hooks, and utilities. This approach makes it easier to maintain and scale your application as it grows. Next, we'll dive into TypeScript integration. TypeScript provides excellent developer experience with IntelliSense, compile-time error checking, and better refactoring capabilities. Make sure to define proper interfaces for your props and state to get the most out of TypeScript's type system.",
    author: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "blog",
    tags: ["React", "TypeScript", "Architecture"],
    likes: 42,
    comments: 8,
    views: 156,
    timeAgo: "2 hours ago",
    level: 7,
  },
  {
    id: 2,
    title: "Need help with Next.js API routes authentication",
    content:
      "I'm struggling with implementing JWT authentication in Next.js API routes. Can someone help me understand the best approach? I've tried several methods but keep running into CORS issues and token validation problems. Here's what I've tried so far: 1. Using middleware to validate tokens, 2. Implementing custom authentication hooks, 3. Setting up proper CORS headers. The main issue I'm facing is that the token validation seems to work in development but fails in production. I'm using jsonwebtoken library for token generation and verification. Any insights would be greatly appreciated!",
    author: "Sarah Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "help",
    tags: ["Next.js", "Authentication", "JWT"],
    likes: 15,
    comments: 12,
    views: 89,
    timeAgo: "4 hours ago",
    level: 3,
  },
]

const mockComments: Comment[] = [
  {
    id: 1,
    author: "Mike Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Great explanation! This really helped me understand the component composition pattern. The examples are clear and well-structured.",
    timeAgo: "1 hour ago",
    votes: 12,
    userVote: null,
    level: 5,
  },
  {
    id: 2,
    author: "Emma Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "I've been using this approach in production for 6 months now. One thing to add is that you should also consider memoization for performance optimization.",
    timeAgo: "2 hours ago",
    votes: 8,
    userVote: null,
    level: 9,
  },
  {
    id: 3,
    author: "David Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "Thanks for sharing! Could you provide more details about the error handling patterns you mentioned?",
    timeAgo: "3 hours ago",
    votes: 3,
    userVote: null,
    level: 4,
  },
]

export default function BlogsPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>(mockComments)

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post)
  }

  const handleCloseDetails = () => {
    setSelectedPost(null)
  }

  const handleVote = (commentId: number, voteType: "up" | "down") => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const currentVote = comment.userVote
          let newVotes = comment.votes
          let newUserVote: "up" | "down" | null = voteType

          if (currentVote === voteType) {
            newUserVote = null
            newVotes += voteType === "up" ? -1 : 1
          } else if (currentVote === null) {
            newVotes += voteType === "up" ? 1 : -1
          } else {
            newVotes += voteType === "up" ? 2 : -2
          }

          return { ...comment, votes: newVotes, userVote: newUserVote }
        }
        return comment
      }),
    )
  }

  return (
    <div className="min-h-screen space-bg">
      <div className="flex h-screen">
        {/* Main Content - Posts List */}
        <div className={`transition-all duration-300 ${selectedPost ? "w-1/3" : "w-full"} overflow-y-auto space-bg`}>
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">🚀 DevSpace Community</h1>
              <p className="text-gray-400">Share knowledge, get help, explore the universe of code</p>
            </div>

            {/* Create Post Section */}
            <Card className="space-card mb-6">
              <CardContent className="p-4">
                {!showCreatePost ? (
                  <Button
                    onClick={() => setShowCreatePost(true)}
                    className="w-full gradient-orange text-black font-medium hover:glow-orange"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Share your knowledge or ask for help
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Input
                      placeholder="What's your post title?"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                    <Textarea
                      placeholder="Share your thoughts, code, or question..."
                      className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button className="gradient-orange text-black">
                        <Code className="w-4 h-4 mr-2" />
                        Post Blog
                      </Button>
                      <Button variant="outline" className="bg-orange-500/20 border-orange-500 text-orange-500">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Ask for Help
                      </Button>
                      <Button variant="ghost" onClick={() => setShowCreatePost(false)} className="text-gray-400">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <Card key={post.id} className="space-card cursor-pointer" onClick={() => handlePostClick(post)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{post.author}</span>
                            <Badge variant="outline" className="text-orange-500 border-orange-500">
                              Lv.{post.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{post.timeAgo}</p>
                        </div>
                      </div>
                      <Badge
                        variant={post.type === "help" ? "destructive" : "default"}
                        className={post.type === "help" ? "bg-red-500/20 text-red-400" : "gradient-orange text-black"}
                      >
                        {post.type === "help" ? (
                          <HelpCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Code className="w-3 h-3 mr-1" />
                        )}
                        {post.type === "help" ? "Need Help" : "Blog"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg mb-2 text-white hover:text-orange-500 transition-colors">
                      {post.title}
                    </CardTitle>
                    <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-800/50 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Panel - Post Content */}
        {selectedPost && (
          <div className="w-1/3 h-full space-bg border-l border-r border-orange-500/20 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-orange-500">📖 Post Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Post Content */}
              <Card className="space-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={selectedPost.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedPost.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{selectedPost.author}</span>
                        <Badge variant="outline" className="text-orange-500 border-orange-500">
                          Lv.{selectedPost.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{selectedPost.timeAgo}</p>
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold text-white mb-4">{selectedPost.title}</h4>

                  {/* Full Content */}
                  <div className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line">{selectedPost.content}</div>

                  <div className="flex gap-2 mb-6">
                    {selectedPost.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-800/50 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400 p-0">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {selectedPost.likes}
                    </Button>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {selectedPost.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {selectedPost.views}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Right Panel - Comments Section */}
        {selectedPost && (
          <div className="w-1/3 h-full space-bg overflow-y-auto">
            <div className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-orange-500" />💬 Comments ({comments.length})
              </h4>

              {/* Add Comment */}
              <Card className="space-card mb-6">
                <CardContent className="p-4">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white mb-3"
                  />
                  <Button size="sm" className="gradient-orange text-black">
                    <Send className="w-4 h-4 mr-2" />
                    Comment
                  </Button>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="space-card">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Voting Section */}
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleVote(comment.id, "up")}
                            className={`vote-button ${comment.userVote === "up" ? "active" : ""}`}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span
                            className={`text-sm font-medium ${comment.votes > 0 ? "text-green-500" : comment.votes < 0 ? "text-red-500" : "text-gray-400"}`}
                          >
                            {comment.votes}
                          </span>
                          <button
                            onClick={() => handleVote(comment.id, "down")}
                            className={`vote-button ${comment.userVote === "down" ? "active" : ""}`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{comment.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white">{comment.author}</span>
                                <Badge variant="outline" className="text-orange-500 border-orange-500 text-xs">
                                  Lv.{comment.level}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-400">{comment.timeAgo}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

