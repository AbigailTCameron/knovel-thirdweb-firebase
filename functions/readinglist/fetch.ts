import { doc, getDoc } from "firebase/firestore";
import { Book } from "../..";
import initializeFirebaseClient from "@/lib/initFirebase";

const { db } = initializeFirebaseClient();

export const fetchBookDetails = async (bookmarks: string[], setBookDetails: Function) => {
  try{
    const bookData: Book[] = [];
    for (const bookId of bookmarks) {
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