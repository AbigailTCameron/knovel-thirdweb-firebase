import initializeFirebaseClient from "@/lib/initFirebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const { db } = initializeFirebaseClient();

export const fetchPublishInfo = async(userId: string, bookId: string, setChapterCount:Function, setChapters: Function, setImageUrl: Function, setTitle: Function, setBookGenres: Function, setOldSynopsis: Function, setAuthorName: Function, router:any, setImagePath: Function) => {
  try{
      // Reference to the specific draft document in the Firestore "drafts" collection
      const draftRef = doc(db, 'published', userId, 'userDrafts', bookId);

      // Fetch the document
      const draftSnap = await getDoc(draftRef);
      if (!draftSnap.exists()) {
        // If the document does not exist, redirect to the error page
        router.push(`/publisherror/${bookId}`);
        return;
      }

      setChapters(draftSnap.data().draft_chapters);
      setTitle(draftSnap.data().title);
      setBookGenres(draftSnap.data()?.genres);
      setOldSynopsis(draftSnap.data().synopsis);
      setImageUrl(draftSnap.data().book_image); 
      setAuthorName(draftSnap.data().author);
      setChapterCount(draftSnap.data().draft_chapters ? draftSnap.data().draft_chapters.length : 0); 
      setImagePath(draftSnap.data().bookPath)

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching chapter info:", error.message);
    } else {
      console.error("Error fetching chapter info:", String(error));
    }
  }
}

export const reuploadPublishedImage = async (filename: string, file: File, userId: string, oldFilePath: string, bookId: string) => {
  try {
      const storageRef = getStorage();
      const filePath = `drafts/${userId}/${filename}`;

      // Step 1: Delete the existing file if it exists
      if(oldFilePath){
        const oldFileRef = ref(storageRef, oldFilePath);
        await deleteObject(oldFileRef);
      }

      // Upload the file to Firebase Storage
      const fileRef = ref(storageRef, filePath);
      await uploadBytes(fileRef, file);

      // Step 2: Get the file's download URL
      const downloadURL = await getDownloadURL(fileRef);

      // Step 3: Update the user's Firestore profile with the new draft URL
      const bookRef = doc(db, "published", userId, "userDrafts", bookId);
      await updateDoc(bookRef, { book_image: downloadURL, bookPath: filePath });

      console.log("Book image successfully reuploaded.");
      return downloadURL;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error uploading profile image:", error.message);
    } else {
      console.error("Error uploading profile image:", String(error));
    }
  }
}

export const updatePublishGenre = async(userId: string, bookId: string, genre: string) => {
  try{
    // Step 1: Reference the specific book document
    const publishedRef = doc(db, "published", userId, "userDrafts", bookId);
    const bookRef = doc(db, "books", bookId);


    // Step 2: Fetch the book document
    const pubSnap = await getDoc(publishedRef);
    const bookSnap = await getDoc(bookRef);



    if (!pubSnap.exists()) {
      console.error("Book not found.");
      return;
    }


    if (!bookSnap.exists()) {
      console.error("Draft not found.");
      return;
    }


    // Step 3: Get the current genres array
    const pubData = pubSnap.data();
    const currentGenres = pubData?.genres || [];


    // Step 4: Check if the genre already exists
    if (currentGenres.includes(genre)) {
      console.log("Genre already exists in the book.");
      return;
    }

    // Step 5: Update the genres array using arrayUnion to avoid duplicates
    await updateDoc(publishedRef, {
      genres: arrayUnion(genre),
    });
    await updateDoc(bookRef, {
      genres: arrayUnion(genre),
    });

    console.log("Genre successfully added.");

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error updating draft genres:", error.message);
    } else {
      console.error("Error updating draft genres:", String(error));
    }
  }
}

export const removePublishGenre = async (userId: string, bookId: string, genre: string) => {
  try {
     // Step 1: Reference the specific book document
     const publishedRef = doc(db, "published", userId, "userDrafts", bookId);
     const bookRef = doc(db, "books", bookId);


     // Step 2: Fetch the book document
     const pubSnap = await getDoc(publishedRef);
     const bookSnap = await getDoc(bookRef);

 
     if (!pubSnap.exists()) {
       console.error("Book not found.");
       return;
     }

     if (!bookSnap.exists()) {
      console.error("Book not found.");
      return;
    }
 
     // Step 3: Get the current genres array
     const pubData = pubSnap.data();
     const currentGenres = pubData?.genres || [];
 
     // Step 4: Check if the genre exists in the array
     if (!currentGenres.includes(genre)) {
       console.log("Genre does not exist in the draft.");
       return;
     }

    // Step 5: Remove the genre from the array
    const updatedGenres = currentGenres.filter((item: string) => item !== genre);

    // Step 6: Update the genres array in Firestore
    await updateDoc(publishedRef, {
      genres: updatedGenres,
    });

    await updateDoc(bookRef, {
      genres: updatedGenres,
    });

    console.log("Genre successfully removed.");

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error removing draft genres:", error.message);
    } else {
      console.error("Error removing draft genres:", String(error));
    }
  }
}
