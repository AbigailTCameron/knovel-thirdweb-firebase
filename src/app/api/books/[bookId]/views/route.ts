// app/api/books/[bookId]/views/route.ts
import { NextResponse } from 'next/server';
import initializeFirebaseServer from '@/lib/initFirebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

const { db } = initializeFirebaseServer();

type RouteContext = {
  params: Promise<{ bookId: string }>;
};


export async function POST(
  _req: Request,
  { params }: RouteContext
) {
  const { bookId } = await params;

  if (!bookId || typeof bookId !== 'string') {
    return NextResponse.json(
      { error: 'Invalid or missing bookId' },
      { status: 400 }
    );
  }

  // Try to read userId from body (optional)
  let userId: string | null = null;
  try {
    const body = await _req.json().catch(() => null);
    if (body && typeof body.userId === 'string') {
      userId = body.userId;
    }
  } catch {
    // ignore JSON parse errors – we'll treat as anonymous view
  }

  const bookRef = db.collection('books').doc(bookId);

  // 1) Increment all-time views and 30-day views
  // (views_30d is a running counter; /script can later recompute strict 30-day windows)
  await bookRef.update({
    views: FieldValue.increment(1),
    views_30d: FieldValue.increment(1),
  });

  // 2) Log an event for future accurate 30-day recomputes
  await db.collection('book_events').add({
    bookId,
    userId,
    type: 'view',
    timestamp: FieldValue.serverTimestamp(),
  });
    
  return NextResponse.json({ ok: true });
}