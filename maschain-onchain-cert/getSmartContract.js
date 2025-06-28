import axios from 'axios';

async function getSmartContracts() {
  try {
    const response = await axios.get(
      "https://service-testnet.maschain.com/api/certificate/get-smart-contract",
      {
        headers: {
          client_id: "61d1b49a0783e416928475421cecdc0c2a35c1dc6784f2fab3a72e0a1c74fb15",
          client_secret: "sk_60432f5dde09ccb0be630780bfb85be46271df2160c03d035bad25924c568ea0",
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Retrieved Smart Contracts:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

getSmartContracts();
