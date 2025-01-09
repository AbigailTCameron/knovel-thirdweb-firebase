import initializeFirebaseClient from "@/lib/initFirebase";
import { arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export async function handleSubmitAnotherDraftChapter(
  userId: string, 
  draftId: string,
  titleContent: string,
  content: string,
  setError: Function
) {
  try {
    // Reference the draft document
    const draftRef = doc(db, "drafts", userId, "userDrafts", draftId);

    // Create the new chapter object
    const newChapter = {
      title: titleContent,
      content: content,
      createdAt: new Date(), // Firestore server timestamp
      completed: false,
    };

    // Use arrayUnion to add the new chapter to the `draft_chapters` field
    await updateDoc(draftRef, {
      draft_chapters: arrayUnion(newChapter),
    });

    console.log("Chapter added successfully!");
    return draftId; // Return the draft ID so you can navigate back
  } catch (err) {
    console.error("Error submitting another chapter:", err);
    setError("An error occurred while submitting the chapter.");
    return null;
  }
}


export async function handleUpdateAnotherPublishChapter(bookId: string, titleContent: string, content: string, setError: Function, userId: string) {

  try {
    // Append the new chapter
    const newChapter = {
      title: titleContent,
      content: content,
      createdAt: new Date(),
      completed: false
    };

      // Reference to the specific book document in Firestore
      const bookRef = doc(db, "published", userId, "userDrafts", bookId); 


      // Update the book's chapters array by adding the new chapter
      await updateDoc(bookRef, {
        chapters: arrayUnion(newChapter) // Append the new chapter to the chapters array
      });

      return bookId; 

  }catch(err){
    console.error("Error submitting another chapter:", err);
    setError("An error occurred while submitting the chapter.");
    return null;
  }
 
}