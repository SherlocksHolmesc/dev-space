"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Upload, X, ThumbsUp, MessageCircle, Eye, ExternalLink, Shield, ChevronUp, ChevronDown, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"

// Import your audit hook for on-chain verification
import { useAuditTrail } from "@/hooks/useAuditTrail"

interface BlogPost {
  id: number
  title: string
  content: string
  author: string
  wallet?: string
  avatar: string
  tags: string[]
  likes: number
  comments: number
  views: number
  level: number
  time: string
  mediaUrls: string[]
  transactionHash: string
  verified: boolean
  userVote?: "up" | "down" | null
}

interface Comment {
  id: number
  postId: number
  author: string
  wallet?: string
  avatar: string
  content: string
  time: string
  votes: number
  userVote: "up" | "down" | null
}

// Helper to convert File to base64 Data URL
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Hardcoded sample posts
const HARDCODED_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Welcome to DevSpace! 🚀",
    content: "This is your first post on the blockchain-powered DevSpace blog. You can create, comment, and vote!",
    author: "Alice",
    avatar: "/placeholder-user.jpg",
    tags: ["welcome", "blockchain"],
    likes: 5,
    comments: 2,
    views: 42,
    level: 3,
    time: "2 hours ago",
    mediaUrls: ["https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"],
    transactionHash: "0x12345678",
    verified: true,
    userVote: null
  },
  {
    id: 2,
    title: "Show us your pets! 🐱🐶",
    content: "Share a photo of your pet and tell us their name!",
    author: "Bob",
    avatar: "/placeholder.svg",
    tags: ["pets", "fun"],
    likes: 2,
    comments: 1,
    views: 18,
    level: 2,
    time: "1 hour ago",
    mediaUrls: ["https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80"],
    transactionHash: "0xabcdef12",
    verified: false,
    userVote: null
  }
];
// Hardcoded comments for the sample posts
const HARDCODED_COMMENTS: Comment[] = [
  {
    id: 101,
    postId: 1,
    author: "Charlie",
    avatar: "/placeholder-user.jpg",
    content: "Awesome! Excited to be here.",
    time: "1 hour ago",
    votes: 2,
    userVote: null
  },
  {
    id: 102,
    postId: 1,
    author: "Dana",
    avatar: "/placeholder.svg",
    content: "How do I get started?",
    time: "45 minutes ago",
    votes: 1,
    userVote: null
  },
  {
    id: 103,
    postId: 2,
    author: "Eve",
    avatar: "/placeholder-user.jpg",
    content: "Here's my cat Luna! 🐱",
    time: "30 minutes ago",
    votes: 3,
    userVote: null
  }
];

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    let userPosts: BlogPost[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('devspace_blogs');
      if (stored) {
        userPosts = JSON.parse(stored).map((post: any) => ({
          ...post,
          mediaUrls: post.mediaUrls || [],
          tags: post.tags || [],
          userVote: post.userVote || null,
          likes: post.likes || 0,
          comments: post.comments || 0,
          views: post.views || 0,
          level: post.level || 1,
          verified: post.verified || false,
          transactionHash: post.transactionHash || "",
          time: post.time || "Unknown",
          avatar: post.avatar || "/placeholder.svg"
        }));
      }
    }
    // Merge hardcoded and user posts, hardcoded first, no duplicates by id
    const allPosts = [...HARDCODED_POSTS, ...userPosts.filter(up => !HARDCODED_POSTS.some(hp => hp.id === up.id))];
    return allPosts;
  })
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newTags, setNewTags] = useState("")
  const [newMedia, setNewMedia] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)
  const [comments, setComments] = useState<Comment[]>(() => {
    let userComments: Comment[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('devspace_comments');
      if (stored) {
        userComments = JSON.parse(stored).map((c: any) => ({
          ...c,
          votes: typeof c.votes === 'number' ? c.votes : 0,
          userVote: c.userVote || null,
        }));
      }
    }
    // Merge hardcoded and user comments, hardcoded first, no duplicates by id
    const allComments = [...HARDCODED_COMMENTS, ...userComments.filter(uc => !HARDCODED_COMMENTS.some(hc => hc.id === uc.id))];
    return allComments;
  });
  const [newComment, setNewComment] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Using blockchain audit trail
  const { createAuditTrail, loading: auditLoading } = useAuditTrail()

  // Get user info from localStorage at the top of BlogsPage
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('devspace_user') : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || "Current User";
  const userWallet = user?.wallet || "";

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devspace_blogs', JSON.stringify(posts));
    }
  }, [posts]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devspace_comments', JSON.stringify(comments));
    }
  }, [comments]);

  // Generate star positions only once
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
    }));
  }, []);

  // Update previews when newMedia changes
  useEffect(() => {
    if (newMedia.length === 0) {
      setMediaPreviews([]);
      return;
    }
    Promise.all(newMedia.map(fileToDataUrl)).then(setMediaPreviews);
  }, [newMedia]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewMedia(Array.from(e.target.files))
    }
  }

  const handleVote = (postId: number, voteType: "up" | "down") => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const currentVote = post.userVote || null
        let newLikes = post.likes
          let newUserVote: "up" | "down" | null = voteType

          if (currentVote === voteType) {
          // Remove vote
            newUserVote = null
          newLikes += voteType === "up" ? -1 : 1
          } else if (currentVote === null) {
          // Add new vote
          newLikes += voteType === "up" ? 1 : -1
          } else {
          // Change vote
          newLikes += voteType === "up" ? 2 : -2
          }

        return { ...post, likes: newLikes, userVote: newUserVote }
        }
      return post
    }))
  }

  const handlePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please enter a title and content")
      return
    }

    // Convert all uploaded files to base64 Data URLs for persistence
    let mediaUrls: string[] = [];
    if (newMedia.length > 0) {
      mediaUrls = await Promise.all(newMedia.map(fileToDataUrl));
    }

    let transactionHash = ""
    let verified = false

    try {
      // Create audit trail for the blog post using MasChain API
      const auditData = {
        wallet_address: "0x8C5Ffa3042c01d261fD7350c6221B39BB2D10894", // Provided wallet address
        contract_address: "0xa83E586CA2B20eE821820Bc8ea7B4945709Bd780", // Provided smart contract address
        metadata: {
          title: newTitle,
          content: newContent,
          type: "blog",
          tags: newTags.split(",").map(tag => tag.trim()).filter(tag => tag),
          author: "Current User",
          timestamp: new Date().toISOString(),
        },
        callback_url: `${window.location.origin}/api/audit-callback`,
        category_id: [1], // Blog category
        tag_id: [],
      }

      const auditResult = await createAuditTrail(auditData)

      if (auditResult && auditResult.result && auditResult.result.transactionHash) {
        transactionHash = auditResult.result.transactionHash
        verified = true
        toast.success("Post created successfully! Audit trail has been recorded.")
      } else {
        // Fallback to mock if audit fails
        transactionHash = "0x" + Math.random().toString(16).substring(2, 10)
        verified = false
        toast.warning("Audit trail failed, posting without verification")
      }

    } catch (error) {
      console.error("Audit error:", error)
      // Fallback to mock if audit fails
      transactionHash = "0x" + Math.random().toString(16).substring(2, 10)
      verified = false
      toast.error("Audit trail failed, posting without verification")
  }

    const newPost: BlogPost = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      author: userName,
      wallet: userWallet,
      avatar: "/placeholder.svg",
      tags: newTags.split(",").map(t => t.trim()).filter(t => t),
      likes: 0,
      comments: 0,
      views: 0,
      level: 1,
      time: "Just now",
      mediaUrls,
      transactionHash,
      verified,
      userVote: null
    }

    setPosts([newPost, ...posts])
    setNewTitle("")
    setNewContent("")
    setNewTags("")
    setNewMedia([])
    setMediaPreviews([])
  }

  // Add comment handler
  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      postId,
      author: userName,
      wallet: userWallet,
      avatar: "/placeholder.svg",
      content: newComment,
      time: "Just now",
      votes: 0,
      userVote: null,
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  // Voting for comments
  const handleCommentVote = (commentId: number, voteType: "up" | "down") => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const currentVote = comment.userVote;
        let newVotes = comment.votes;
        let newUserVote: "up" | "down" | null = voteType;
        if (currentVote === voteType) {
          // Remove vote
          newUserVote = null;
          newVotes += voteType === "up" ? -1 : 1;
        } else if (currentVote === null) {
          // Add new vote
          newVotes += voteType === "up" ? 1 : -1;
        } else {
          // Change vote
          newVotes += voteType === "up" ? 2 : -2;
        }
        return { ...comment, votes: newVotes, userVote: newUserVote };
      }
      return comment;
    }));
  };

  // Get comments for a post
  const getCommentsForPost = (postId: number) => comments.filter(c => c.postId === postId);

  // Clear all localStorage and reset state
  const handleClearAll = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devspace_blogs');
      localStorage.removeItem('devspace_comments');
    }
    setPosts([]);
    setComments([]);
  };

  return (
    <div className="min-h-screen space-bg relative">
      {/* Floating Create Post Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 z-30 bg-gradient-to-r from-orange-400 to-orange-500 text-black rounded-full p-4 shadow-lg hover:scale-110 transition-transform flex items-center gap-2"
        title="Create a new post"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden md:inline font-bold">Create Post</span>
      </button>
      {/* Modal Backdrop */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 transition-all" onClick={() => setShowCreateModal(false)} />
      )}
      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg bg-black/80 backdrop-blur-lg rounded-xl p-8 border border-gray-700 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              title="Close"
                  >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">Create a New Post</h2>
            {/* Create Post Form */}
                    <Input
              placeholder="Title"
              value={newTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
              className="mb-3 bg-gray-800/50 border-gray-600 text-white"
                    />
                    <Textarea
              placeholder="What's on your mind?"
              value={newContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewContent(e.target.value)}
              className="mb-3 bg-gray-800/50 border-gray-600 text-white"
                    />
                    <Input
                      placeholder="Tags (comma separated)"
              value={newTags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTags(e.target.value)}
              className="mb-3 bg-gray-800/50 border-gray-600 text-white"
                    />
            <label className="flex items-center gap-2 text-sm cursor-pointer mb-3 text-gray-300">
              <Upload className="w-4 h-4" /> Add photo or video
              <input type="file" multiple hidden onChange={handleMediaUpload} />
            </label>
            <div className="flex gap-2 flex-wrap mb-3">
              {mediaPreviews.map((url: string, idx: number) => (
                <div key={idx} className="relative">
                  <img src={url} alt="preview" className="w-24 h-24 object-cover rounded" />
                  <button
                        onClick={() => {
                      setNewMedia(newMedia.filter((_, i) => i !== idx));
                      setMediaPreviews(mediaPreviews.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 p-1 rounded-full"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                    </div>
              ))}
            </div>
                <Button
              onClick={async () => {
                await handlePost();
                setShowCreateModal(false);
              }} 
              disabled={auditLoading}
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-black w-full hover:from-orange-500 hover:to-orange-600"
                >
              <Plus className="w-4 h-4 mr-1" /> 
              {auditLoading ? "Creating..." : "Post"}
                </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Clear All Button */}
      <button
        onClick={handleClearAll}
        className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2 py-1 text-xs rounded bg-black/40 hover:bg-red-600/80 text-gray-300 hover:text-white transition"
        title="Clear all posts and comments"
      >
        <Trash2 className="w-4 h-4" /> Clear All
      </button>
      {/* Animated Stars Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] to-[#111827]"></div>
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
              </div>

      <div className="relative z-10 p-4 md:px-12 lg:px-24 xl:px-48 w-full">
        <h1 className="text-3xl font-bold mb-2 text-white">🚀 DevSpace Community</h1>
        <p className="text-gray-400 mb-6">Share knowledge seamlessly with your peers</p>

        {/* Post Feed */}
        <div className="space-y-6">
          {posts.map((post: BlogPost) => (
            <div key={post.id} className="relative">
              {/* Blur background that appears on hover */}
              <div 
                className={`absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none ${
                  hoveredPost === post.id ? 'blur-sm bg-black/20' : ''
                }`}
                style={{ zIndex: -1 }}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-lg cursor-pointer transition-all duration-300 group shadow-none border-none hover:border hover:border-orange-400 hover:shadow-lg transform-gpu hover:scale-300 transition-transform duration-200 relative z-10"
                onClick={() => setSelectedPost(post)}
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <div className="flex items-center gap-3 mb-2">
                    <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="font-semibold text-white">
                      {post.author}{" "}
                      <span className="text-xs text-gray-400">Lv.{post.level} • {post.time}</span>
                    </p>
                    {post.verified && (
                      <a
                        href={`https://explorer-testnet.maschain.com/${post.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Shield className="w-3 h-3" /> Verified <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                      </div>
                    </div>
                <h2 className="font-bold text-lg mb-1 text-white">{post.title}</h2>
                <p className="text-gray-300 mb-3 whitespace-pre-wrap break-words">{post.content}</p>
                {/* Images with scrollable container if too long */}
                {(post.mediaUrls || []).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                    {(post.mediaUrls || []).map((url: string, idx: number) => (
                      <img key={idx} src={url} alt="media" className="rounded w-full object-cover" />
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(post.tags || []).map((tag: string, idx: number) => (
                      <Badge key={idx} className="bg-gray-700 text-gray-300">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    {/* Voting Section */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVote(post.id, "up")
                        }}
                        className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                          post.userVote === "up" ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className={`font-medium ${
                        post.likes > 0 ? "text-green-500" : post.likes < 0 ? "text-red-500" : "text-gray-400"
                      }`}>
                        {post.likes}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVote(post.id, "down")
                        }}
                        className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                          post.userVote === "down" ? "text-red-500" : "text-gray-400"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" /> {post.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {post.views}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Post Details Drawer */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 w-full md:w-1/2 lg:w-1/3 h-full p-6 overflow-y-auto z-50 shadow-xl border-l border-gray-700 bg-black/40 backdrop-blur-lg"
            >
              <Button variant="ghost" onClick={() => setSelectedPost(null)} className="mb-4 text-gray-400">
                Close
              </Button>
              <h2 className="text-2xl font-bold mb-3 text-white">{selectedPost.title}</h2>
              <p className="text-gray-300 mb-4 whitespace-pre-wrap break-words">{selectedPost.content}</p>
              {(selectedPost.mediaUrls || []).length > 0 && (
                <div className="flex flex-col items-center gap-4 mb-6">
                  {(selectedPost.mediaUrls || []).map((url: string, idx: number) => (
                    <img
                      key={idx}
                      src={url}
                      alt="media"
                      className="rounded-xl max-w-full w-[420px] md:w-[520px] lg:w-[600px] max-h-[400px] object-contain bg-black"
                      style={{ boxShadow: "0 4px 32px 0 rgba(0,0,0,0.3)" }}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {(selectedPost.tags || []).map((tag: string, idx: number) => (
                  <Badge key={idx} className="bg-gray-700 text-gray-300">{tag}</Badge>
                ))}
              </div>
              <div className="flex gap-4 text-gray-400 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" /> {selectedPost.likes}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" /> {selectedPost.comments}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {selectedPost.views}
                </div>
              </div>
              {/* Comment Section */}
              <div className="mt-8 border-t border-gray-700 pt-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="w-5 h-5 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">Comments ({getCommentsForPost(selectedPost.id).length})</h3>
                </div>

                {/* Add Comment Form */}
                <div className="mb-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white mb-3 resize-none min-h-[80px] focus:border-orange-400/50 focus:ring-orange-400/20"
                    />
                      <div className="flex justify-end">
                    <Button 
                      size="sm" 
                          className="bg-gradient-to-r from-orange-400 to-orange-500 text-black hover:from-orange-500 hover:to-orange-600 px-6" 
                      onClick={() => handleAddComment(selectedPost.id)}
                    >
                          <MessageCircle className="w-4 h-4 mr-2" />
                      Comment
                    </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {getCommentsForPost(selectedPost.id).length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-lg">No comments yet</p>
                      <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    getCommentsForPost(selectedPost.id).map(comment => (
                      <motion.div 
                        key={comment.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative"
                      >
                        <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200 backdrop-blur-sm">
                          <div className="flex items-start gap-4">
                          {/* Voting Section */}
                            <div className="flex flex-col items-center gap-1 pt-1">
                            <button
                                onClick={() => handleCommentVote(comment.id, "up")}
                                className={`p-1 rounded-full hover:bg-gray-700/50 transition-all duration-200 ${
                                  comment.userVote === "up" 
                                    ? "text-green-400 bg-green-400/10" 
                                    : "text-gray-400 hover:text-green-400"
                                }`}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                              <span className={`text-sm font-semibold px-1 min-w-[20px] text-center ${
                                comment.votes > 0 
                                  ? "text-green-400" 
                                  : comment.votes < 0 
                                    ? "text-red-400" 
                                    : "text-gray-400"
                              }`}>
                              {comment.votes}
                            </span>
                            <button
                                onClick={() => handleCommentVote(comment.id, "down")}
                                className={`p-1 rounded-full hover:bg-gray-700/50 transition-all duration-200 ${
                                  comment.userVote === "down" 
                                    ? "text-red-400 bg-red-400/10" 
                                    : "text-gray-400 hover:text-red-400"
                                }`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Comment Content */}
                            <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar className="w-8 h-8">
                                  <AvatarImage src={comment.avatar} />
                                  <AvatarFallback className="text-xs">{comment.author[0]}</AvatarFallback>
                              </Avatar>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-white">{comment.author}</span>
                                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                  <span className="text-xs text-gray-400">{comment.time}</span>
                                </div>
                              </div>
                              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {comment.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  )
}
