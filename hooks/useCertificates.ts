"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Certification {
  id: number;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  category: string;
  skills: string[];
  proofUrl?: string;
  certificateHash?: string;
}

export function useCertificates(walletAddress: string, contractAddress: string) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/get-certificates", {
        params: { walletAddress, contractAddress },
      });
      setCertifications(res.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress && contractAddress) {
      fetchCertificates();
    }
  }, [walletAddress, contractAddress]);

  return { certifications, loading, refetch: fetchCertificates };
}
