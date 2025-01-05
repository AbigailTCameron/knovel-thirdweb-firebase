import initializeFirebaseClient from "@/lib/initFirebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const fetchChapterToEdit = async (userId: string, draftId: string, index: number, setContent: Function, setTitleContent: Function) => {
  try{
     // Step 1: Reference the draft document
     const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);
     const draftSnap = await getDoc(draftRef);

     if (!draftSnap.exists()) {
      throw new Error("Draft not found.");
    }

    // Step 2: Extract data from the draft document
    const draftData = draftSnap.data();

    const chapter = draftData?.draft_chapters[index];
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

export async function handleEditChapter(userId: string, titleContent: string, content: string, index:number, draftId: string) {
  try{

      // Step 1: Reference the draft document
      const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);
      const draftSnap = await getDoc(draftRef);
  
      if (!draftSnap.exists()) {
        throw new Error("Draft not found.");
      }
  
      // Step 2: Get the existing draft data
      const draftData = draftSnap.data();
      const draftChapters = draftData?.draft_chapters || [];
  
      // Step 3: Update the specific chapter
      if (!draftChapters[index]) {
        throw new Error("Chapter not found at the specified index.");
      }
      
      draftChapters[index] = {
        ...draftChapters[index],
        title: titleContent,
        content: content,
        createdAt: new Date(), // Update the timestamp
      };
  
      // Step 4: Update the draft document in Firestore
      await updateDoc(draftRef, {
        draft_chapters: draftChapters,
      });

      console.log("Draft chapter updated successfully.");

  }catch(err){
    console.log("Error updating chapter info", err); 
  }
}