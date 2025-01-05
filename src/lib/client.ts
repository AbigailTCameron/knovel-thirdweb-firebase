// lib/clientCall.ts
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!; // this will be used on the client
const secretKey = process.env.THIRDWEB_SECRET_KEY!; // this will be used on the server-side
const privateKey = process.env.AUTH_PRIVATE_KEY!; 


export const client = createThirdwebClient(
  clientId ? { clientId } : { secretKey },
);

export const contract = getContract({
  client,
  chain: defineChain(421614),
  address: "0x4b826395A042807D4980962d0f241c707c8a1583",
});

export const personalAccount = privateKeyToAccount({
  client,
  privateKey: privateKey,
});
