//bounties/page.tsx
"use client"

import React, { useState, useEffect } from "react"
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
  Trash,
} from "lucide-react"
import { toast } from 'sonner';

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
  claimed?: boolean
  claimTxHash?: string
}

const initialBounties: Bounty[] = [
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
    claimed: false,
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
    claimed: false,
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
    claimed: false,
  },
]

export default function BountiesPage() {
  const [selectedHistory, setSelectedHistory] = useState<BountyHistory | null>(null)
  const [showHistoryDetails, setShowHistoryDetails] = useState(false)
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null)
  const [showBountyDetails, setShowBountyDetails] = useState(false)
  const [showCreateBounty, setShowCreateBounty] = useState(false)
  const [newBounty, setNewBounty] = useState({ title: '', description: '', reward: '', difficulty: '', tags: '' })
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [userJourney, setUserJourney] = useState<BountyHistory[]>(mockHistory)
  const [walletAddress, setWalletAddress] = useState<string | null>(null);


  // Load bounties and journey from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userBounties')
    let userBounties: Bounty[] = []
    if (stored) {
      try {
        userBounties = JSON.parse(stored)
      } catch {}
    }
    setBounties([...userBounties, ...initialBounties])
    

    // Load user journey from localStorage
    const storedJourney = localStorage.getItem('userJourney')
    if (storedJourney) {
      try {
        const parsedJourney = JSON.parse(storedJourney)
        // Merge stored journey with mock history, preserving claimed status
        const mergedJourney = mockHistory.map(mockItem => {
          const storedItem = parsedJourney.find((item: BountyHistory) => 
            item.title === mockItem.title && item.description === mockItem.description
          )
          return storedItem ? { ...mockItem, ...storedItem } : mockItem
        })
        setUserJourney([...parsedJourney.filter((item: BountyHistory) => 
          !mockHistory.some(mock => mock.title === item.title && mock.description === item.description)
        ), ...mergedJourney])
      } catch {}
    }
  }, [])

  useEffect(() => {
    const getUserInfo = () => {
      try {
        const isLoggedIn = localStorage.getItem('is_logged_in');
        if (isLoggedIn === 'true') {
          const userData = localStorage.getItem('devspace_user');
          if (userData) {
            const user = JSON.parse(userData);
            setWalletAddress(user.wallet);
            return;
          }
        }
        setWalletAddress(null);
      } catch (error) {
        console.error('Error retrieving user info:', error);
        setWalletAddress(null);
      }
    };
    getUserInfo();
  }, []);
  

  // Save user-created bounties to localStorage whenever bounties change (only user bounties)
  useEffect(() => {
    // Only save bounties that are not in initialBounties (assume initialBounties have unique titles)
    const userBounties = bounties.filter(b => !initialBounties.some(mb => mb.title === b.title && mb.description === b.description))
    localStorage.setItem('userBounties', JSON.stringify(userBounties))
  }, [bounties])

  // Save user journey to localStorage whenever journey changes
  useEffect(() => {
    // Only save user-accepted bounties (not the mock ones)
    const userAcceptedBounties = userJourney.filter(j => !mockHistory.some(mh => mh.title === j.title && mh.description === j.description))
    localStorage.setItem('userJourney', JSON.stringify(userAcceptedBounties))
  }, [userJourney])

  // Test toast function to verify toast system is working
  const testToast = () => {
    console.log("Testing toast...");
    toast.success("🎉 Test success toast!");
    toast.error("❌ Test error toast!");
    toast.loading("⏳ Test loading toast...");
  };

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
    setShowBountyDetails(false)
    setSelectedBounty(null)
  }

  const handleBackToBounties = () => {
    setShowHistoryDetails(false)
    setSelectedHistory(null)
    setShowBountyDetails(false)
    setSelectedBounty(null)
  }

  const handleBountyClick = (bounty: Bounty) => {
    setSelectedBounty(bounty)
    setShowBountyDetails(true)
    setShowHistoryDetails(false)
    setSelectedHistory(null)
  }

  const handleAcceptChallenge = (bounty: Bounty) => {
    // Check if already accepted
    const alreadyAccepted = userJourney.some(j => j.title === bounty.title)
    if (alreadyAccepted) {
      toast.error("You have already accepted this challenge!")
      return
    }

    // Create new journey item
    const newJourneyItem: BountyHistory = {
      id: Date.now(),
      title: bounty.title,
      status: "in-progress",
      reward: bounty.reward,
      progress: 0,
      description: bounty.description,
      tags: bounty.tags,
      submissionUrl: undefined,
      feedback: undefined,
      claimed: false,
    }

    // Add to journey
    setUserJourney([newJourneyItem, ...userJourney])
    
    // Show success message
    toast.success(`✅ Challenge accepted! "${bounty.title}" added to your journey.`)
    
    // Close bounty details if open
    setShowBountyDetails(false)
    setSelectedBounty(null)
  }

  const handleSubmitToReview = (historyItem: BountyHistory) => {
    // Update the journey item to completed status
    const updatedJourney = userJourney.map(item => 
      item.id === historyItem.id 
        ? {
            ...item,
            status: "completed" as const,
            progress: 100,
            completedAt: "Just now",
            submissionUrl: "https://github.com/user/submission",
            feedback: "Submission received! Review in progress..."
          }
        : item
    )
    
    setUserJourney(updatedJourney)
    
    // Update the selected history item for immediate UI update
    setSelectedHistory({
      ...historyItem,
      status: "completed",
      progress: 100,
      completedAt: "Just now",
      submissionUrl: "https://github.com/user/submission",
      feedback: "Submission received! Review in progress..."
    })
    
    toast.success(`✅ Submission submitted for review! "${historyItem.title}" marked as completed.`)
  }

  const handleClaimPrize = async (historyItem: BountyHistory) => {
    try {
        // Check if prize has already been claimed
        if (historyItem.claimed) {
            toast.error("❌ Prize has already been claimed!");
            return;
        }

        const storedUser = localStorage.getItem('devspace_user');
        if (!storedUser) {
            toast.error("❌ Please log in to claim your prize.");
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        const recipient = parsedUser.wallet;
        const contract = "0x4579c765c30121B253C452B0543203B617152Ae2"; // your MAS token contract

        const prizeAmount = Math.floor(historyItem.reward * 0.5);
        const loadingToastId = toast.loading(`⏳ Claiming your ${prizeAmount} MAS prize...`);

        console.log("Claiming prize with:", { recipient, amount: prizeAmount, contract });

        const res = await fetch('/api/claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipient,
                amount: prizeAmount,
                contract
            })
        });

        const data = await res.json();
        console.log("Claim API response:", data);

        if (!res.ok || !data.success) {
            console.error("Claim failed:", data);
            toast.dismiss(loadingToastId);
            toast.error(`❌ Claim failed: ${data.error || 'Transaction failed'}`);
            return;
        }

        const explorerUrl = `https://explorer-testnet.maschain.com/${data.txHash}`;
        console.log("Claim successful, showing success toast");

        toast.dismiss(loadingToastId);
        toast.success(
            <span>
                🎉 Prize claimed successfully!{" "}
                <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-300">
                    View Transaction
                </a>
            </span>,
            { duration: 8000 }
        );

        // Update user journey feedback to reflect claimed prize and mark as claimed
        const updatedJourney = userJourney.map(item =>
            item.id === historyItem.id
                ? { ...item, feedback: `Prize claimed successfully! 🎉 TX: ${data.txHash}`, claimed: true, claimTxHash: data.txHash }
                : item
        );
        setUserJourney(updatedJourney);
        setSelectedHistory(prev => prev ? { ...prev, feedback: `Prize claimed successfully! 🎉 TX: ${data.txHash}`, claimed: true, claimTxHash: data.txHash } : prev);

    } catch (error) {
        console.error('Claim prize error:', error);
        toast.error("❌ Failed to claim prize. Please try again.");
    }
};



