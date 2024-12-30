import initializeFirebaseClient from "@/lib/initFirebase";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const getUserProfileImage = async (userId: string, setProfileUrl: Function) => {

    // Fetch user document from Firestore
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      setProfileUrl(userData.profilePicture || null)
    } else {
      console.log("User document not found.");
      return null;
    }
}


export const fetchBooks = async ( lastVisibleDoc: any, setBooks: Function) => {
  try {
      const booksCollection = collection(db, "books");

      // Create the query
      let booksQuery = query(booksCollection, orderBy("created_at", "desc"), limit(20));
    
      // If there's a lastVisibleDoc, start after it (for pagination)
      if (lastVisibleDoc) {
        booksQuery = query(
          booksCollection, 
          orderBy("created_at", "desc"), 
          startAfter(lastVisibleDoc), 
          limit(20)
        );
      }

      const querySnapshot = await getDocs(booksQuery);

      // Map data to usable format
      const books = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Set books and last document
      setBooks(books); // Append new books

      return querySnapshot.docs[querySnapshot.docs.length - 1] || null; 

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }

}

export const fetchTopRated = async (lastVisibleDoc: any, setBooks: Function) => {
  try{
    const booksCollection = collection(db, "books");

    // Create the query
    let booksQuery = query(booksCollection, orderBy("rating", "desc"), limit(20));

    // If there's a lastVisibleDoc, start after it (for pagination)
    if (lastVisibleDoc) {
      booksQuery = query(
        booksCollection, 
        orderBy("rating", "desc"), 
        startAfter(lastVisibleDoc), 
        limit(20)
      );
    }


    const querySnapshot = await getDocs(booksQuery);

    // Map data to usable format
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Set books and last document
    setBooks(books); // Append new books

    return querySnapshot.docs[querySnapshot.docs.length - 1] || null; 


  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }
}


export const fetchBooksByGenre = async(genre: string, setBooks: Function) => {
  try {
    const booksCollection = collection(db, "books");

    const booksQuery = query(booksCollection, where("genres", "array-contains", genre));

    const querySnapshot = await getDocs(booksQuery);

    // Map the query results into an array of books
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(books);

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }
}