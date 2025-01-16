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

export const updateRating = async (userId: string, bookId: string, rating: number | null, oldRating: number) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const bookDocRef = doc(db, "books", bookId);

    const userDoc = await getDoc(userDocRef);
    const bookDoc = await getDoc(bookDocRef);

    const bookData = bookDoc.exists() ? bookDoc.data() : {};
    const currentAverageRating: number = bookData.rating ?? 0;
    const currentRatingNums: number = bookData.rating_nums ?? 0;
    let newRatingNums = currentRatingNums;
    let newAverageRating = currentAverageRating;

    if (userDoc.exists()) {
      const currentRatings = userDoc.data()?.rated || [];

      if (rating === null) {
        // Remove the existing rating for this book
        const updatedRatings = currentRatings.filter((item: { bookId: string }) => item.bookId !== bookId);
        await updateDoc(userDocRef, { rated: updatedRatings });

        if(oldRating !== 0){
            newRatingNums = Math.max(newRatingNums - 1, 0); 
            newAverageRating = newRatingNums > 0
            ? ((currentAverageRating * currentRatingNums) - oldRating) / newRatingNums
            : 0;
        }
      } else {
        if (oldRating !== 0) {
          // Update existing rating
          newAverageRating = ((currentAverageRating * currentRatingNums) - oldRating + rating) / currentRatingNums;
        } else {
          // Add new rating          
          newRatingNums += 1;
          newAverageRating = ((currentAverageRating * currentRatingNums) + rating) / newRatingNums;
        }

        const updatedRatings = [
          ...currentRatings.filter((item: { bookId: string }) => item.bookId !== bookId),
          { bookId, rating },
        ];
        await updateDoc(userDocRef, { rated: updatedRatings });
      }
    }

    await updateDoc(bookDocRef, {
      rating: parseFloat(newAverageRating.toFixed(2)), // Ensure precision is limited to 2 decimal places
      rating_nums: newRatingNums,
    });

  } catch (error) {
    console.error("Error updating rating:", error);
  }
};
