"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Upload, CheckCircle, Clock, XCircle, Award, FileText, ExternalLink, Plus, Zap } from "lucide-react"
import {useCertificates} from "@/hooks/useCertificates";


interface Certification {
  id: number
  title: string
  description: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  category: string
  skills: string[]
  proofUrl?: string
  certificateHash?: string
}


const mockCertifications: Certification[] = [
  {
    id: 1,
    title: "React Advanced Patterns Mastery",
    description:
      "Demonstrated advanced knowledge of React patterns including render props, compound components, and custom hooks.",
    status: "approved",
    submittedAt: "2024-01-15",
    reviewedAt: "2024-01-18",
    category: "Frontend Development",
    skills: ["React", "JavaScript", "TypeScript"],
    proofUrl: "https://github.com/user/react-patterns-demo",
    certificateHash: "0x1234...abcd",
  },
  
  {
    id: 3,
    title: "Full-Stack Application Architecture",
    description: "Built and deployed a scalable full-stack application with microservices architecture.",
    status: "rejected",
    submittedAt: "2024-01-10",
    reviewedAt: "2024-01-12",
    category: "Full-Stack Development",
    skills: ["Node.js", "React", "Docker", "AWS"],
  },
  
]

export default function OnChainPage() {
  const [file, setFile] = useState<File | null>(null);
  
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skills: "",
    proofUrl: "",
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!file) {
    alert("Please upload a certificate file.");
    return;
  }

  const data = new FormData();
  data.append("title", formData.title);
  data.append("description", formData.description);
  data.append("category", formData.category);
  data.append("skills", formData.skills);
  data.append("proofUrl", formData.proofUrl);
  data.append("file", file);

  try {
    const response = await fetch("/api/onchain/mint-cert", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    console.log("✅ Mint result:", result);

    alert("Certificate minted on-chain successfully!");

// Immediately add to localCerts for instant display
setLocalCerts(prev => [
  {
    id: result.result.result.nft_token_id ?? Date.now(),
    title: formData.title,
    description: formData.description,
    status: "pending",
    submittedAt: new Date().toISOString(),
    category: formData.category,
    skills: formData.skills.split(',').map(s => s.trim()),
    proofUrl: formData.proofUrl ?? result.result.result.certificate_image,
    certificateHash: result.result.result.transactionHash,
  },
  ...prev
]);

// Reset form
setShowSubmitForm(false);
setFormData({
  title: "",
  description: "",
  category: "",
  skills: "",
  proofUrl: "",
});
setFile(null);
  } catch (error) {
    console.error("❌ Mint error:", error);
    alert("Error minting certificate. Check console for details.");
  }
};

  const [localCerts, setLocalCerts] = useState<Certification[]>([]);

  const wallet_address = "0x84f18Ed49Ecb64080e40e9b036c59034b85FC39c";
  const contract_address = "0x01E9de0DeF4Ba278202bF4bAD0103215b8027734";

  const { certifications, loading ,refetch} = useCertificates(wallet_address, contract_address);

// Combine all sources
const allCerts = [...localCerts, ...certifications, ...mockCertifications];

