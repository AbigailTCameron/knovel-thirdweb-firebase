import { ImageResponse } from 'next/og';
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";

const { db } = initializeFirebaseServer();

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  let data: any = null;

  try {
    const snap = await db.collection("books").doc(params.id).get();
    if (snap.exists) {
      data = snap.data();
    }
  } catch (e) {
    console.error("Error fetching book for OG image", e);
  }

  const title: string = data?.title ?? "Knovel Protocol";
  const author: string = data?.author ?? "";
  const synopsis: string = data?.synopsis ?? "";
  const coverUrl: string | null = data?.book_image ?? null

    // Trim synopsis so it doesn't overflow
  const shortSynopsis =
    synopsis.length > 220 ? synopsis.slice(0, 217) + "..." : synopsis;

  return new ImageResponse(
    (
      <div className="flex w-full h-full p-4">
        {/* Left: Book cover */}
        {coverUrl && (
          <div
            className="flex w-1/3 h-[100%] rounded-xl"
            // style={{
            //   marginRight: "32px",
            //   overflow: "hidden",
            //   boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            // }}
          >
            <img
              src={coverUrl}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Right: text box */}
        <div
          className="flex flex-col flex-1"
          // style={{
          //   flex: 1,
          //   display: "flex",
          //   flexDirection: "column",
          //   justifyContent: "space-between",
          // }}
        >
          <div className="flex flex-col">
              <p className='opacity-75 font-bold text-lg'> <span className="uppercase">{title}</span> • Knovel Protocol</p>
              <p className="text-[#c4b5fd] text-base">by {author}</p>
          </div>

          <div className="font-sm overflow-hidden">
            <p>{shortSynopsis}</p>
          </div>

          <div className="flex items-center bg-[#8b5cf6] rounded-full p-2">
            <p>knovelprotocol.com</p>
          </div>
        </div>
      </div>
    )
  )


}