import React, { useState, useEffect } from 'react';
import { createCoin } from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http, custom } from "viem";
import { baseSepolia } from "viem/chains";

const CoinDeployer = () => {
  const [account, setAccount] = useState(null);
  const [walletClient, setWalletClient] = useState(null);
  const [publicClient, setPublicClient] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        setStatus({
          message: "MetaMask or another web3 wallet is required. Please install MetaMask.",
          type: "error"
        });
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAccount = accounts[0];
      setAccount(userAccount);
      
      // Initialize clients
      const wallet = createWalletClient({
        account: userAccount,
        chain: baseSepolia,
        transport: custom(window.ethereum)
      });
      
      const public_client = createPublicClient({
        chain: baseSepolia,
        transport: http("https://sepolia.base.org")
      });
      
      setWalletClient(wallet);
      setPublicClient(public_client);
      setIsWalletConnected(true);
      
      setStatus({
        message: "Wallet connected successfully! You can now create your coin.",
        type: "success"
      });
      
      // Switch to Base Sepolia network if needed
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x14a34' }], // Base Sepolia chainId in hex
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x14a34',
                  chainName: 'Base Sepolia',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.base.org'],
                  blockExplorerUrls: ['https://sepolia.basescan.org']
                }
              ],
            });
          } catch (addError) {
            setStatus({
              message: "Failed to add Base Sepolia network to your wallet.",
              type: "error"
            });
          }
        } else {
          setStatus({
            message: "Failed to switch to Base Sepolia network.",
            type: "error"
          });
        }
      }
      
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatus({
        message: "Failed to connect wallet: " + error.message,
        type: "error"
      });
    }
  };

  const deployDSnakeCoin = async () => {
    if (!account || !walletClient || !publicClient) {
      setStatus({
        message: "Please connect your wallet first.",
        type: "error"
      });
      return;
    }
    
    setIsLoading(true);
    setStatus({ message: '', type: '' });
    
    try {
      // Define coin parameters
      const coinParams = {
        name: "dSnake",
        symbol: "DSN",
        uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
        payoutRecipient: account,
        platformReferrer: account, // Optional
        initialPurchaseWei: 0n, // Optional: Initial amount to purchase in Wei
      };
      
      // Create the coin
      const result = await createCoin(coinParams, walletClient, publicClient);
      
      setIsLoading(false);
      
      // Show success message with links
      setStatus({
        message: `
          <h3>🎉 Coin deployed successfully!</h3>
          <p><strong>Transaction hash:</strong> <a href="https://sepolia.basescan.org/tx/${result.hash}" target="_blank" rel="noopener noreferrer" class="address">${result.hash}</a></p>
          <p><strong>Coin address:</strong> <a href="https://sepolia.basescan.org/address/${result.address}" target="_blank" rel="noopener noreferrer" class="address">${result.address}</a></p>
        `,
        type: "success"
      });
      
      console.log("Transaction hash:", result.hash);
      console.log("Coin address:", result.address);
      console.log("Deployment details:", result.deployment);
      
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating coin:", error);
      setStatus({
        message: "Failed to create coin: " + error.message,
        type: "error"
      });
    }
  };

  return (
    <div className="coin-deployer">
      <h1>dSnake (DSN) Coin Deployer</h1>
      <p>This interface will help you deploy your dSnake coin on Base Sepolia using the Zora coins SDK.</p>
      
      <div className="coin-params">
        <h3>Coin Parameters</h3>
        <ul>
          <li><strong>Name:</strong> dSnake</li>
          <li><strong>Symbol:</strong> DSN</li>
          <li><strong>URI:</strong> <span className="address">ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy</span></li>
        </ul>
      </div>
      
      <div className="wallet-section">
        <h3>Connected Account</h3>
        <p>{account || "Not connected"}</p>
        <button 
          onClick={connectWallet} 
          disabled={isWalletConnected}
        >
          {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </div>
      
      <div className="deploy-section">
        <button 
          onClick={deployDSnakeCoin} 
          disabled={!isWalletConnected || isLoading}
        >
          Create dSnake Coin
        </button>
        
        {isLoading && (
          <div className="loading">
            Creating coin... Please confirm the transaction in your wallet.
          </div>
        )}
      </div>
      
      {status.message && (
        <div 
          className={`status ${status.type}`}
          dangerouslySetInnerHTML={{ __html: status.message }}
        />
      )}
    </div>
  );
};

export default CoinDeployer; 