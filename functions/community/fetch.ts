import initializeFirebaseClient from "@/lib/initFirebase";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, increment, limit, or, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const fetchUsernameResults = async(queryText: string, setResults: Function, userId: string) => {
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
    const loggedInUserRef = doc(db, "users", userId);

    const loggedInUserSnapshot = await getDoc(loggedInUserRef);

    // Get the "following" array of the logged-in user
    const loggedInUserData = loggedInUserSnapshot.data();
    const following = loggedInUserData?.following || [];

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      isFollowing: following.includes(doc.id), // Check if the user is being followed
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

export const updateFollowList = async (userId: string, user: string) => {
  try {
    // Reference to the user's profile document
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    // Reference to the followed user's document
    const userLikeRef = doc(db, "users", user);
    const userLikeSnapshot = await getDoc(userLikeRef);

    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      const following = data.following || [];

      if (following.includes(user)) {
        // First update the `following` array in the current user's document
        await updateDoc(userRef, {
          following: arrayRemove(user),
        });

        // THEN separately update the `followerCount` field in the other user's document
        await updateDoc(userLikeRef, {
          followerCount: increment(-1),
          followers: arrayRemove(userId)
        });

      } else {
        // First update the `following` array
        await updateDoc(userRef, {
          following: arrayUnion(user),
        });

        // THEN separately update `followerCount`
        await updateDoc(userLikeRef, {
          followerCount: increment(1),
          followers: arrayUnion(userId)
        });
      }
    }
  } catch (error) {
    console.error("Error updating follow list:", error);
  }
};

export const updateGenres = async(userId: string, selectedGenres: string[]) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { genres: selectedGenres });
    console.log("Genres updated successfully!");

  }catch(err){
    console.error("Error trying to save the genres", err); 
  }
}

export const recommendedBooks = async(userGenres: string[], setResults: Function, lastVisibleDoc: any, setLastVisibleDoc: Function) => {
  try {
    const booksCollection = collection(db, "books");
    let booksQuery = query(
      booksCollection, 
      where("genres", "array-contains-any", userGenres),
      limit(10)
    );

 

    // If there's a lastDoc, use it for pagination
    if (lastVisibleDoc) {
      booksQuery = query(
        booksCollection,
        where("genres", "array-contains-any", userGenres),
        startAfter(lastVisibleDoc),
        limit(10)
      );
    }
  

    const querySnapshot = await getDocs(booksQuery);
    if (querySnapshot.empty) return;

    const books = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const bookData = docSnapshot.data();
        const authorId = bookData.authorId;

        // Fetch author profile
        let authorProfile = "";
        if (authorId) {
          const userRef = doc(db, "users", authorId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            authorProfile = userSnap.data().profilePicture || "";
          }
        }

        return {
          id: docSnapshot.id,
          ...bookData,
          authorProfile, // Add author profile directly to book object
        };
      }))

      setResults((prevResults: any) => {
        const existingIds = new Set(prevResults.map((book: any) => book.id));
        const newBooks = books.filter((book) => !existingIds.has(book.id));
        return [...prevResults, ...newBooks];
      });
      // Store the last document for the next pagination request
      setLastVisibleDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
  }catch(err){
    console.error("Error trying to get the recommended books.", err); 
  }
}
