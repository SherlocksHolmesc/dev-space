import {
    fetchTxnCount,
    mintToken,
    transferToken,
    checkBalance
  } from './maschain.js';
import fs from 'fs';
import path from 'path';
  
  // Function to get the logged-in user's wallet address (browser only)
  function getLoggedInUserWallet() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('⚠️ Running in Node.js environment - localStorage not available');
        return null;
      }
      
      const isLoggedIn = localStorage.getItem('is_logged_in');
      if (!isLoggedIn || isLoggedIn !== 'true') {
        throw new Error('No user logged in');
      }
      
      const userData = localStorage.getItem('devspace_user');
      if (!userData) {
        throw new Error('No user data found');
      }
      
      const user = JSON.parse(userData);
      if (!user.wallet) {
        throw new Error('No wallet address found for user');
      }
      
      return user.wallet;
    } catch (error) {
      console.error('Error getting logged-in user wallet:', error.message);
      return null;
    }
  }

  // Function to get user wallet address in Node.js environment
  function getNodeUserWallet() {
    try {
      // Method 1: Try to read from user-data.json (created from browser)
      const userDataPath = path.join(process.cwd(), 'user-data.json');
      if (fs.existsSync(userDataPath)) {
        const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
        if (userData.wallet) {
          console.log('📁 Found user wallet from user-data.json:', userData.wallet);
          return userData.wallet;
        }
      }

      // Method 2: Try to read from current-user.json (alternative format)
      const currentUserPath = path.join(process.cwd(), 'current-user.json');
      if (fs.existsSync(currentUserPath)) {
        const userData = JSON.parse(fs.readFileSync(currentUserPath, 'utf8'));
        if (userData.wallet) {
          console.log('📁 Found user wallet from current-user.json:', userData.wallet);
          return userData.wallet;
        }
      }

      // Method 3: Try environment variables as fallback
      const envWallet = process.env.USER_WALLET_ADDRESS || process.env.DEVSPACE_USER_WALLET;
      if (envWallet) {
        console.log('🔧 Found user wallet from environment variable:', envWallet);
        return envWallet;
      }

      console.log('ℹ️ No user wallet found. Create user-data.json with your wallet address.');
      console.log('💡 Quick setup:');
      console.log('   1. Log into your app in browser');
      console.log('   2. Open console (F12) and run:');
      console.log('      localStorage.getItem("devspace_user")');
      console.log('   3. Copy the result to user-data.json file');
      return null;
    } catch (error) {
      console.error('Error reading user wallet:', error.message);
      return null;
    }
  }
  
  // Function to generate or accept dynamic recipient addresses
  function getRecipientAddress(recipientInput = null) {
    // If a specific recipient is provided, use it
    if (recipientInput) {
      return recipientInput;
    }
    
    // Try to get the logged-in user's wallet address (browser only)
    const loggedInUserWallet = getLoggedInUserWallet();
    if (loggedInUserWallet) {
      return loggedInUserWallet;
    }

    // Try to get user wallet in Node.js environment
    const nodeUserWallet = getNodeUserWallet();
    if (nodeUserWallet) {
      return nodeUserWallet;
    }
    
    // Fallback to predefined recipients if no logged-in user
    const dynamicRecipients = [
      '0x360271C8dFC8647b18cE9F15B931e85a1bf984C3',
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      '0x8ba1f109551bD432803012645Hac136c772c3c7c',
      '0x147B8eb97fD247D06C4006D269c90C1908Fb5D54'
    ];
    
    // Return a random recipient from the list
    return dynamicRecipients[Math.floor(Math.random() * dynamicRecipients.length)];
  }
  
  async function main(recipientAddress = null) {
    const sender   = '0x5E9C287CA011343B9CC8F30A30527bF6fede918b';
    const recipient = getRecipientAddress(recipientAddress);
    const contract = '0x958259660877ae9f9aE665f78c4a7B8EbD247B44';
  
    console.log('🎯 Using recipient address:', recipient);
    
    // Check if this is the logged-in user's wallet
    const loggedInUserWallet = getLoggedInUserWallet();
    const nodeUserWallet = getNodeUserWallet();
    
    if (loggedInUserWallet && loggedInUserWallet === recipient) {
      console.log('✅ Recipient is the logged-in user\'s wallet (browser)');
    } else if (nodeUserWallet && nodeUserWallet === recipient) {
      console.log('✅ Recipient is the user\'s wallet (Node.js)');
    } else if (loggedInUserWallet || nodeUserWallet) {
      console.log('⚠️ Recipient is not the user\'s wallet');
    } else {
      console.log('ℹ️ No logged-in user found, using fallback recipient');
    }
    
    console.log('➡️ Minting tokens…');
    const mintHash = await mintToken(sender, contract, 4000);
    console.log('✅ Mint TX Hash:', mintHash);
  
    const balance1 = await checkBalance(sender, contract);
    console.log('💰 Sender balance after mint:', balance1);
  
    // Check recipient balance before transfer
    const recipientBalanceBefore = await checkBalance(recipient, contract);
    console.log('💰 Recipient balance before transfer:', recipientBalanceBefore);
  
    // Get fresh nonce after minting (important!)
    console.log('⏳ Waiting a moment for mint transaction to be processed...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const nonce = await fetchTxnCount(sender);
    console.log('🔢 Nonce after mint:', nonce);
  
    console.log('➡️ Transferring tokens…');
    const txHash = await transferToken(sender, recipient, 10, contract, nonce);
    console.log('✅ Transfer TX Hash:', txHash);
  
    // Wait a moment for transfer to be processed
    console.log('⏳ Waiting for transfer to be processed...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
  
    const balance2 = await checkBalance(sender, contract);
    console.log('💰 Sender balance after transfer:', balance2);
    
    // Check recipient balance after transfer
    const recipientBalanceAfter = await checkBalance(recipient, contract);
    console.log('💰 Recipient balance after transfer:', recipientBalanceAfter);
    
    // Verify the transfer
    const recipientBalanceDiff = Number(recipientBalanceAfter) - Number(recipientBalanceBefore);
    console.log('📊 Transfer verification:');
    console.log(`   Recipient balance change: ${recipientBalanceDiff}`);
    console.log(`   Expected transfer amount: 10`);
    
    if (recipientBalanceDiff >= 10) {
      console.log('✅ Transfer successful! Tokens received by recipient.');
    } else {
      console.log('⚠️ Transfer may be pending or failed. Check transaction hash on explorer.');
      console.log(`🔍 Check transaction: https://explorer-testnet.maschain.com/${txHash}`);
    }
  }
  
  // Export the main function so it can be called with different recipients
  export { main, getRecipientAddress, getLoggedInUserWallet, getNodeUserWallet };
  
  // Check if this is being run directly with Node.js
  if (typeof window === 'undefined') {
    // Node.js environment - check for command line arguments
    const args = process.argv.slice(2);
    let recipientAddress = null;
    
    if (args.length > 0) {
      recipientAddress = args[0];
      console.log('🎯 Using recipient address from command line:', recipientAddress);
    }
    
    // Run with the specified recipient or default
    main(recipientAddress).catch(err => {
      console.error('❌ Error:', err.response?.data || err.message);
      process.exit(1);
    });
  } else {
    // Browser environment - run with default dynamic recipient
    main().catch(err => console.error('❌ Error:', err.response?.data || err.message));
  }
  