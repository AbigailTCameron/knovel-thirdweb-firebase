import initializeFirebaseClient from "@/lib/initFirebase";
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { pinata } from "../../utils/config";
import { client } from "@/lib/client";
import { eth_getTransactionReceipt, getContract, getContractEvents, getRpcClient, prepareContractCall, prepareEvent, sendTransaction, toUnits } from "thirdweb";
import { smartWallet } from "thirdweb/wallets";
//import { personalAccount } from "@/lib/client";
import { defineChain } from "thirdweb/chains";
import {generateKeywords} from "../helper-utils";


const { db } = initializeFirebaseClient();

export const fetchDraftInfo = async (userId: string, setDrafts: Function) => {
  try {
      // Step 1: Reference the drafts collection for the user
      const draftsCollection = collection(db, "drafts", userId, "userDrafts");

      // Step 2: Fetch all drafts for the user
      const draftQuery = query(draftsCollection); 
      const draftSnapshot = await getDocs(draftQuery);

      // Step 3: Map over the results to format the draft data
      const drafts = draftSnapshot.docs.map((doc) => ({
        draftId: doc.id,
        ...doc.data(),
      }));

      // Step 4: Update state with fetched drafts
     setDrafts(drafts);
  }catch(error){
    if (error instanceof Error) {
      console.error("Error fetching drafts:", error.message);
    } else {
      console.error("Error fetching drafts:", String(error));
    }
  }
}


export const reuploadBookImageToSupabase = async (filename: string, file: File, userId: string, oldFilePath: string, draftId: string) => {
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

      // Step 3: Update the user's Firestore profile with the new draft URL
      const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);
      await updateDoc(draftRef, { book_image: downloadURL, bookPath: filePath });

      console.log("Draft image successfully reuploaded.");
      return { downloadURL, filePath };

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error uploading profile image:", error.message);
    } else {
      console.error("Error uploading profile image:", String(error));
    }
  }
}



export const fetchChapterInfo = async(userId: string, draftId: string, setChapterCount:Function, setChapters: Function, setImageUrl: Function, setTitle: Function, setBookGenres: Function, setOldSynopsis: Function, setAuthorName: Function, router:any, setImagePath: Function, setCreated: Function) => {
  try{
      // Reference to the specific draft document in the Firestore "drafts" collection
      const draftRef = doc(db, 'drafts', userId, 'userDrafts', draftId);

      // Fetch the document
      const draftSnap = await getDoc(draftRef);
      if (!draftSnap.exists()) {
        // If the document does not exist, redirect to the error page
        router.push(`/drafterror/${draftId}`);
        return;
      }

      setChapters(draftSnap.data().draft_chapters);
      setTitle(draftSnap.data().title);
      setBookGenres(draftSnap.data()?.genres);
      setOldSynopsis(draftSnap.data().synopsis);
      setImageUrl(draftSnap.data().book_image); 
      setAuthorName(draftSnap.data().author);
      setChapterCount(draftSnap.data().draft_chapters ? draftSnap.data().draft_chapters.length : 0); 
      setImagePath(draftSnap.data().bookPath);
      setCreated(draftSnap.data().created_at);

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching chapter info:", error.message);
    } else {
      console.error("Error fetching chapter info:", String(error));
    }
  }
}

