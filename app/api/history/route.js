import { fetchTxHistory } from '/app/wallet/maschain.js';

export async function GET(request) {
  const contract = '0x958259660877ae9f9aE665f78c4a7B8EbD247B44';

  try {
    // Get wallet address from query parameters
    const { searchParams } = new URL(request.url);
    const walletParam = searchParams.get('wallet');
    
    // Use the provided wallet address or fallback to default
    const walletAddress = walletParam || '0x5E9C287CA011343B9CC8F30A30527bF6fede918b';
    const isUserWallet = !!walletParam;
    
    console.log('Fetching history for wallet:', walletAddress, 'isUserWallet:', isUserWallet);
    const history = await fetchTxHistory(walletAddress, contract);

    if (!history || !Array.isArray(history)) {
      console.error('Invalid fetchTxHistory response:', history);
      return new Response(JSON.stringify({ 
        history: [],
        walletAddress,
        isUserWallet
      }), { status: 200 });
    }

    return new Response(JSON.stringify({ 
      history,
      walletAddress,
      isUserWallet
    }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ 
      error: err.message, 
      history: [],
      walletAddress: null,
      isUserWallet: false
    }), { status: 500 });
  }
}
