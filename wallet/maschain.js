import axios from 'axios';

const BASE = 'https://service-testnet.maschain.com/api';
const CLIENT_ID = '0effeeb5c6812e89d103e01c997eb3d55d7ef72fe3e33003afa3f26e81ce1365';
const CLIENT_SECRET = 'sk_5a1514435f7ffd2ce408c036d89e00344ac7af7ad9d38c6c8f316a78b6c12e45';
const CALLBACK = 'https://postman-echo.com/post';

const client = axios.create({
  baseURL: BASE,
  headers: {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    'Content-Type': 'application/json'
  }
});

export async function fetchTxnCount(addr) {
  const { data } = await client.get(`/wallet/wallet/${addr}/transactions-count?block=pending`);
  return data.result.transaction_count;
}

export async function mintToken(to, contractAddress, amount) {
  const res = await client.post('/token/mint', {
    wallet_address: to,
    to,
    contract_address: contractAddress,
    amount: amount.toString(),
    callback_url: CALLBACK
  });
  return res.data.result.transactionHash;
}

export async function transferToken(from, to, amount, contractAddress, nonce) {
  const res = await client.post('/token/token-transfer', {
    wallet_address: from,
    to,
    amount: amount.toString(),
    contract_address: contractAddress,
    nonce,
    callback_url: CALLBACK
  });
  return res.data.result.transactionHash;
}

export async function checkBalance(walletAddress, contractAddress) {
  const { data } = await client.post('/token/balance', {
    wallet_address: walletAddress,
    contract_address: contractAddress
  });
  return data.result;  // string balance
}
