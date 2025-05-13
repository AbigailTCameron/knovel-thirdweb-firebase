"use server"
import { client } from "@/lib/client";
import { createAuth, VerifyLoginPayloadParams } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";

const privateKey = process.env.AUTH_PRIVATE_KEY || "";

if (!privateKey) {
  throw new Error("Missing AUTH_PRIVATE_KEY in .env file.");
}
 
const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  adminAccount: privateKeyToAccount({ client: client, privateKey }),
  client: client,
  jwt: {
    expirationTimeSeconds: 60 * 60 * 24 * 30,
  },
  login: {
    payloadExpirationTimeSeconds: 60 * 60 * 24 * 30
  }
});

const {auth} = initializeFirebaseServer(); 


export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);

  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    (await cookies()).set("jwt", jwt);

    const verifyJWT = await thirdwebAuth.verifyJWT({jwt})
    if (!verifyJWT.valid) {
      return false;
    }
  
    const jwtExp = verifyJWT.parsedJWT.exp;     

    const address = verifiedPayload.payload.address;
    const token = await auth.createCustomToken(address); 
    
    return {token, jwtExp};
  }
}


export async function isLoggedIn() {

  const jwt = (await cookies()).get("jwt");
  if (!jwt?.value) {
    return false;
  }
 
  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });

  if (!authResult.valid) {
    await logout();
    return false;
  }

  const jwtExp = authResult.parsedJWT.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  const threshold = 60 * 60 * 24; // Refresh if less than a day

  if (jwtExp - currentTime <= threshold) {
    await logout();
    return true;
  }

  return authResult.valid;
}

export async function logout() {
  (await cookies()).delete("jwt");
  redirect('/');
}



