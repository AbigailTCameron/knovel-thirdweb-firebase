import initializeFirebaseClient from "@/lib/initFirebase";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

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


export const fetchBookError = async (id: string, router:any) => {
  try{
    // Reference to the specific book document in the Firestore "books" collection
    const bookRef = doc(db, 'books', id);


    // Fetch the document
    const bookSnap = await getDoc(bookRef);
    if (!bookSnap.exists()) {     
      return;
    }

    return router.push(`/book/${id}`);

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

export const updateBookmarkData = async(userId: string, bookId: string) => {
  try {
      // Reference to the user's profile document in Firestore
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        if(data.bookmark.includes(bookId)){
            await updateDoc(userRef, {
              bookmark: arrayRemove(bookId),
            });
        }else {
            await updateDoc(userRef, {
              bookmark: arrayUnion(bookId),
            });
        }
      }
  }catch (error) {
    console.error("Error updating bookmarks:", error);
  }
}
