import {
    createThirdwebClient,
    getContract,
  } from "thirdweb";
  import { defineChain } from "thirdweb/chains";
  
  // create the client with your clientId, or secretKey if in a server environment
 export const client = createThirdwebClient({
    clientId: "e4d51769fcc92b76042b7b13f041e01e",
  });
  
  // connect to your contract
export const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0x1C8a924Ce3cFDE65B0596Ef8DB403310Ab76A91c",
  });