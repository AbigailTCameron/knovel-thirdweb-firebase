import initializeFirebaseClient from "@/lib/initFirebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const fetchPublishedChapterToEdit = async (userId: string, bookId: string, index: number, setContent: Function, setTitleContent: Function) => {
  try{
      // Step 1: Reference the published document
      const bookRef = doc(db, "published", userId, "userDrafts", bookId);
      const bookSnap = await getDoc(bookRef);

      if (!bookSnap.exists()) {
        throw new Error("Draft not found.");
      }
  
      // Step 2: Extract data from the published document
      const bookData = bookSnap.data();
      
      const chapter = bookData?.chapters[index];
      if (!chapter) {
        throw new Error("Chapter not found at the specified index.");
      }
  
      // Step 3: Set the chapter content and title
      setContent(chapter.content);
      setTitleContent(chapter.title);

    
  }catch(err){
    console.error(err); 
  }
}

export async function handlePublishEditChapter(titleContent: string, content: string, index:number, bookId: string, userId: string) {
  try{

    // Step 1: Reference the draft document
    const bookRef = doc(db, "published", userId, "userDrafts", bookId);
    const bookSnap = await getDoc(bookRef);

    if (!bookSnap.exists()) {
      throw new Error("Draft not found.");
    }

    // Step 2: Get the existing draft data
    const bookData = bookSnap.data();
    const bookChapters = bookData?.chapters || [];


    // Step 3: Update the specific chapter
    if (!bookChapters[index]) {
      throw new Error("Chapter not found at the specified index.");
    }
    
    bookChapters[index] = {
      ...bookChapters[index],
      title: titleContent,
      content: content,
      createdAt: new Date(), // Update the timestamp
    };

    // Step 4: Update the draft document in Firestore
    await updateDoc(bookRef, {
      chapters: bookChapters,
    });

    console.log("Book chapter updated successfully.");

  }catch(err){
    console.log("Error updating chapter info", err); 
  }
}

