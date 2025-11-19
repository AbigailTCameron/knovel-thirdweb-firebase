// app/api/books/[bookId]/views/route.ts
import { NextResponse } from 'next/server';
import initializeFirebaseServer from '@/lib/initFirebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

const { db } = initializeFirebaseServer();

export async function POST(
  _req: Request,
  { params }: { params: { bookId: string } }
) {
  const { bookId } = await params;

  await db.collection("books").doc(bookId).update({
      views: FieldValue.increment(1), // Admin SDK increment
    });
    
  return NextResponse.json({ ok: true });
}