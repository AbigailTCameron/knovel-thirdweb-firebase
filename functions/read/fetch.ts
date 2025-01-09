import initializeFirebaseClient from "@/lib/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { pinata } from "../../utils/config";
import ePub, { NavItem, type Rendition } from 'epubjs';


const { db } = initializeFirebaseClient();

export const fetchBookInfo = async (id: string, router: any, setChapters: Function, setBook: Function, setMetadata: Function, setAuthorId: Function) => {
  try{
    // Reference to the specific book document in the Firestore "books" collection
    const bookRef = doc(db, 'books', id);

    // Fetch the document
    const bookSnap = await getDoc(bookRef);
    if (!bookSnap.exists()) {
      // If the document does not exist, redirect to the error page
      router.push(`/bookerror/${id}`);
      return;
    }

    const hash = bookSnap.data().hash;
    if(hash) {
      const fileData = await pinata.gateways.get(hash); 
      if (!fileData || !fileData.data) {
        return ("File not found");
      } 
      const response = fileData.data instanceof Blob  ? fileData.data : new Blob([JSON.stringify(fileData.data)], { type: "application/zip" });
      if (!response) throw new Error('Failed to load the EPUB');

      setAuthorId(bookSnap.data().authorId); 
      await fetchEpub(response, setChapters, setBook, setMetadata); 
    }
  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }
}

async function fetchEpub(response:any, setChapters: Function, setBook: Function, setMetadata: Function) {
  try {
    const arrayBuffer = await response.arrayBuffer();
    const epubBook = ePub(arrayBuffer); 

    // Wait for the book to fully load
    await epubBook.loaded.navigation;
    await epubBook.ready;
    await epubBook.loaded.spine;

    // Set Book Metadata
    const metadata = await epubBook.loaded.metadata;
    setMetadata(metadata);

    // Set Chapter Info (TOC from epubjs directly)
    const toc = epubBook.navigation ? epubBook.navigation.toc : [];
    if (toc && toc.length > 0) {
      const chapters = toc.map((item: NavItem) => ({
        title: item.label, // Title of the chapter
        href: item.href,   // The href to the chapter (relative path)
      }));
      setChapters(chapters); // Set chapters in your state
    } else {
      console.log('No TOC found in the EPUB');
    }
  
    setBook(epubBook); // Store the book

  } catch (error) {
    console.error('Error fetching or processing EPUB:', error);
  }
}

const calculateFontSize = (screenWidth: number) => {  
  // Adjust font size based on screen width (e.g., responsive scaling)
  if (screenWidth < 480) return "14px"; // Mobile
  if (screenWidth < 768) return "16px"; // Tablet
  if (screenWidth < 1024) return "18px"; // Small laptops
  return "20px"; // Desktop and larger
};


export const applyCustomTheme = (rendition: Rendition, screenWidth: number) => {
  const fontSize = calculateFontSize(screenWidth);
  rendition.themes.register("customTheme", {
    body: {
      background: "#1e1e1e",
      color: "#ffffff !important",
      "font-size": fontSize,
      "font-family": "Baskerville, monospace",
      "line-height": "1.6",
      padding: "10px",
      backgroundColor: "#1e1e1e",
      "background-color": "#1e1e1e",
      border:"0"
    },
    div: {
      background: "#1e1e1e",
      color: "#ffffff !important",
      "font-size": fontSize,
      "font-family": "Baskerville, monospace",
      "line-height": "1.6",
      padding: "10px",
      backgroundColor: "#1e1e1e",
      "background-color": "#1e1e1e",
      border:"0"
    },

    "*": {
      color: "#ffffff !important",
      background: "#1e1e1e",
    },
    a: {
      "text-decoration": "none",
    },
  });

  // Apply the custom theme
  rendition.themes.select("customTheme");
};