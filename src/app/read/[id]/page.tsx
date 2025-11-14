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
    console.error("Error fetching draft title for metadata", e);
  }
  
  return {
    title: {
      absolute: title || author ? `${title} by ${author}` : "Finish reading"
    }
  }
}

function Read({}: Props) {

return <ReadPageClient />
}

export default Read