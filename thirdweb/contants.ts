import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { SmartWalletOptions } from "thirdweb/wallets";

export const client = createThirdwebClient({
	clientId: "e4d51769fcc92b76042b7b13f041e01e",
});

export const chain =  defineChain(84532);
// @ts-ignore
export const editionDropTokenId = 0n;

export const editionDropContract = getContract({
    // @ts-ignore
	address: "0x1C8a924Ce3cFDE65B0596Ef8DB403310Ab76A91c",
	chain,
	client
});

export const accountAbstraction: SmartWalletOptions = {
	chain,
	sponsorGas: true,
};

