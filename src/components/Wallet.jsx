// src/client.ts
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
 
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "your-client-id-here",
});

function ConnectWallet() {
  return (
    <div className="wallet-connect-container">
      <ConnectButton client={client} />
    </div>
  )
}

export default ConnectWallet;