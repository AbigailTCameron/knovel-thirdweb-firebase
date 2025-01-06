import initializeFirebaseClient from "@/lib/initFirebase";
import { arrayUnion, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { pinata } from "../../utils/config";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { contract, personalAccount } from "@/lib/server";
import { client } from "@/lib/client";
import { smartWallet } from "thirdweb/wallets";
import { arbitrumSepolia } from "thirdweb/chains";

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

      setChapters(draftSnap.data().chapters);
      setTitle(draftSnap.data().title);
      setBookGenres(draftSnap.data()?.genres);
      setOldSynopsis(draftSnap.data().synopsis);
      setImageUrl(draftSnap.data().book_image); 
      setAuthorName(draftSnap.data().author);
      setChapterCount(draftSnap.data().chapters ? draftSnap.data().chapters.length : 0); 
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

export const deleteEntireBook = async(userId: string, bookId: string, imageFilePath: string, hash: string, bytesId: `0x${string}`) => {
  try{
    await pinata.unpin([hash]); 

    console.log("Do i reach here?")
    // Step 1: Reference the book document and delete it
    const publishedRef = doc(db, "published", userId, "userDrafts", bookId);
    const bookRef = doc(db, "books", bookId);

    await deleteDoc(publishedRef);
    await deleteDoc(bookRef);
    console.log("Book deleted successfully:", bookId);

    // Step 2: Update the user's drafts array in their profile
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User profile not found.");
      return false;
    }

    const userData = userSnap.data();
    const currentBooks = userData?.published || [];
    const updatedBooks = currentBooks.filter((id: string) => id !== bookId);

    await updateDoc(userRef, {
      published: updatedBooks,
    });

    console.log("User drafts array updated successfully.");

    // Step 3: Delete the book image from Firebase Storage if it exists
    if (imageFilePath) {
      const storageRef = getStorage();
      const imageRef = ref(storageRef, imageFilePath);
      await deleteObject(imageRef);
      console.log("Book image deleted successfully:", imageFilePath);
    }

    // Configure the smart wallet
    const wallet = smartWallet({
      chain: arbitrumSepolia,
      sponsorGas: true,
    });

    // Connect the smart wallet
    const smartAccount = await wallet.connect({
      client,
      personalAccount,
    });

     const transaction = await prepareContractCall({
      contract,
      method: "function deleteBook(bytes32 _bookId)",
      params: [bytesId],
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account: smartAccount,
    });

    return true;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting drafr:", error.message);
      return false;
    } else {
      console.error("Error deleting draft:", String(error));
      return false;
    }
  }
}

export async function updateCompletedBookChapter(userId: string, bookId: string, chapterIndex: number, newCompleted: boolean) {
  try{
    // Step 1: Reference the book document in Firestore
    const bookRef = doc(db, "published", userId, "userDrafts", bookId);
    const bookSnap = await getDoc(bookRef);

    // Step 2: Check if the document exists
    if (!bookSnap.exists()) {
      console.error("Book not found");
      return;
    }


    // Step 3: Retrieve the draft_chapters field
    const bookData = bookSnap.data();
    const draftChapters = bookData?.draft_chapters || [];

    if (chapterIndex < 0 || chapterIndex >= draftChapters.length) {
      console.error("Invalid chapter index");
      return;
    }

    // Step 4: Update the completed status of the specific chapter
    draftChapters[chapterIndex].completed = newCompleted;

    // Step 5: Update the draft_chapters field in Firestore
    await updateDoc(bookRef, { draft_chapters: draftChapters });
    console.log("Chapter completion status updated successfully");

  }catch(err){
    console.error("Error encountered:", err); 
  }
}


export const editBookSynopsis = async(userId: string, draftId: string, synopsis: string) => {
  try{

     // Step 1: Reference the draft document
     const pubRef = doc(db, "published", userId, "userDrafts", draftId);
     const bookRef = doc(db, "books", draftId);

     // Step 2: Fetch the draft data
     const draftSnap = await getDoc(bookRef);
 
     if (!draftSnap.exists()) {
       console.error("Draft not found");
       return;
     }

    // Step 4: Update the draft document with the modified chapters
    await updateDoc(pubRef, { synopsis: synopsis });
    await updateDoc(bookRef, { synopsis: synopsis });



  }catch(err){
    console.error("Error encountered", err); 
  }
}
