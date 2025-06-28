import axios from "axios";

export async function getCertificates(wallet_address: string, contract_address: string) {
  try {
    const response = await axios.get(
      "https://service-testnet.maschain.com/api/certificate/get-certificate",
      {
        params: {
          from: wallet_address,
          contract_address: contract_address,
          status: "success", // only show successful mints
        },
        headers: {
          client_id: process.env.MASCHAIN_CLIENT_ID!,
          client_secret: process.env.MASCHAIN_CLIENT_SECRET!,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.result;
  } catch (error: any) {
    console.error("❌ Error fetching certificates:", error.response?.data || error.message);
    return [];
  }
}
