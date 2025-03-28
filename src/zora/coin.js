import { createCoin } from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http } from "viem";
import { base, baseSepolia, zoraSepolia } from "viem/chains";
 
// Set up viem clients
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http("https://base-mainnet.g.alchemy.com/v2/DfVFmFwB5_nE73pIOir1F5ZIzu_Px4f4"),
});
 
const walletClient = createWalletClient({
  account: "0x4eA48e01F1314Db0925653e30617B254D1cf5366",
  chain: baseSepolia,
  transport: http("https://base-sepolia.g.alchemy.com/v2/DfVFmFwB5_nE73pIOir1F5ZIzu_Px4f4"),
});
 
// Define coin parameters
const coinParams = {
  name: "dSnake",
  symbol: "DSN",
  uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
  payoutRecipient: "0x4eA48e01F1314Db0925653e30617B254D1cf5366",
  platformReferrer: "0x4eA48e01F1314Db0925653e30617B254D1cf5366", // Optional
  initialPurchaseWei: 0n, // Optional: Initial amount to purchase in Wei
};
 
// Create the coin
async function createMyCoin() {
  try {
    const result = await createCoin(coinParams, walletClient, publicClient);
    
    console.log("Transaction hash:", result.hash);
    console.log("Coin address:", result.address);
    console.log("Deployment details:", result.deployment);
    
    return result;
  } catch (error) {
    console.error("Error creating coin:", error);
    throw error;
  }
}

createMyCoin();