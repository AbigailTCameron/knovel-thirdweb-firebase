import initializeFirebaseClient from "@/lib/initFirebase";
import { collection, getDocs, query } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const fetchDraftInfo = async (userId: string, setDrafts: Function) => {
  try {
      // Step 1: Reference the drafts collection for the user
      const draftsCollection = collection(db, "drafts", userId, "userDrafts");

      // Step 2: Fetch all drafts for the user
      const draftQuery = query(draftsCollection); 
      const draftSnapshot = await getDocs(draftQuery);

      // Step 3: Map over the results to format the draft data
      const drafts = draftSnapshot.docs.map((doc) => ({
        draftId: doc.id,
        ...doc.data(),
      }));

      // Step 4: Update state with fetched drafts
     setDrafts(drafts);
  }catch(error){
    if (error instanceof Error) {
      console.error("Error fetching drafts:", error.message);
    } else {
      console.error("Error fetching drafts:", String(error));
    }
  }
}