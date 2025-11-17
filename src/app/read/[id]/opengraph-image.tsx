import { ImageResponse } from 'next/og';
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";


const { db } = initializeFirebaseServer();

export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Image({ params }: Props){
  const { id } = await params;

  const snap = await db.collection("books").doc(id).get();
  const coverUrl = snap.data()?.book_image;

  return new ImageResponse(
    (
      <div tw="flex w-full h-full items-center justify-center p-4 text-white rounded-xl bg-black">
        <div tw="flex w-1/3 h-full items-center rounded-xl overflow-hidden">
          <img
            tw="w-full h-fit object-cover rounded-xl" 
            src={coverUrl}
          />
        </div>
      </div>
    )
  )
}