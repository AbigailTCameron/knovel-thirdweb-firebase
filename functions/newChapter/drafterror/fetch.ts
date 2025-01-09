import initializeFirebaseClient from "@/lib/initFirebase";
import { doc, getDoc } from "firebase/firestore";

const { db } = initializeFirebaseClient();


export const draftErrorPage = async(userId: string, draftId: string, router: any) => {
  try {
    // Reference to the specific draft document in the `drafts` collection
    const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);

    // Fetch the draft document
    const draftSnap = await getDoc(draftRef);

    // Check if the document exists
    if (!draftSnap.exists()) {
      return;
    }

    // Get the draft data
    const draftData = draftSnap.data();

    // Perform additional checks on the draft data if needed
    if (draftData) {
      // Redirect to the draft page
      router.push(`/draft/${draftId}`);
    }
  } catch (error) {
    console.error("Error fetching draft from Firestore:", error);
  }
}