// Count by status
const approvedCerts = allCerts.filter(cert => cert.status === "approved");
const pendingCerts = allCerts.filter(cert => cert.status === "pending");
const rejectedCerts = allCerts.filter(cert => cert.status === "rejected");




  return (
    <div className="min-h-screen w-full space-bg">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-full">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg gradient-orange flex items-center justify-center">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">🛡️ On-Chain Certifications</h1>
                  <p className="text-gray-400">Verify your skills and earn blockchain-backed credentials</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="space-card">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{approvedCerts.length}</div>
                  <div className="text-sm text-gray-400">Approved</div>
                </CardContent>
              </Card>
              <Card className="space-card">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{pendingCerts.length}</div>
                  <div className="text-sm text-gray-400">Pending Review</div>
                </CardContent>
              </Card>
              <Card className="space-card">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">850</div>
                  <div className="text-sm text-gray-400">Skill Points</div>
                </CardContent>
              </Card>
              <Card className="space-card">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-sm text-gray-400">Skill Categories</div>
                </CardContent>
              </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-6">
              {/* Left Column - Submit Form & Certifications */}
              <div className="space-y-6">
                {/* Submit New Certification */}
                <Card className="space-card">
                  <CardContent className="p-6">
                    {!showSubmitForm ? (
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Submit New Certification</h3>
                        <p className="text-gray-400 mb-4">
                          Showcase your skills and get them verified on the blockchain
                        </p>
                        <Button
                          onClick={() => setShowSubmitForm(true)}
                          className="gradient-orange text-black font-medium hover:glow-orange"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Submit Certification
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column of Form */}
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="title" className="text-white">
                                Certification Title
                              </Label>
                              <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., React Advanced Patterns"
                                className="bg-gray-800/50 border-gray-600 text-white"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="category" className="text-white">
                                Category
                              </Label>
                              <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="frontend">Frontend Development</SelectItem>
                                  <SelectItem value="backend">Backend Development</SelectItem>
                                  <SelectItem value="fullstack">Full-Stack Development</SelectItem>
                                  <SelectItem value="blockchain">Blockchain Development</SelectItem>
                                  <SelectItem value="security">Security & Auditing</SelectItem>
                                  <SelectItem value="devops">DevOps & Infrastructure</SelectItem>
                                  <SelectItem value="ml">Machine Learning</SelectItem>
                                  <SelectItem value="mobile">Mobile Development</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="skills" className="text-white">
                                Skills (comma-separated)
                              </Label>
                              <Input
                                id="skills"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                placeholder="React, TypeScript, Node.js"
                                className="bg-gray-800/50 border-gray-600 text-white"
                                required
                              />
                            </div>
                          </div>

                          {/* Right Column of Form */}
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="description" className="text-white">
                                Description
                              </Label>
                              <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what you accomplished and the skills demonstrated..."
                                className="bg-gray-800/50 border-gray-600 text-white h-24"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="proofUrl" className="text-white">
                                Proof URL
                              </Label>
                              <Input
                                id="proofUrl"
                                value={formData.proofUrl}
                                onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
                                placeholder="https://github.com/your-repo"
                                className="bg-gray-800/50 border-gray-600 text-white"
                                required
                              />
                            </div>
                            <div>
                                <Label htmlFor="file" className="text-white">
                                 Certificate File
                                </Label>
                                <Input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  id="file"
                                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                                  className="bg-gray-800/50 border-gray-600 text-white"
                                  required
                                    />
                                </div>

                            <div className="pt-6">
                              <div className="flex gap-2">
                                <Button type="submit" className="gradient-orange text-black flex-1">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Submit for Review
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => setShowSubmitForm(false)}
                                  className="text-gray-400"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>

                {/* Certifications List */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Your Certifications</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...localCerts,...mockCertifications, ...certifications].map((cert) => (

                      <Card key={cert.id} className="space-card">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(cert.status)}
                                <CardTitle className="text-xl text-white">{cert.title}</CardTitle>
                                <Badge className={getStatusColor(cert.status)}>{cert.status}</Badge>
                              </div>
                              <p className="text-gray-300 mb-4">{cert.description}</p>
                              <div className="flex gap-2 mb-4">
                                <Badge variant="outline" className="text-orange-500 border-orange-500">
                                  {cert.category}
                                </Badge>
                                {cert.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="bg-gray-800/50 text-gray-300">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {cert.status === "approved" && (
                              <div className="text-right">
                                <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                                <p className="text-sm text-orange-500 font-medium">✅ Verified</p>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm text-gray-400">
                              <div>
                                <span className="text-gray-500">Submitted:</span> {cert.submittedAt}
                              </div>
                              {cert.reviewedAt && (
                                <div>
                                  <span className="text-gray-500">Reviewed:</span> {cert.reviewedAt}
                                </div>
                              )}
                              {cert.certificateHash && (
                                <div className="flex items-center gap-1">
                                  <Shield className="w-4 h-4 text-green-500" />
                                  <span className="text-green-500">⛓️ On-Chain</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                                {cert.proofUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gray-800/50 border-gray-600 text-gray-300"
                                    onClick={() => window.open(cert.proofUrl, "_blank")}
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View Proof
                                  </Button>
                                  )}
                                  {cert.certificateHash && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-orange-500/20 border-orange-500 text-orange-500"
                                      onClick={() =>
                                        window.open(
                                          `https://explorer-testnet.maschain.com/${cert.certificateHash}`,
                                          "_blank"
                                        )
                                        
                                      }
                                      >
                                        <FileText className="w-4 h-4 mr-2" />
                                        View Certificate
                                      </Button>
                                    )}
                                  </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
