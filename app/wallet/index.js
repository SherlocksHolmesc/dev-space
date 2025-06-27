import {
    fetchTxnCount,
    mintToken,
    transferToken,
    checkBalance
  } from './maschain.js';
  
  async function main() {
    const sender   = '0x5E9C287CA011343B9CC8F30A30527bF6fede918b';
    const recipient= '0x360271C8dFC8647b18cE9F15B931e85a1bf984C3';
    const contract = '0x958259660877ae9f9aE665f78c4a7B8EbD247B44';
  
    console.log('➡️ Minting tokens…');
    const mintHash = await mintToken(sender, contract, 4000);
    console.log('✅ Mint TX Hash:', mintHash);
  
    const balance1 = await checkBalance(sender, contract);
    console.log('💰 Balance after mint:', balance1);
  
    const nonce = await fetchTxnCount(sender);
    console.log('🔢 Nonce now:', nonce);
  
    console.log('➡️ Transferring tokens…');
    const txHash = await transferToken(sender, recipient, 10, contract, nonce);
    console.log('✅ Transfer TX Hash:', txHash);
  
    const balance2 = await checkBalance(sender, contract);
    console.log('💰 Balance after transfer:', balance2);
  }
  
  main().catch(err => console.error('❌ Error:', err.response?.data || err.message));
  