export const updateDraftGenre = async(userId: string, draftId: string, genre: string) => {
  try{
    // Step 1: Reference the specific draft document
    const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);

    // Step 2: Fetch the draft document
    const draftSnap = await getDoc(draftRef);


    if (!draftSnap.exists()) {
      console.error("Draft not found.");
      return;
    }

    // Step 3: Get the current genres array
    const draftData = draftSnap.data();
    const currentGenres = draftData?.genres || [];


    // Step 4: Check if the genre already exists
    if (currentGenres.includes(genre)) {
      console.log("Genre already exists in the draft.");
      return;
    }

    // Step 5: Update the genres array using arrayUnion to avoid duplicates
    await updateDoc(draftRef, {
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

export const removeDraftGenre = async (userId: string, draftId: string, genre: string) => {
  try {
     // Step 1: Reference the specific draft document
     const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);

     // Step 2: Fetch the draft document
     const draftSnap = await getDoc(draftRef);
 
     if (!draftSnap.exists()) {
       console.error("Draft not found.");
       return;
     }
 
     // Step 3: Get the current genres array
     const draftData = draftSnap.data();
     const currentGenres = draftData?.genres || [];
 
     // Step 4: Check if the genre exists in the array
     if (!currentGenres.includes(genre)) {
       console.log("Genre does not exist in the draft.");
       return;
     }

    // Step 5: Remove the genre from the array
    const updatedGenres = currentGenres.filter((item: string) => item !== genre);

    // Step 6: Update the genres array in Firestore
    await updateDoc(draftRef, {
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

export const editDraftTitle = async (userId: string, draftId: string, title:string) => {
  try {
    // Step 1: Reference the specific draft document
    const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);

    // Step 2: Fetch the draft document
    const draftSnap = await getDoc(draftRef);

    if (!draftSnap.exists()) {
      console.error("Draft not found.");
      return;
    }

    // Step 6: Update the genres array in Firestore
    await updateDoc(draftRef, {
      title: title,
    });

    return;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error editing title:", error.message);
    } else {
      console.error("Error editing title:", String(error));
    }
  }
}


export const deleteEntireDraft = async(userId: string, draftId: string, imageFilePath: string) => {
  try{
    // Step 1: Reference the draft document and delete it
    const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);
    await deleteDoc(draftRef);

    // Step 2: Update the user's drafts array in their profile
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User profile not found.");
      return false;
    }

    const userData = userSnap.data();
    const currentDrafts = userData?.drafts || [];
    const updatedDrafts = currentDrafts.filter((id: string) => id !== draftId);

    await updateDoc(userRef, {
      drafts: updatedDrafts,
    });

    // Step 3: Delete the book image from Firebase Storage if it exists
    if (imageFilePath) {
      const storageRef = getStorage();
      const imageRef = ref(storageRef, imageFilePath);
      await deleteObject(imageRef);
    }
    return true;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting draft:", error.message);
      return false;
    } else {
      console.error("Error deleting draft:", String(error));
      return false;
    }
  }
}

export const deleteDraftChapter = async(userId: string, draftId: string, index: number) => {
  try{
    const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);
    const snap = await getDoc(draftRef);
    if (!snap.exists()) throw new Error("Draft not found");

    const data = snap.data();
    const chapters: any[] = data?.draft_chapters ?? [];

    // remove the chapter at index
    const next = chapters.filter((_, i) => i !== index);
    await updateDoc(draftRef, { draft_chapters: next });
  }catch (error) {
   
    console.error("Error deleting chapter:", error);
  }
}

export const deleteDraft = async(userId: string, draftId: string, imageFilePath: string) => {
  try{
    // Step 1: Reference the draft document and delete it
    const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);
    await deleteDoc(draftRef);

    // Step 2: Update the user's drafts array in their profile
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User profile not found.");
      return false;
    }

    const userData = userSnap.data();
    const currentDrafts = userData?.drafts || [];
    const updatedDrafts = currentDrafts.filter((id: string) => id !== draftId);

    await updateDoc(userRef, {
      drafts: updatedDrafts,
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


export const uploadEpub = async(userId: string, genres: string[], chapters: any[], publishedChapters: any[], title: string, author: string, synopsis: string, bookCoverPath: string, draftId: string, imageUrl: string, publishedCount: number, account: any) => {
  try{
    const epubFile = await createEpubFile(publishedChapters, title, author, synopsis, imageUrl); 
    const response = await pinata.upload.file(epubFile);
    await publishtoSmartContract(title, author, response.IpfsHash, userId, synopsis, genres, draftId, chapters, bookCoverPath, imageUrl, publishedCount, account);

    return true;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error publishing draft:", error.message);
      return false;
    } else {
      console.error("Error publishing draft:", String(error));
      return false;
    }
  }
}

export const createEpubFile = async(chapters: any[], title: string, author_name: string, book_synopsis: string, imageUrl:string) => {
  const chapterContents = chapters.map((chapter) => ({
    title: chapter.title,
    content: chapter.content,
  }));

  // Create EPUB options
  const options = {
    title: title, 
    author: author_name,
    publisher: "Knovel Protocol",
    content: chapterContents, 
    cover: imageUrl,
    description: book_synopsis,
    language: "en", 
    css: `
      body { font-family: Baskerville, monospace; font-size: 16px; }
      h1 { color: #333; }
    `, 
  };
    // Make a POST request to the API to generate the EPUB
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
    address: "0xaBfD0aB24F4291725627a6FDb9267f32b2a93d8C",
  });

  return {contract, smartAccount}
}

export async function publishtoSmartContract(title: string, author: string, ipfsHash: string, userId: string, synopsis: string, genres: string[], draftId: string, chapters: any[], imageFilePath: string, bookUrl: string, publishedCount: number, account: any) {
  try{
    const {contract, smartAccount} = await smartContractConfig(account); 

    const transaction = await prepareContractCall({
      contract,
      method:
      "function publishBook(string _title, string _author, string _ipfsHash, address author_addr, uint256 _price)",
      params: [title, author, ipfsHash, userId, toUnits("0", 18)],
    });

    const { transactionHash } = await sendTransaction({
      transaction,
      account: smartAccount,
    });


    const rpcRequest = getRpcClient({ 
      client, 
      chain: defineChain(123420001114)
    });

    const transactionReceipt = await eth_getTransactionReceipt(
      rpcRequest,
      {
        hash: transactionHash,
      },
    );

    const preparedEvent = prepareEvent({
      signature:
        "event BookRegistered(bytes32 indexed bookId, string title, string author, address author_addr, string ipfsHash, uint256 price)",
    });

    const events = await getContractEvents({
      contract,
      events: [preparedEvent],
      blockHash: transactionReceipt.blockHash
    });
    

    let bookId = events[0].args.bookId;
  

    if (!bookId) {
      throw new Error("BookRegistered event not found in transaction logs.");
    }

    await pushToBooks(userId, author, title, synopsis, genres, ipfsHash, transactionHash, bookId, draftId, chapters, imageFilePath, bookUrl, publishedCount);
    
  }catch(err){
    console.error("Error trying to call public registry smart contract", err);
  }
}

