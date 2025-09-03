import { collection, getDocs, query, where } from "firebase/firestore";
import initializeFirebaseClient from "@/lib/initFirebase";

const { db } = initializeFirebaseClient();


export const checkUsername = async (username: string) => {
  try{
      // Normalize the username: remove trailing spaces and convert to lowercase
      const normalizedUsername = username.trim().toLowerCase();

      // Step 1: Check if the username is already taken
      const usersCollection = collection(db, "users");
      const usernameQuery = query(usersCollection, where("username", "==", normalizedUsername));
      const querySnapshot = await getDocs(usernameQuery);

      return !querySnapshot.empty; 

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error saving settings:", error.message);
    } else {
      console.error("Error saving settings:", String(error));
    }
  }
}