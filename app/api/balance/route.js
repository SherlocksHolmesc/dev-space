import { checkBalance } from '/app/wallet/maschain.js';

export async function GET(request) {
  const contract = '0x4579c765c30121B253C452B0543203B617152Ae2';
  
  try {
    // Get wallet address from query parameters
    const { searchParams } = new URL(request.url);
    const walletParam = searchParams.get('wallet');
    
    // Use the provided wallet address or fallback to default
    const walletAddress = walletParam || '0x5E9C287CA011343B9CC8F30A30527bF6fede918b';
    const isUserWallet = !!walletParam;
    
    console.log('Checking balance for wallet:', walletAddress, 'isUserWallet:', isUserWallet);
    const balance = await checkBalance(walletAddress, contract);
    
    return new Response(JSON.stringify({ 
      balance,
      walletAddress,
      isUserWallet 
    }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
