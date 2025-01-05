import initializeFirebaseClient from "@/lib/initFirebase";
import { collection, getDocs, query } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export async function fetchPublishInfo(userId: string, setPublish: Function) {
  try{
      // Step 1: Reference the books collection for the user
      const booksCollection = collection(db, "published", userId, "userDrafts");

      // Step 2: Fetch all books for the user
      const bookQuery = query(booksCollection); 
      const bookSnapshot = await getDocs(bookQuery);

      // Step 3: Map over the results to format the book data
      const books = bookSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Step 4: Update state with fetched drafts
      setPublish(books);

  
  }catch(err){
    console.error(err); 
  }
}