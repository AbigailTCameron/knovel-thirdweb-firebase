import initializeFirebaseClient from "@/lib/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { pinata } from "../../utils/config";
import ePub, { NavItem, type Rendition } from 'epubjs';
import { notFound } from "next/navigation";
import { BookChapters, BookMetadata, EpubBook, EpubRendition } from "../..";



const { db } = initializeFirebaseClient();

export const fetchBookInfo = async (
  id: string, 
  setChapters: (chapters: BookChapters[]) => void, 
  setBook: (book: EpubBook) => void, 
  setMetadata: (metadata: BookMetadata) => void, 
  setAuthorId: (authorId: string) => void
) => {
  try{
    // Reference to the specific book document in the Firestore "books" collection
    const bookRef = doc(db, 'books', id);

    // Fetch the document
    const bookSnap = await getDoc(bookRef);
    if (!bookSnap.exists()) {
      // If the document does not exist, redirect to the error page
      notFound();
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

async function fetchEpub(
  response:Blob, 
  setChapters: (chapters: BookChapters[]) => void, 
  setBook: (book: EpubBook) => void, 
  setMetadata: (metadata: BookMetadata) => void
) {
  try {

    // 🔧 Convert Blob -> ArrayBuffer so it matches the ePub typing
    const arrayBuffer = await response.arrayBuffer();
    const epubBook = ePub(arrayBuffer) as unknown as EpubBook;

    // Wait for core things to be ready
    await Promise.all([
      epubBook.ready,
      epubBook.loaded.metadata,
      epubBook.loaded.navigation,
    ]);

    // Set Book Metadata
    const metadata = await epubBook.loaded.metadata;
    // Optionally attach cover
    let coverUrl: string | null = null;
    try {
      const maybeCover = await epubBook.coverUrl?.(); 
      coverUrl = maybeCover ?? null;      
    } catch {}

    setMetadata({
      ...metadata,
      cover: coverUrl ?? metadata.cover, // if your BookMetadata has this field
    } as BookMetadata);

    // 2) TOC / chapters
    const nav = await epubBook.loaded.navigation;
    const toc = nav?.toc ?? epubBook.navigation?.toc ?? [];
    if (Array.isArray(toc) && toc.length > 0) {
      const chapters: BookChapters[] = toc.map((item: NavItem) => ({
        title: item.label,
        href: item.href, 
      }));
      setChapters(chapters);
    } else {
      console.log('No TOC found in the EPUB');
    }

    setBook(epubBook); // Store the book

  } catch (error) {
    console.error('Error fetching / processing EPUB:', error);
  }
}

export const calculateFontSize = (screenWidth: number) => {  
  // Adjust font size based on screen width (e.g., responsive scaling)
  if (screenWidth < 480) return 14; // Mobile
  if (screenWidth < 768) return 16; // Tablet
  if (screenWidth < 1024) return 18; // Small laptops
  return 20; // Desktop and larger
};


export const applyCustomTheme = (r: EpubRendition, fontSize: number, theme: string) => {
   // Register themes
    r.themes?.register("dark", {
      "body": {
        "background": "#0c0a15",
        "color": "#f9fafb",
      },
      "p": {
        "line-height": "1.6",
      },
    });

    r.themes?.register("light", {
      body: {
        background: "#f9fafb",
        color: "#111827",
      },
      p: {
        "line-height": "1.6",
      },
    });

    r.themes?.select(theme);
    r.themes?.fontSize(`${fontSize}px`);
  
};