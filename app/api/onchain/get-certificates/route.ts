import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");
    const contractAddress = searchParams.get("contractAddress");

    const response = await axios.get(
      "https://service-testnet.maschain.com/api/certificate/get-certificate",
      {
        params: {
          wallet_address: walletAddress,
          contract_address: contractAddress,
        },
        headers: {
          client_id: process.env.MASCHAIN_CLIENT_ID!,
          client_secret: process.env.MASCHAIN_CLIENT_SECRET!,
        },
      }
    );

    const masChainCerts = response.data.data || [];

    const mappedCerts = masChainCerts.map((item: any, idx: number) => ({
      id: item.nft_token_id ?? idx,
      title: `Certificate #${item.nft_token_id ?? idx}`,
      description: item.description ?? `Certificate minted on MasChain.`,
      status: item.status === "success" ? "approved" : "pending",
      submittedAt: new Date(item.created_at ?? Date.now()).toISOString(),
      reviewedAt: undefined,
      category: "Blockchain",
      skills: ["Blockchain"],
      proofUrl: item.certificate_image,
      certificateHash: item.transactionHash ?? "",
    }));

    console.log("✅ Certificates fetched:", mappedCerts.length);
    return NextResponse.json(mappedCerts);
  } catch (error: any) {
    console.error("❌ Fetch certificates error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
