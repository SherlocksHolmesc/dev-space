import axios from 'axios';

async function createSmartContract() {
  try {
    const response = await axios.post(
      "https://service-testnet.maschain.com/api/certificate/create-smartcontract",
      {
        wallet_address: "0x84f18Ed49Ecb64080e40e9b036c59034b85FC39c",
        name: "OnChainCertApp",
        field: {
          wallet_address_owner: "0x84f18Ed49Ecb64080e40e9b036c59034b85FC39c",
          max_supply: 0,
          name: "OnChainCertification",
          symbol: "CERT"
        }
      },
      {
        headers: {
          client_id: "61d1b49a0783e416928475421cecdc0c2a35c1dc6784f2fab3a72e0a1c74fb15",
          client_secret: "sk_60432f5dde09ccb0be630780bfb85be46271df2160c03d035bad25924c568ea0",
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Smart Contract Created:", response.data);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

createSmartContract();
