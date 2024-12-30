import initializeFirebaseClient from "@/lib/initFirebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const fetchBookData = async (id : string, router: any, setBook: Function) => {
  try {
    // Reference to the specific book document in the Firestore "books" collection
    const bookRef = doc(db, 'books', id);

    // Fetch the document
    const bookSnap = await getDoc(bookRef);
    if (!bookSnap.exists()) {
      // If the document does not exist, redirect to the error page
      router.push(`/bookerror/${id}`);
      return;
    }

    // Update state with the book data
    setBook(bookSnap.data());

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }
}

export const fetchBookmark = async (bookmarks: string[], bookId: string, setBookmark: Function) => {
  try {
      // Ensure userDetails contains a valid bookmark array
      const isBookmarked = bookmarks.includes(bookId);

      // Update the bookmark state
      setBookmark(isBookmarked);

  } catch (error) {
    console.error("Error fetching bookmark:", error);
  }
  
}

export const updateBookmarkData = async(userId: string, currentBookmarkState: boolean, bookmark: string[], bookId: string) => {
  try {
      // Reference to the user's profile document in Firestore
      const userRef = doc(db, "users", userId);

      // Toggle the bookmark state
      let updatedBookmarks: string[] = [];

      if (!currentBookmarkState) {
        // If currently bookmarked, remove the bookId
        updatedBookmarks = bookmark?.filter((id: string) => id !== bookId);
      } else {
        // If not bookmarked, add the bookId
        updatedBookmarks = [...bookmark, bookId];

      }
      // Update the bookmark field in Firestore
      await updateDoc(userRef, { bookmark: updatedBookmarks });
  }catch (error) {
    console.error("Error updating bookmarks:", error);
  }
}
