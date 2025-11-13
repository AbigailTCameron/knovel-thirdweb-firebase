"use client"
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import initializeFirebaseClient from "./initFirebase";

let analyticsInstance: Analytics | null = null;
let initializing = false;

export async function getFirebaseAnalytics() {
  // Never run in SSR / Node environments
  if (typeof window === "undefined") {
    return null;
  }

  // Avoid re-entrant initialization
  if (analyticsInstance || initializing) {
    return analyticsInstance;
  }

  initializing = true;

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    initializing = false;
    return null;
  }

  const { app } = initializeFirebaseClient();
  analyticsInstance = getAnalytics(app);
  initializing = false;

  return analyticsInstance;
}