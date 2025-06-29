// app/api/claim/route.js

import { NextResponse } from 'next/server';
import { mintToken, checkBalance } from '/app/wallet/maschain.js';

export async function POST(req) {
    try {
        const { recipient, amount, contract } = await req.json();

        if (!recipient || !amount || !contract) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log('➡️ Minting tokens for claim…');
        const mintHash = await mintToken(recipient, contract, amount);
        console.log('✅ Mint TX Hash:', mintHash);

        const balance = await checkBalance(recipient, contract);
        console.log('💰 Balance after mint:', balance);

        return NextResponse.json({
            success: true,
            txHash: mintHash,
            balance
        });
    } catch (error) {
        console.error('❌ Claim mint error:', error);
        return NextResponse.json(
            { error: error.response?.data || error.message },
            { status: 500 }
        );
    }
}
