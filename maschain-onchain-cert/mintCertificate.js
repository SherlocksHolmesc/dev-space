import axios from "axios";
import FormData from "form-data";
import fs from "fs";

async function mintCertificate() {
  try {
    const form = new FormData();

    form.append("wallet_address", "0x84f18Ed49Ecb64080e40e9b036c59034b85FC39c"); // your wallet (owner)
    form.append("to", "0x84f18Ed49Ecb64080e40e9b036c59034b85FC39c"); // recipient wallet for testing
    form.append(
      "contract_address",
      "0x01E9de0DeF4Ba278202bF4bAD0103215b8027734"
    );
    form.append("file", fs.createReadStream("./certificate.pdf")); // replace with your certificate file
    form.append("name", "React Advanced Patterns Certificate");
    form.append(
      "description",
      "Awarded for demonstrating mastery in React advanced patterns."
    );
    form.append("callback_url", "https://yourdomain.com/callback"); // optional

    const response = await axios.post(
      "https://service-testnet.maschain.com/api/certificate/mint-certificate",
      form,
      {
        headers: {
          client_id:
            "61d1b49a0783e416928475421cecdc0c2a35c1dc6784f2fab3a72e0a1c74fb15",
          client_secret:
            "sk_60432f5dde09ccb0be630780bfb85be46271df2160c03d035bad25924c568ea0",
          ...form.getHeaders(),
        },
      }
    );

    console.log(
      "✅ Mint Certificate Response:",
      JSON.stringify(response.data, null, 2)
    );
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

mintCertificate();
