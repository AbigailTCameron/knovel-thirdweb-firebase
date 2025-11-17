import type { Metadata } from "next";
import React from 'react';
import BookPageClient from '@/components/book/BookPageClient';
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";

const { db } = initializeFirebaseServer();

type Props = {
  params: Promise<{ id: string }>
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  let title;
  let author: string | null = null;
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
    console.error("Error fetching book metadata", e);
  }

  return {
    title: {
      absolute: title || author ? `Read ${title} by ${author}` : "Read this book."
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

function Book() {
  return <BookPageClient />
}

export default Book