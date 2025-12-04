import initializeFirebaseClient from "@/lib/initFirebase";
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

const { db } = initializeFirebaseClient();

export const fetchBookData = async (id : string, setBook: Function) => {
  try {
    // Reference to the specific book document in the Firestore "books" collection
    const bookRef = doc(db, 'books', id);

    // Fetch the document
    const bookSnap = await getDoc(bookRef);
    if (!bookSnap.exists()) {
      // If the document does not exist, redirect to the error page
      notFound();
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

export const fetchLiked = async (liked: string[], bookId: string, setLiked: Function) => {
  try {
      // Ensure userDetails contains a valid liked array
      const isLiked = liked.includes(bookId);

      // Update the liked state
      setLiked(isLiked);

  } catch (error) {
    console.error("Error fetching liked books:", error);
  }
  
}

export const fetchFinishedList = async (finishedList: string[], bookId: string, setFinished: Function) => {
  try {
      // Ensure userDetails contains a valid finished array
      const isFinished = finishedList.includes(bookId);

      // Update the liked state
      setFinished(isFinished);

  } catch (error) {
    console.error("Error fetching finished books:", error);
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

export const updateLikedBookData = async(userId: string, bookId: string) => {
  try {
      // Reference to the user's profile document in Firestore
      const userRef = doc(db, "users", userId);
      const bookRef = doc(db, "books", bookId);

      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) return;

      const data = userSnapshot.data();
      const likedArray: string[] = Array.isArray(data.liked) ? data.liked : [];
      const alreadyLiked = likedArray.includes(bookId);

      if (alreadyLiked) {
        // 🔻 User is unliking the book
        await Promise.all([
          updateDoc(userRef, {
            liked: arrayRemove(bookId),
          }),
          updateDoc(bookRef, {
            // total visible likes go down
            likes_total: increment(-1),
            // do NOT touch likes_30d here; it's a rolling stat recomputed from events
          }),
        ]);
      }else{
         // 🔺 User is liking the book
        await Promise.all([
          // 1) Update user’s liked array
          updateDoc(userRef, {
            liked: arrayUnion(bookId),
          }),

          // 2) Update book’s like counters
          updateDoc(bookRef, {
            likes_total: increment(1),
            likes_30d: increment(1), // optimistic bump; recompute script can later overwrite
          }),

          // 3) Log a like event for accurate 30d stats
          addDoc(collection(db, "book_events"), {
            bookId,
            userId,
            type: "like",
            timestamp: serverTimestamp(),
          }),
        ]);
      }
  }catch (error) {
    console.error("Error updating liked data:", error);
  }
}

export const updateFinishedBookData = async (userId: string, bookId: string) => {
  try{
    const userRef = doc(db, "users", userId);
    const bookRef = doc(db, "books", bookId);

    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      // if you always create user docs elsewhere, just bail out
      return;
    }

    const data = userSnapshot.data();

    // Normalize existing finished array (it may not exist yet)
    const finishedRaw = (data as any).finished;
    const finishedArray: string[] = Array.isArray(finishedRaw) ? finishedRaw : [];
    const alreadyFinished = finishedArray.includes(bookId);

    if (alreadyFinished) {
      // 🔻 User is "unfinishing" the book (if you want to allow toggle)
      await Promise.all([
        updateDoc(userRef, {
          finished: arrayRemove(bookId),
        }),
        updateDoc(bookRef, {
          finishes_total: increment(-1),
          // Do NOT decrement finishes_30d here – your scoring script
          // will recompute the true 30d total from book_events.
        }),
      ]);
    }else {
       // 🔺 User is marking this book as finished
      await Promise.all([
        // 1) Update user’s finished array
        updateDoc(userRef, {
          finished: arrayUnion(bookId), // creates the field if missing
        }),

        // 2) Update book’s finish counters
        updateDoc(bookRef, {
          finishes_total: increment(1),
          finishes_30d: increment(1), // optimistic; recompute script can overwrite later
        }),

        // 3) Log an event for accurate 30d stats
        addDoc(collection(db, "book_events"), {
          bookId,
          userId,
          type: "finish",
          timestamp: serverTimestamp(),
        }),
      ]);
    }


  }catch (error) {
    console.error("Error updating finished data:", error);
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

export const incrementBookViews = async (bookId: string | undefined) => {
  if (!bookId) return;

  try {
    const bookRef = doc(db, "books", bookId);
    await updateDoc(bookRef, {
      views: increment(+1), // Increment the views count by 1
    });
  } catch (error) {
    console.error("Error incrementing book views:", error);
  }
};
