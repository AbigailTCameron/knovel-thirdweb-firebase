import type { Metadata } from "next";
import React from 'react';
import BookPageClient from '@/components/book/BookPageClient';
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";

const { db } = initializeFirebaseServer();


type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const { id } = params;
  let title: string | null = null;
  let author: string | null = null;

  try{
    const snap = await db
      .collection("books")
      .doc(id)
      .get();

    if (snap.exists) {
      title = snap.data()?.title ?? null;
      author = snap.data()?.author ?? null;
    }

  }catch (e) {
    console.error("Error fetching book metadata", e);
  }

  return {
    title: {
      absolute: title || author ? `Read ${title} by ${author}` : "Read this book."
    },
  }
}

function Book() {
  return <BookPageClient />
}

export default Book