export async function uploadBookImageToFirebase(file: File | null, userId: string, filename: string) {
  try {
    if(file){
      const storage = getStorage();
      const filePath = `drafts/${userId}/${filename}`;

      // Upload the file to Firebase Storage
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      return { downloadURL, filePath };
    }else {
      return {};
    }
  
  } catch (error) {
    console.error('Error uploading image:', error);
    return {};
  }
}

export async function pushToBooks(userId: string, name: string, title: string, synopsis: string, genres: string[], cid: string, txhash:string, bookId: string, draftId: string, chapters: any[], imageFilePath: string, bookUrl: string, publishedCount: number){
  try{
      // Step 1: Generate a Firestore auto ID
      const booksCollection = collection(db, "books");
      const bookRef = doc(booksCollection); // Generate a unique draft ID
      const book_id = bookRef.id;

      // Step 1: Create books data
      const draftData = {
        authorId: userId,
        author: name,
        title,
        book_image: bookUrl || '',
        bookPath: imageFilePath || '',
        bytesId: bookId,
        created_at: serverTimestamp(),
        synopsis,
        genres,
        rating: 0,
        txhash: txhash,
        hash: cid,
        search_keywords: generateKeywords(title, name),
        verified: false,
        views: 0,
        price: 0,
        currency: "ETH"
      };

      // Step 2: Save draft data to Firestore
      await setDoc(bookRef, draftData);

      // Step 3: Update the user's profile with the draft ID
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User profile not found.');
        return;
      }
  
      await updateDoc(userRef, {
        published: arrayUnion(book_id), // Add the new draft ID to the user's drafts array
      });


      // Map over the chapters and add `published: "true"` to each chapter object
      const updatedChapters = chapters.map((chapter, i) => ({
        ...chapter,
        published: i < publishedCount ? true : Boolean(chapter.published) // keep prior truthy if you support re-publish
      }));


      // Step 2: Generate a Firestore auto ID
      const publishedCollection = collection(db, "published", userId, "userDrafts");
      const publishedDocRef = doc(publishedCollection, book_id); // Use book_id as the document ID

      await setDoc(publishedDocRef, {
        book_id,
        title: title,
        chapters: updatedChapters,
        created_at: serverTimestamp(),
        synopsis: synopsis,
        genres: genres,
        book_image: bookUrl || '',
        bookPath: imageFilePath || '',
        hash: cid,
        bytesId: bookId
      });
      

      await deleteDraft(userId, draftId, imageFilePath);
      
      return true;

  }catch(error){
    console.error("Error pushing drafts to publish books tables", error);
  }
}

export const updateCompletedChapter = async(userId: string, draftId: string, chapterIndex: number, newCompleted: boolean) => {
  try{
    // Step 1: Reference the draft document
    const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);

    // Step 2: Fetch the draft data
    const draftSnap = await getDoc(draftRef);

    if (!draftSnap.exists()) {
      console.error("Draft not found");
      return;
    }

    const draftData = draftSnap.data();

    if (!draftData || !draftData.draft_chapters) {
      console.error("Draft chapters not found");
      return;
    }

    // Step 3: Update the completion status of the specific chapter
    const draftChapters = [...draftData.draft_chapters]; // Create a copy of the chapters array
    if (chapterIndex < 0 || chapterIndex >= draftChapters.length) {
      console.error("Invalid chapter index");
      return;
    }

    draftChapters[chapterIndex] = {
      ...draftChapters[chapterIndex],
      completed: newCompleted,
    };

    // Step 4: Update the draft document with the modified chapters
    await updateDoc(draftRef, { draft_chapters: draftChapters });

    console.log("Chapter completion status updated successfully");
  }catch(error){
    console.error("Error updating chapters:", error);
  }
}


export const editDraftSynopsis = async(userId: string, draftId: string, synopsis: string) => {
  try{

     // Step 1: Reference the draft document
     const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);

     // Step 2: Fetch the draft data
     const draftSnap = await getDoc(draftRef);
 
     if (!draftSnap.exists()) {
       console.error("Draft not found");
       return;
     }

    // Step 4: Update the draft document with the modified chapters
    await updateDoc(draftRef, { synopsis: synopsis });


  }catch(err){
    console.error("Error encountered", err); 
  }
}