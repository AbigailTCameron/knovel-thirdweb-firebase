"use server"
import { EPub } from 'epub-gen-memory';

export const generateEpubFile = async (options: any) => {
  try {
    const epub = new EPub(options, options.content);
    const epubBuffer = await epub.genEpub(); // This will return a Buffer (or Blob in the browser)

    return epubBuffer.toString("base64"); // Serialize as base64 string
  } catch (error) {
    console.error("Error generating EPUB:", error);
    throw error;
  }
};