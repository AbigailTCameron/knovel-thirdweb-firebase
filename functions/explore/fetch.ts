import initializeFirebaseClient from "@/lib/initFirebase";
import { collection, deleteDoc, doc, getDoc, getDocs, limit, or, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import { Notification } from "../..";

const { db } = initializeFirebaseClient();

export const getUserProfile = async (userId: string, setProfileUrl: Function) => {

    // Fetch user document from Firestore
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      setProfileUrl(userData.profilePicture || null);
      return userData;
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

export const fetchSearchResults = async(queryText: string, setResults: Function) => {
  try {
    const booksCollection = collection(db, "books");

    // Create a query for matching titles (case-sensitive)
    const booksQuery = query(
      booksCollection, or(
        where("search_keywords", "array-contains", queryText.toLowerCase()),
        where('genres', "array-contains", queryText.toLowerCase()),
      )
   
    );
  
    const querySnapshot = await getDocs(booksQuery);

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setResults(results);
  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }
}

export const fetchNotifications = async (userId: string) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipientId", "==", userId),
      orderBy("createdAt", "desc")
    );    
    
    const querySnapshot = await getDocs(q);

    const notifications = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Notification[]
    return notifications;
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);

    const docSnapshot = await getDoc(notificationRef);
    
    if (!docSnapshot.exists()) {
      console.error('Notification does not exist');
      return;
    }

    await updateDoc(notificationRef, {
      isRead: true,
    });
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
};

export const deleteNotif = async (commentId: string) => {
  try {
        // Step 1: Delete the comment document
        const notificationRef = doc(db, "notifications", commentId);
        await deleteDoc(notificationRef);
    
        return { success: true };

  } catch (err) {
    console.error("Error deleting notification:", err);
    return { success: false };

  }
}