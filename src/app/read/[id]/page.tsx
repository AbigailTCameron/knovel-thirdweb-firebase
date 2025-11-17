import type { Metadata } from "next";
import React from 'react'
import ReadPageClient from '@/components/read/ReadPageClient';
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";


const { db } = initializeFirebaseServer();

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const { id } = await params;
  let title;
  let author;
  let synopsis;
  let coverUrl;

  try{
    const snap = await db
      .collection("books")
      .doc(id)
      .get();

    if (snap.exists) {
      title = snap.data()?.title ?? null;
      author = snap.data()?.author ?? null;
      synopsis = snap.data()?.synopsis ?? null;
      coverUrl = snap.data()?.book_image;
    }

  }catch (e) {
    console.error("Error fetching draft title for metadata", e);
  }
  
  return {
    title: {
      absolute: title || author ? `${title} by ${author}` : "Finish reading"
    },
    description: synopsis,
    openGraph: {
      title: title,
      description: synopsis,
      images: [
        { 
          url: coverUrl
        }
      ]
    },
    twitter: {
      title: title,
      description: synopsis,
      images: [coverUrl],
    },
  }
}

function Read({}: Props) {

return <ReadPageClient />
}

export default Read