// lib/clientCall.ts
import { createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";


const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!; // this will be used on the client
const secretKey = process.env.THIRDWEB_SECRET_KEY!; // this will be used on the server-side
const privateKey = process.env.NEXT_PUBLIC_ACCOUNT!; 

export const client = createThirdwebClient(
  clientId ? { clientId } : { secretKey },
);

export const personalAccount = privateKeyToAccount({
  client,
  privateKey: privateKey,
});

