import EditPublishPageClient from '@/components/editPublish/EditPublishPageClient'
import React from 'react';
import type { Metadata } from "next";
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";


const { db } = initializeFirebaseServer();

type Props = {
  params: Promise<{ userId: string, id: string }>
}


export async function generateMetadata({params}: Props): Promise<Metadata> {
  const { userId, id } = await params;
  let title: string | null = null;

  try{
    const snap = await db
      .collection("published")
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
    title:{
      absolute: title ? `Continue editing the published work -  ${title}` : "Continue editing your published work"
    },
    description: title ? `Editing title for "${title}" on Knovel Protocol.` : "Edit your book on Knovel Protocol."
  }
}

function EditPublish({}: Props) {

  return <EditPublishPageClient />
}

export default EditPublish