import initializeFirebaseClient from "@/lib/initFirebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { Book } from "../..";

const { db } = initializeFirebaseClient();
export const fetchProfileInfo = async(userId: string, profileId: string, setUserImage: Function, setName: Function, setUsername: Function, setIsFollowing: Function, setBooks: Function) => {
  try{
    // Reference to the user's document in Firestore
    const userRef = doc(db, "users", profileId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();

      // Set profile info
      setUserImage(userData.profilePicture || '');
      setName(userData.name || '');
      setUsername(userData.username || '');
      setBooks(userData.published);
    
      // Now check if the logged-in user is following this profile
      const currentUserRef = doc(db, "users", userId);
      const currentUserSnapshot = await getDoc(currentUserRef);

      if (currentUserSnapshot.exists()) {
          const currentUserData = currentUserSnapshot.data();
          const isFollowing = currentUserData.following?.includes(profileId) || false;
          setIsFollowing(isFollowing);
      } else {
        console.error("Current user not found.");
      }

    } else {
      console.error(`User not found.`);
      return null;
    }

  }catch(err){
    console.log("Error fetching profile info");
  }
}

export const fetchBookProfileDetails = async (books: string[], setBookDetails: Function) => {
  try{
    const bookData: Book[] = [];
    for (const bookId of books) {
      const bookRef = doc(db, 'books', bookId);
      const bookSnap = await getDoc(bookRef);

      if (bookSnap.exists()) {
        const book = { id: bookId, ...bookSnap.data() } as Book;
        bookData.push(book);
      }
    }
    setBookDetails(bookData);

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }
}