import initializeFirebaseClient from "@/lib/initFirebase";
import { collection, getDocs, or, query, where } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const fetchUsernameResults = async(queryText: string, setResults: Function) => {
  try {
    const usersCollection = collection(db, "users");

     // Normalize queryText: Trim and convert to lowercase
     const normalizedQuery = queryText.trim().toLowerCase();

    // Create a query for matching titles (case-sensitive)
    const usersQuery = query(
      usersCollection, 
      where("username", ">=", normalizedQuery),
      where("username", "<", normalizedQuery + '\uf8ff') 
    );
  
    const querySnapshot = await getDocs(usersQuery);

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setResults(results);
  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching users:", error.message);
    } else {
      console.error("Error fetching users:", String(error));
    }
  }
}