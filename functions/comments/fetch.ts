import initializeFirebaseClient from "@/lib/initFirebase";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, increment, setDoc, updateDoc } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const fetchbookComments = async (authorId: string, bookId: string, setComments: Function) => {
  try{
    // Reference to the specific comment in the Firestore "comments" collection
    const commentsCollectionRef = collection(db, 'comments', authorId, 'books', bookId, 'comments');

    const querySnapshot = await getDocs(commentsCollectionRef);

    // Map the documents to extract data
    const comments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setComments(comments);
    return { success: true };

  }catch(err){
    console.error("Error fetching comments", err); 
  }
}

export const createNotification = async (
  recipientId: string,
  bookId: string,
  commentId: string,
  commenterId: string,
  commentText: string
): Promise<{ success: boolean }> => {
  try {
    const notificationRef = doc(db, "notifications", `${bookId}_${commentId}`);
    const notificationMessage = `Your book received a new comment: "${commentText.substring(0, 50)}..."`;

    await setDoc(notificationRef, {
      recipientId,
      bookId,
      commentId,
      commenterId,
      message: notificationMessage,
      createdAt: new Date().toISOString(),
      isRead: false,
    });

    return { success: true };
  } catch (err) {
    console.error("Error creating notification:", err);
    return { success: false };
  }
};

export const addComment = async(authorId:string, bookId: string, userId: string, comment: string, title: string) => {
  try {
    //const commentId = crypto.randomUUID();

    const newComment = {
      commenter: userId,
      comment: comment,
      createdAt: new Date().toISOString(),
      likes: [], // Initialize an empty array for storing user IDs who liked the comment
      likeCount: 0,
    };

    // Reference to the collection where the comment should be added
    const userBookCommentCollectionRef = collection(db, "comments", authorId, 'books', bookId, 'comments');
    const docRef = await addDoc(userBookCommentCollectionRef, newComment);

    // Create a notification for the book author
    const notificationResult = await createNotification(authorId, bookId, docRef.id, userId, comment);

    if (!notificationResult.success) {
      console.warn("Failed to create notification.");
    }

    return { success: true, commentId: docRef.id };

  }catch(err){
    console.error("Error trying to add comments", err); 
    return { success: false };
  }
}


export const fetchCommenterImageAndName = async(commenterId: string, setProfileUrl: Function, setUsername: Function, setFullName: Function) => {
  try{
      // Reference to the commenter's document in the 'users' collection
      const userDocRef = doc(db, "users", commenterId);

      // Fetch the user's document
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
  
        // Extract fields from the document
        const { profilePicture, username, name } = userData;
  
        // Set the fetched values in state
        setProfileUrl(profilePicture);
        setUsername(username);
        setFullName(name);
      } else {
        console.error("Commenter not found in Firestore.");
      }

  }catch(err){
    console.error("Error fetching commenter's info", err); 
  }
}


export const fetchLikesCount = async (authorId: string, bookId: string, commentId: string, userId: string, setLiked: Function) => {
  try {
    const commentRef = doc(db, "comments", authorId, "books", bookId, "comments", commentId);
    const commentSnapshot = await getDoc(commentRef);
    
    if (commentSnapshot.exists()) {
      const data = commentSnapshot.data();

      const liked = data?.likes?.includes(userId);
      setLiked( liked || false);

      return data.likeCount || (data.likes ? data.likes.length : 0); // Fallback to array length if `likeCount` isn't used
    } else {
      console.error("Comment not found.");
      return 0;
    }
  } catch (err) {
    console.error("Error fetching likes count:", err);
    return 0;
  }
};



export const toggleLikeComment = async (authorId: string, bookId: string, commentId: string, userId: string) => {
  try {
    const commentRef = doc(db, "comments", authorId, "books", bookId, "comments", commentId);
    const commentSnapshot = await getDoc(commentRef);

    let liked;
    if (commentSnapshot.exists()) {
      const data = commentSnapshot.data();
      if(data.likes.includes(userId)){
          await updateDoc(commentRef, {
            likes: arrayRemove(userId),
            likeCount: increment(-1), 
          });
          liked = false;
      }else {
          await updateDoc(commentRef, {
            likes: arrayUnion(userId),
            likeCount: increment(1), 
          });
          liked = true;
      }
    }
  
    return { success: true, liked };

  } catch (err) {
    console.error("Error liking comment:", err);
    return { success: false, liked: false };
  }
  
};

export const deleteComment = async (authorId: string, bookId: string, commentId: string): Promise<{ success: boolean }> => {
  try {
    // Step 1: Delete the comment document
    const commentRef = doc(db, "comments", authorId, "books", bookId, "comments", commentId);
    await deleteDoc(commentRef);

    return { success: true };
  } catch (err) {
    console.error("Error deleting comment:", err);
    return { success: false };
  }
};