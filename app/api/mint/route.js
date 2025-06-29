// app/api/mint/route.js

import { NextResponse } from 'next/server';
import { fetchTxnCount, transferToken } from '@/app/wallet/maschain.js';

export async function POST(req) {
    try {
        const { sender, recipient, amount, contract } = await req.json();

        if (!sender || !recipient || !amount || !contract || Number(amount) <= 0) {
            return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
        }

        console.log("Received for mint/transfer:", { sender, recipient, amount, contract });

        const nonce = await fetchTxnCount(sender);
        console.log('🔢 Nonce now:', nonce);

        console.log(`➡️ Transferring ${amount} tokens...`);
        const txHash = await transferToken(sender, recipient, amount, contract, nonce);
        console.log('✅ Transfer TX Hash:', txHash);

        return NextResponse.json({ txHash });
    } catch (error) {
        console.error('❌ API Error:', error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data || error.message },
            { status: 500 }
        );
    }
}
