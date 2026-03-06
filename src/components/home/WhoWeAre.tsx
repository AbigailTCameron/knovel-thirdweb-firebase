import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const books = [
  {
    title: "The Prince",
    author: "Niccolò Machiavelli",
    cover: "https://i.imgur.com/uu34bq4.jpeg",
  },
  {
    title: "On the Origin of Species",
    author: "Charles Darwin",
    cover: "https://i.imgur.com/hgfyPFY.jpeg",
  },
  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    cover: "https://i.imgur.com/BXHS5bz.jpeg",
  },
  {
    title: "Room Number 3, and Other Detective Stories",
    author: "Anna Katharine Green",
    cover: "https://i.imgur.com/hvXQKkg.jpeg",
  },
  {
    title: "Emma",
    author: "Jane Austen",
    cover: "https://i.imgur.com/yzBmkAU.jpeg",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://i.imgur.com/IXFa4LB.jpeg",
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    cover: "https://i.imgur.com/QobFWCh.jpeg",
  },
  {
    title: "The Yellow Wall-Paper",
    author: "Charlotte Perkins Gilman",
    cover: "https://i.imgur.com/PJeiVxS.jpeg",
  },
  {
    title: "The Food of the Gods",
    author: "H.G. Wells",
    cover: "https://i.imgur.com/q3dBCjO.jpeg",
  },
  {
    title: "The Door in the Wall",
    author: "H.G. Wells",
    cover: "https://i.imgur.com/U0F8cs1.jpeg",
  },
  {
    title: "The Tale of Johnny Town-Mouse",
    author: "Beatrix Potter",
    cover: "https://i.imgur.com/C6PXL9K.jpeg",
  },
  {
    title: "The Invisible Man",
    author: "H.G. Wells",
    cover: "https://i.imgur.com/yXgw6L6.jpeg",
  },
  {
    title: "The Abandoned Room",
    author: "Wadsworth Camp",
    cover: "https://i.imgur.com/O3Iuw25.jpeg",
  },
  {
    title: "The Tales of Mother Goose",
    author: "Charles Perrault",
    cover: "https://i.imgur.com/l9OVpYV.jpeg",
  },
  {
    title: "Just So Stories",
    author: "Rudyard Kipling",
    cover: "https://i.imgur.com/Q5dHSR7.jpeg",
  },
  {
    title: "A Little Princess",
    author: "Frances Hodgson Burnett",
    cover: "https://i.imgur.com/1B6QvBU.jpeg",
  },
  {
    title: "Wuthering Heights",
    author: "Emily Brontë",
    cover: "https://i.imgur.com/lXlqLMr.jpeg",
  },
  {
    title: "Holiday House: A Series of Tales",
    author: "Catherine Sinclair",
    cover: "https://i.imgur.com/Y3ikLND.jpeg",
  },
  {
    title: "Twas the Night before Christmas: A Visit from St. Nicholas",
    author: "Clement Clarke Moore",
    cover: "https://i.imgur.com/Fr6ZM9G.jpeg",
  },
];

function Card({ book }: { book: typeof books[number] }) {
  return (
    <div className="group w-1/6 shrink-0 md:w-1/8">
      <div className="overflow-hidden rounded-2xl border border-purple-500/15 bg-[#080715] transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10">
        <div className="relative aspect-[1/1.6] overflow-hidden">
          <Image
            src={book.cover}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="310px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-sm font-bold text-white">{book.title}</h3>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-xs text-white/70">{book.author}</span>
              <BadgeCheck className="h-3 w-3 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const allBooks = [...books, ...books];

function WhoWeAre({}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.5;

    const step = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const stop = () => cancelAnimationFrame(raf);
    const start = () => {
      pos = el.scrollLeft;
      raf = requestAnimationFrame(step);
    };
    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", start);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", stop);
      el.removeEventListener("mouseleave", start);
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030308]">
      {/* Glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2"
          style={{
            width: 500,
            height: 500,
            background:
              "radial-gradient(ellipse, oklch(0.50 0.22 290 / 0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-0 top-1/3"
          style={{
            width: 400,
            height: 400,
            background:
              "radial-gradient(ellipse, oklch(0.50 0.18 320 / 0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-3xl px-6 text-center">
        <h2 className="mt-4 font-mono text-5xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl text-balance">
          See what readers are{" "}
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            loving right now.
          </span>
        </h2>

        <p className="mt-4 text-lg leading-relaxed text-[#7f7f8c] sm:text-base">
          Real recommendations from real people. Discover your next favorite
          book through the community.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative w-full">
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-hidden px-6 py-4"
          style={{ scrollBehavior: "auto" }}
        >
          {allBooks.map((b, i) => (
            <Card key={`${b.title}-${i}`} book={b} />
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* CTA */}
      <div
        onClick={() => router.push("/explore")}
        className="flex items-center group gap-2 rounded-lg bg-purple-600 px-4 py-4 hover:cursor-pointer text-base font-medium text-white hover:bg-purple-500 shadow-lg shadow-purple-600/20"
      >
        Explore All Stories
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}

export default WhoWeAre;
