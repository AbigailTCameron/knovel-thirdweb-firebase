import type { Metadata } from "next";
import React from 'react'
import DraftPageClient from '@/components/draft/DraftPageClient';
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";

const { db } = initializeFirebaseServer();

type Props = {
  params: Promise<{ userId: string, id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId, id } = await params;
  let title: string | null = null;

  try{
     const snap = await db
      .collection("drafts")
      .doc(userId)
      .collection("userDrafts")
      .doc(id)
      .get();

    if (snap.exists) {
      title = snap.data()?.title ?? null;
    }

  }catch (e) {
    console.error("Error fetching draft title for metadata", e);
  }
  
  return {
    title: {
      absolute: title ? `Continue editing the draft - ${title}` : "Continue editing the draft"
    },
    description: title ? `Editing draft "${title}" on Knovel Protocol.` : "Edit your draft on Knovel Protocol."
  }
}
function Draft() {
  return <DraftPageClient />
}

export default Draft