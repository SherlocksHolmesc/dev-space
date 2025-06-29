import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const form = new FormData();
    form.append('wallet_address', '0x84f18Ed49Ecb64080e40e9b036c59034b85FC39c');
    form.append('to', '0x84f18Ed49Ecb64080e40e9b036c59034b85FC39c');
    form.append('contract_address', '0x01E9de0DeF4Ba278202bF4bAD0103215b8027734');

    const file = data.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: "File is missing" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Append with filename
    form.append('file', buffer, file.name);

    form.append('name', data.get('title') as string);
    form.append('description', data.get('description') as string);
    form.append('callback_url', 'https://yourdomain.com/callback');

    const response = await axios.post(
      'https://service-testnet.maschain.com/api/certificate/mint-certificate',
      form,
      {
        headers: {
          client_id: process.env.MASCHAIN_CLIENT_ID!,
          client_secret: process.env.MASCHAIN_CLIENT_SECRET!,
          ...form.getHeaders(),
        },
      }
    );

    console.log("✅ MasChain Mint Response:", response.data);
    return NextResponse.json({ success: true, result: response.data });
  } catch (error: any) {
    console.error("❌ MasChain Mint Error:", error.response?.data || error.message);
    return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
  }
}
