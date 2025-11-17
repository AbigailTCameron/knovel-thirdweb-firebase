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

  const title = snap.data()?.title ?? null;
  const author = snap.data()?.author ?? null;
  const synopsis = snap.data()?.synopsis ?? null;
  const coverUrl = snap.data()?.book_image;




  return new ImageResponse(
    (
      <div tw="flex w-full h-full items-center justify-center p-4 text-white rounded-xl">
        <div tw="flex w-1/3 h-full items-center rounded-xl overflow-hidden">
          <img
            tw="w-full h-fit object-cover rounded-xl" 
            src={coverUrl}
          />
        </div>

        <div tw="flex flex-1 w-full h-full">
          <div tw="flex flex-col w-full h-full px-4 md:items-center py-4">

            <div tw="flex flex-col w-full flex-1 min-h-0">      
              <p tw="flex flex-col text-6xl font-bold tracking-tight text-left">
                {title}
                <span tw="font-semibold text-3xl text-[#7F60F9]">by {author}</span>
              </p>

              <div tw="w-full flex flex-1 min-h-0 overflow-hidden">
                  <p tw="text-xl w-full overflow-hidden text-ellipsis line-clamp-6">{synopsis}</p>
              </div>
          
            </div>


            <div tw="mt-auto flex flex-col w-fit py-2">
                <a href={`https://knovelprotocol.com/book/${id}`} tw="flex items-center justify-center rounded-xl bg-[#7F60F9] font-bold px-5 py-3 text-xl text-white">Read now</a>
                <span tw="font-semibold">on Knovel Protocol</span>
            </div>

          </div>
        </div>
      </div>
    )
  )
}