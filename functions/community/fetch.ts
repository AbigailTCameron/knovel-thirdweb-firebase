import initializeFirebaseClient from "@/lib/initFirebase";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, increment, or, query, updateDoc, where } from "firebase/firestore";

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


export const updateFollowList = async(userId: string, user: string) => {
  try {
      // Reference to the user's profile document in Firestore
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);

      const userLikeRef = doc(db, "users", user);
      const userLikeSnapshot = await getDoc(userLikeRef);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        const following = data.following || [];

        if(following.includes(user)){
            await updateDoc(userRef, {
              following: arrayRemove(user),
            });

            await updateDoc(userLikeRef, {
              followerCount: increment(-1), 
            });


        }else {
            await updateDoc(userRef, {
              following: arrayUnion(user),
            });

            await updateDoc(userLikeRef, {
              followerCount: increment(1), 
            });
        }
      }
  }catch (error) {
    console.error("Error updating follow list:", error);
  }
}