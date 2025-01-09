import initializeFirebaseClient from "@/lib/initFirebase";
import { doc, getDoc } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const publishErrorPage = async(bookId: string, router: any) => {
  try {
    // Reference to the specific draft document in the `drafts` collection
    const bookRef = doc(db, "books", bookId);

    // Fetch the book document
    const bookSnap = await getDoc(bookRef);

    // Check if the document exists
    if (!bookSnap.exists()) {
      return;
    }

    // Get the draft data
    const draftData = bookSnap.data();

    // Perform additional checks on the draft data if needed
    if (draftData) {
      // Redirect to the draft page
      router.push(`/editPublish/${bookId}`);
    }
  } catch (error) {
    console.error("Error fetching book from Firestore:", error);
  }
}