const handleCreateBounty = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
      const storedUser = localStorage.getItem('devspace_user');
      if (!storedUser) {
          toast.error("❌ Please log in to create a bounty.");
          return;
      }

      const parsedUser = JSON.parse(storedUser);
      const sender = parsedUser.wallet;
      const recipient = "0x5E9C287CA011343B9CC8F30A30527bF6fede918b"; // escrow wallet
      const contract = "0x4579c765c30121B253C452B0543203B617152Ae2";
      const amount = parseInt(newBounty.reward.trim(), 10);

      if (!newBounty.title || !newBounty.description || !newBounty.difficulty || isNaN(amount) || amount <= 0) {
          toast.error("❌ Please fill in all fields correctly with a valid reward amount.");
          return;
      }
      if (!sender) {
          toast.error("❌ Wallet not found, please log in again.");
          return;
      }

      console.log("Creating bounty with:", {
          sender,
          recipient,
          amount,
          contract
      });

      const loadingToast = toast.loading("⏳ Transferring tokens and creating bounty...");

      const res = await fetch('/api/mint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              sender,
              recipient,
              amount,
              contract
          })
      });

      const data = await res.json();
      console.log("Mint/Transfer API response:", data);

      if (!res.ok || !data.txHash) {
          console.error("Bounty creation failed:", data);
          toast.dismiss(loadingToast);
          throw new Error(data.error || "Failed to create bounty on-chain. No transaction hash received.");
      }

      // Add to local bounties
      const newBountyObject: Bounty = {
          id: Date.now(),
          title: newBounty.title,
          description: newBounty.description,
          reward: amount,
          currency: "MAS",
          difficulty: newBounty.difficulty as "Easy" | "Medium" | "Hard" | "Expert",
          timeLeft: "14 days left",
          participants: 0,
          maxParticipants: 10,
          tags: newBounty.tags ? newBounty.tags.split(",").map(tag => tag.trim()) : [],
          sponsor: parsedUser.name || "Anonymous",
          sponsorAvatar: "/placeholder.svg"
      };

      setBounties([newBountyObject, ...bounties]);
      setNewBounty({ title: '', description: '', reward: '', difficulty: '', tags: '' });
      setShowCreateBounty(false);

      toast.dismiss(loadingToast);

      // Create explorer URL with the transaction hash
      const explorerUrl = `https://explorer-testnet.maschain.com/${data.txHash}`;
      console.log("Bounty created successfully, showing success toast");

      // Show success popup with transaction link
      toast.success(
          <span>
              🎉 Bounty created successfully!{" "}
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-300">
                  View Transaction
              </a>
          </span>,
          { duration: 8000 }
      );

  } catch (error: any) {
      console.error("Create Bounty Error:", error);
      toast.error(`❌ Error: ${error.message}`);
  }
};

  // Remove a bounty by id (and update localStorage)
  function handleDeleteBounty(id: number) {
    // Get the bounty details before deletion for the toast message
    const bountyToDelete = bounties.find(b => b.id === id);
    const bountyTitle = bountyToDelete?.title || "Bounty";
    
    const updated = bounties.filter(b => b.id !== id);
    setBounties(updated);
    // Only save user-created bounties
    const userBounties = updated.filter(b => !initialBounties.some(mb => mb.title === b.title && mb.description === b.description));
    localStorage.setItem('userBounties', JSON.stringify(userBounties));
    setShowBountyDetails(false);
    setSelectedBounty(null);
    
    // Show success toast
    toast.success(`🗑️ "${bountyTitle}" has been deleted successfully!`);
  }

  return (
    <div className="min-h-screen space-bg">
      <div className="flex flex-row w-full">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto space-bg bounties-scroll-area">
          <div className="p-6">
            {!showHistoryDetails && !showBountyDetails ? (
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
                      {/* Temporary test button */}
                      <Button 
                        onClick={testToast} 
                        className="mt-2 bg-black text-white hover:bg-gray-800"
                        size="sm"
                      >
                        Test Toast
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Card className="space-card">
                    <CardContent className="p-4 text-center">
                      <Target className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{bounties.length}</div>
                      <div className="text-sm text-gray-400">Active Bounties</div>
                    </CardContent>
                  </Card>
                  <Card className="space-card">
                    <CardContent className="p-4 text-center">
                      <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{userJourney.filter(item => item.status === 'completed').length}</div>
                      <div className="text-sm text-gray-400">Completed</div>
                    </CardContent>
                  </Card>
                  <Card className="space-card">
                    <CardContent className="p-4 text-center">
                      <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{userJourney.filter(item => item.status === 'in-progress').length}</div>
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

                {/* Create Bounty Section styled like OnChain - moved above Available Bounties */}
                <Card className="space-card mt-8 mb-8">
                  <CardContent className="p-6">
                    {!showCreateBounty ? (
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Create New Bounty</h3>
                        <p className="text-gray-400 mb-4">Post a challenge and reward the community for solving it!</p>
                        <Button
                          onClick={() => setShowCreateBounty(true)}
                          className="gradient-orange text-black font-medium hover:glow-orange px-8 py-3 text-lg"
                        >
                          <span className="mr-2 text-xl font-bold">+</span> Create Bounty
                        </Button>
                      </div>
                    ) : (
                      <form className="space-y-4 max-w-xl mx-auto" onSubmit={handleCreateBounty}>
                        <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Title" value={newBounty.title} onChange={e => setNewBounty({ ...newBounty, title: e.target.value })} required />
                        <textarea className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Description" value={newBounty.description} onChange={e => setNewBounty({ ...newBounty, description: e.target.value })} required />
                        <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Reward (MAS)" type="number" min="0" value={newBounty.reward} onChange={e => setNewBounty({ ...newBounty, reward: e.target.value })} required />
                        <select className="w-full p-2 rounded bg-gray-800 text-white" value={newBounty.difficulty} onChange={e => setNewBounty({ ...newBounty, difficulty: e.target.value })} required>
                          <option value="">Select Difficulty</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Tags (comma separated)" value={newBounty.tags} onChange={e => setNewBounty({ ...newBounty, tags: e.target.value })} />
                        <div className="flex gap-2 justify-end">
                          <Button type="button" variant="ghost" className="text-gray-400" onClick={() => setShowCreateBounty(false)}>Cancel</Button>
                          <Button type="submit" className="gradient-orange text-black font-medium hover:glow-orange">Create</Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>

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
                  {bounties.map((bounty) => (
                    <Card key={bounty.id} className="space-card cursor-pointer" onClick={() => handleBountyClick(bounty)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(bounty.difficulty)}>{bounty.difficulty}</Badge>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-green-500 font-bold">
                              <DollarSign className="w-4 h-4" />
                              {bounty.reward} MAS
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
                        <Button 
                          className="w-full gradient-orange text-black font-medium hover:glow-orange"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptChallenge(bounty);
                          }}
                          disabled={userJourney.some(j => j.title === bounty.title)}
                        >
                          {userJourney.some(j => j.title === bounty.title) ? 'Already Accepted' : 'Accept Challenge'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : showHistoryDetails && selectedHistory ? (
              /* History Details View */
              <div className="min-h-full">
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    onClick={handleBackToBounties}
                    className="text-orange-500 hover:text-orange-400"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                  <h1 className="text-3xl font-bold text-white">Challenge Details</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Main Details */}
                  <div className="space-y-6 w-full">
                    {/* Challenge Overview */}
                    <Card className="space-card w-full">
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
                            {/* Submit to Review Button - only show for in-progress challenges */}
                            {selectedHistory.status === "in-progress" && (
                              <div className="mb-6">
                                <Button 
                                  onClick={() => handleSubmitToReview(selectedHistory)}
                                  className="gradient-orange text-black font-medium hover:glow-orange px-8 py-3"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Submit to Review
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-6">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-6 h-6 text-green-500" />
                              <span className="text-3xl font-bold text-green-500">${selectedHistory.reward} MAS</span>
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
                    {/* Top 3 Projects - only show for completed challenges */}
                    {selectedHistory.status === "completed" && (
                      <Card className="space-card">
                        <CardHeader>
                          <CardTitle className="text-orange-500 flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            Top 3 Projects
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* 1st Place - User */}
                          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">1</span>
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">You</h4>
                                  <p className="text-yellow-400 text-sm">🏆 First Place</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-500 font-bold text-lg">{Math.floor(selectedHistory.reward * 0.5)} MAS</div>
                                <div className="text-yellow-400 text-sm">50% of Prize</div>
                              </div>
                            </div>
                            {selectedHistory.claimed ? (
                              <div className="space-y-3">
                                <Button 
                                  disabled
                                  className="w-full bg-gray-600 text-gray-300 cursor-not-allowed"
                                >
                                  <Trophy className="w-4 h-4 mr-2" />
                                  Prize Claimed ✓
                                </Button>
                                {selectedHistory.claimTxHash && (
                                  <div className="text-center">
                                    <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                                    <a 
                                      href={`https://explorer-testnet.maschain.com/${selectedHistory.claimTxHash}`}
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-blue-300 hover:text-blue-200 underline text-xs"
                                    >
                                      {selectedHistory.claimTxHash.substring(0, 10)}...{selectedHistory.claimTxHash.substring(selectedHistory.claimTxHash.length - 8)}
                                    </a>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Button 
                                onClick={() => handleClaimPrize(selectedHistory)}
                                className="w-full gradient-orange text-black font-medium hover:glow-orange"
                              >
                                <Trophy className="w-4 h-4 mr-2" />
                                Claim Your Prize
                              </Button>
                            )}
                          </div>

                          {/* 2nd Place */}
                          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">2</span>
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">Alex Chen</h4>
                                  <p className="text-gray-400 text-sm">Runner Up</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-500 font-bold text-lg">{Math.floor(selectedHistory.reward * 0.3)} MAS</div>
                                <div className="text-gray-400 text-sm">30% of Prize</div>
                              </div>
                            </div>
                          </div>

                          {/* 3rd Place */}
                          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">3</span>
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">Sarah Kim</h4>
                                  <p className="text-gray-400 text-sm">Third Place</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-500 font-bold text-lg">{Math.floor(selectedHistory.reward * 0.2)} MAS</div>
                                <div className="text-gray-400 text-sm">20% of Prize</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

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
                              <span className="text-green-500 text-sm">250 MAS</span>
                            </div>
                          </div>

                          <div className="p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                            <h4 className="text-white font-medium text-sm">React Testing Library</h4>
                            <p className="text-gray-400 text-xs">Write comprehensive tests for React apps</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge className="bg-green-500/20 text-green-400 border-green-500">Easy</Badge>
                              <span className="text-green-500 text-sm">150 MAS</span>
                            </div>
                          </div>

                          <div className="p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                            <h4 className="text-white font-medium text-sm">Full-Stack Todo App</h4>
                            <p className="text-gray-400 text-xs">Add backend API and database</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500">Hard</Badge>
                              <span className="text-green-500 text-sm">400 MAS</span>
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
            ) : showBountyDetails && selectedBounty ? (
              /* Bounty Details View */
              <div className="min-h-full">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      onClick={handleBackToBounties}
                      className="text-orange-500 hover:text-orange-400"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                    <h1 className="text-3xl font-bold text-white">Bounty Details</h1>
                  </div>
                  {/* Show trash icon only for user-created bounties */}
                  {selectedBounty && !initialBounties.some(mb => mb.title === selectedBounty.title && mb.description === selectedBounty.description) && (
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteBounty(selectedBounty.id)}
                      className="text-red-500 hover:text-red-400"
                      title="Delete Bounty"
                    >
                      <Trash className="w-6 h-6" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  <div className="w-full">
                    <Card className="space-card max-w-full mx-auto w-full">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-3xl font-bold text-white leading-tight">{selectedBounty.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={selectedBounty.sponsorAvatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-lg">{selectedBounty.sponsor[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-white font-semibold text-lg">{selectedBounty.sponsor}</span>
                            </div>
                            <p className="text-gray-300 mb-4 text-lg leading-relaxed">{selectedBounty.description}</p>
                            <div className="flex gap-2 mb-4 flex-wrap">
                              {selectedBounty.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-gray-800/50 text-gray-300 text-base px-3 py-1">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 min-w-[200px]">
                            <Badge className={getDifficultyColor(selectedBounty.difficulty)}>{selectedBounty.difficulty}</Badge>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-green-500 text-3xl font-extrabold">$</span>
                              <span className="text-4xl font-extrabold text-green-500">{selectedBounty.reward} MAS</span>
                            </div>
                            <span className="text-gray-400 text-lg">Reward</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-gray-400 text-base">Participants</span>
                            <span className="text-white font-semibold text-xl">{selectedBounty.participants} / {selectedBounty.maxParticipants}</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="text-gray-400 text-base">Time Left</span>
                            <span className="text-white font-semibold text-xl">{selectedBounty.timeLeft}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full gradient-orange text-black font-medium hover:glow-orange"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptChallenge(selectedBounty);
                          }}
                          disabled={userJourney.some(j => j.title === selectedBounty.title)}
                        >
                          {userJourney.some(j => j.title === selectedBounty.title) ? 'Already Accepted' : 'Accept Challenge'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Panel - Bounty History */}
        <div className="w-96 space-bg border-l border-orange-500/20 overflow-y-auto bounties-scroll-area flex-shrink-0">
          <div className="p-6 min-h-full">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-orange-500">Your Journey</h3>
            </div>

            <div className="space-y-4">
              {userJourney.map((item) => (
                <Card key={item.id} className="space-card cursor-pointer" onClick={() => handleHistoryClick(item)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm line-clamp-2">{item.title}</h4>
                      <Badge className={getStatusColor(item.status)} variant="secondary">
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-green-500 font-medium">{item.reward} MAS</span>
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
