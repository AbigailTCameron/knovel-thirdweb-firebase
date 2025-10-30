import initializeFirebaseClient from "@/lib/initFirebase";
import { arrayUnion, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { pinata } from "../../utils/config";
import { getContract, prepareContractCall, sendTransaction, toUnits } from "thirdweb";
import { client, personalAccount } from "@/lib/client";
import { smartWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb/chains";
import {generateKeywords} from "../helper-utils";

const { db } = initializeFirebaseClient();

export const fetchPublishInfo = async(userId: string, bookId: string, setChapterCount:Function, setChapters: Function, setImageUrl: Function, setTitle: Function, setBookGenres: Function, setOldSynopsis: Function, router:any, setImagePath: Function, setIpfsHash: Function, setBytesId: Function, setCreated: Function) => {
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
      setChapterCount(draftSnap.data().chapters ? draftSnap.data().chapters.length : 0); 
      setImagePath(draftSnap.data().bookPath);
      setIpfsHash(draftSnap.data().hash);
      setBytesId(draftSnap.data().bytesId);
      setCreated(draftSnap.data().created_at);
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

const smartContractConfig = async(personalAccount: any) => {

  // Configure the smart wallet
  const wallet = smartWallet({
    chain: defineChain(123420001114),
    sponsorGas: true,
  });

  // Connect the smart wallet
  const smartAccount = await wallet.connect({
    client,
    personalAccount,
  });

  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(123420001114),
    address: "0x0016404CCCf31605294dD86c1c39e65B4D882c82",
  });

  return {contract, smartAccount}
}

export const deleteEntireBook = async(userId: string, bookId: string, imageFilePath: string, hash: string, bytesId: `0x${string}`, account: any) => {
  try{
    await pinata.unpin([hash]); 

    // Step 1: Reference the book document and delete it
    const publishedRef = doc(db, "published", userId, "userDrafts", bookId);
    const bookRef = doc(db, "books", bookId);

    await deleteDoc(publishedRef);
    await deleteDoc(bookRef);

    // Step 2: Update the user's books array in their profile
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

    // Step 3: Delete the book image from Firebase Storage if it exists
    if (imageFilePath) {
      const storageRef = getStorage();
      const imageRef = ref(storageRef, imageFilePath);
      await deleteObject(imageRef);
    }

    const {contract, smartAccount} = await smartContractConfig(account);  

     const transaction = await prepareContractCall({
      contract,
      method: "function deleteBook(bytes32 _bookId)",
      params: [bytesId],
    });
    await sendTransaction({
      transaction,
      account: smartAccount,
    });

    return true;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting book:", error.message);
      return false;
    } else {
      console.error("Error deleting book:", String(error));
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
    const draftChapters = bookData?.chapters || [];

    if (chapterIndex < 0 || chapterIndex >= draftChapters.length) {
      console.error("Invalid chapter index");
      return;
    }

    // Step 4: Update the completed status of the specific chapter
    draftChapters[chapterIndex].completed = newCompleted;

    // Step 5: Update the draft_chapters field in Firestore
    await updateDoc(bookRef, { chapters: draftChapters });
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

export const editPublishTitle = async(userId: string, title: string, bookId: string) => {
  try{
      // Step 1: Reference the draft document
      const pubRef = doc(db, "published", userId, "userDrafts", bookId);

      // Step 2: Fetch the pub data
      const pubSnap = await getDoc(pubRef);

      if (!pubSnap.exists()) {
        console.error("Book not found");
        return;
      }

      await updateDoc(pubRef, { title: title });

  }catch(err){
    console.error("Error encountered", err);
  }
}

export const reuploadBookImage = async (filename: string, file: File, userId: string, oldFilePath: string, bookId: string) => {
  try {
      const storageRef = getStorage();
      const filePath = `books/${userId}/${filename}`;

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

      // Step 3: Update the user's Firestore profile with the new book URL
      const bookRef = doc(db, "published", userId, "userDrafts", bookId);
      const pubRef = doc(db, "books", bookId);

      await updateDoc(bookRef, { book_image: downloadURL, bookPath: filePath });
      await updateDoc(pubRef, { book_image: downloadURL, bookPath: filePath });


      console.log("Book image successfully reuploaded.");
      return downloadURL;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error uploading book image:", error.message);
    } else {
      console.error("Error uploading book image:", String(error));
    }
  }
}

const reuploadEpub = async (chapters: any[], title: string, author_name: string, imageFile:string, book_synopsis: string) => {
  const chapterContents = chapters.map((chapter) => ({
    title: chapter.title,
    content: chapter.content, // Assuming you have chapter content
  }));

  // Create EPUB options
  const options = {
    title: title, 
    author: author_name,
    publisher: "Knovel Protocol",
    content: chapterContents, 
    cover: imageFile,
    description: book_synopsis,
    language: "en", 
    css: `
      body { font-family: Baskerville, monospace; font-size: 16px; }
      h1 { color: #333; }
    `, 
  };
  try {
    const response = await fetch('/api/generateEpub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ options }),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to generate EPUB file.');
    }

    const data = await response.json();

    // Make sure the base64Epub string is returned
    if (data.base64Epub) {
      // Handle the base64 string - e.g., create a Blob from it
      const base64Epub = data.base64Epub;

      if (typeof base64Epub !== 'string' || !base64Epub.match(/^[A-Za-z0-9+/=]*$/)) {
        throw new Error("Invalid base64 string.");
      }

      // Convert base64 to a Blob and then a File object
      const epubBlob = new Blob([Uint8Array.from(atob(base64Epub), (c) => c.charCodeAt(0))], {
        type: "application/epub+zip",
      });

      const epubFile = new File([epubBlob], `${title}.epub`, {
        type: 'application/epub+zip',
      });

      return epubFile;
    } else {
      throw new Error('No base64Epub returned from the server.');
    }
  } catch (error) {
    console.error('Error creating EPUB:', error);
    throw new Error('Error creating EPUB file.');
  }
}

export async function rePublishtoSmartContract(userId: string, title: string, author_name: string, ipfsHash: string, book_synopsis: string, genres: string[], chapters: any[], bytesId: `0x${string}`, bookId: string, publishedCount: number, account: any) {
  try{

    const {contract, smartAccount} = await smartContractConfig(account); 

    const transaction = await prepareContractCall({
      contract,
      method:
      "function updateBookInfo(bytes32 _bookId, string _newTitle, string _newIpfsHash, uint256 _newPrice)",
      params: [bytesId, title, ipfsHash, toUnits("0", 18)],
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account: smartAccount,
    });
    

    await rePushToBooks(userId, author_name, title, book_synopsis, genres, ipfsHash, transactionHash, chapters, bookId, publishedCount);
    
  }catch(err){
    console.error("Error trying to call public registry smart contract", err);
  }
}

export async function rePushToBooks(
  userId: string,
  author_name: string,
  title: string,
  synopsis: string,
  genres: string[],
  cid: string,
  txhash: string,
  chapters: any[],
  bookId: string,
  publishedCount: number
) {
  try {
    // Reference to the book document in the `books` collection
    const bookRef = doc(db, "books", bookId);
    const publishRef = doc(db, "published", userId, "userDrafts", bookId);

    // Update the book's information
    await updateDoc(bookRef, {
      author: author_name,
      title,
      synopsis,
      genres,
      hash: cid,
      txhash,
      search_keywords: generateKeywords(title, author_name),
    });


    // Mark all chapters as published
    const updatedChapters = chapters.map((chapter, i) => ({
      ...chapter,
      published: i < publishedCount ? true : Boolean(chapter.published),
    }));


    // Update the `draft_chapters` field in the publish document
    await updateDoc(publishRef, {
      chapters: updatedChapters,
    });

  } catch (error) {
    console.error("Error updating books and drafts in Firestore:", error);
    throw new Error("Failed to push book and chapters to Firestore.");
  }
}



export const updateUploadEpub = async(
  title: string, 
  author_name: string, 
  book_synopsis: string, 
  chapters: any[],
  selectedChapters: any[],
  userId: string,
  genres: string[],
  imageFile: string,
  ipfsHash: string,
  bytesId: `0x${string}`,
  bookId: string,
  publishedCount: number,
  account: any
): Promise<boolean> => {
  try{

    const epubFile = await reuploadEpub(selectedChapters, title, author_name, imageFile, book_synopsis); 
    await pinata.unpin([ipfsHash]);
    const response = await pinata.upload.file(epubFile);

    await rePublishtoSmartContract(userId, title, author_name, response.IpfsHash, book_synopsis, genres, chapters, bytesId, bookId, publishedCount, account);
    return true;
  }catch(err){
    console.error("Error trying to convert book info to epub", err); 
    return false;
  }
}


 


