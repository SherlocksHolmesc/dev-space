import { fetchTxHistory } from '/app/wallet/maschain.js';

export async function GET() {
  const sender = '0x5E9C287CA011343B9CC8F30A30527bF6fede918b';
  const contract = '0x958259660877ae9f9aE665f78c4a7B8EbD247B44';

  try {
    const history = await fetchTxHistory(sender, contract);

    if (!history || !Array.isArray(history)) {
      console.error('Invalid fetchTxHistory response:', history);
      return new Response(JSON.stringify({ history: [] }), { status: 200 });
    }

    return new Response(JSON.stringify({ history }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message, history: [] }), { status: 500 });
  }
}
