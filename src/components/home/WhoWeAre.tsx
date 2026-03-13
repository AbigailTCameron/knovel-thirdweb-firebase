"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const carouselBooks = [
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

// Duplicate for seamless loop
const allBooks = [...carouselBooks, ...carouselBooks];

function BookCard({ book }: { book: typeof carouselBooks[number] }) {
  return (
    <div className="group relative md:w-[200px] shrink-0 w-[250px]">
      <div className="overflow-hidden rounded-2xl border border-purple-500/15 bg-card transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10">
        {/* Cover + overlay */}
        <div className="relative aspect-[1/1.6] overflow-hidden">
          <Image
            src={book.cover}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="340px"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export function WhoWeAre() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const step = () => {
      scrollPos += speed;
      // Reset when halfway through (since we duplicated the items)
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      scrollPos = el.scrollLeft;
      animationId = requestAnimationFrame(step);
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#030308] py-24 lg:py-32"
    >
      {/* Purple glow divider */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.55 0.25 290 / 0.6) 50%, transparent 100%)",
        }}
      />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(ellipse, oklch(0.50 0.22 290 / 0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-0 top-1/3"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(ellipse, oklch(0.50 0.18 320 / 0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Section header */}
        <div
          className={`mx-auto mb-14 text-center px-24 md:px-10 transition-all duration-700 lg:px-8 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-white block text-balance text-bold text-8xl lg:text-6xl font-black text-left">
            Discovery is{" "}
            <span className="bg-gradient-to-r from-[#7F60F9] to-[#c084fc] bg-clip-text text-transparent">
              SOCIAL
            </span>
          </p>
          <h2 className="mt-4 sm:text-3xl text-left font-bold tracking-tight text-[#f5f5f5] lg:text-4xl text-5xl text-balance">
            See what readers are{" "}
            <span className="bg-gradient-to-r from-[#7F60F9] to-[#c084fc] bg-clip-text text-transparent">
              loving right now.
            </span>
          </h2>
          <p className="mt-4 sm:text-base leading-relaxed text-[#7f7f8c] text-lg">
            Real recommendations from real people. Discover your next favorite
            book through the community.
          </p>
        </div>

        {/* Book carousel */}
        <div
          className={`transition-all duration-700 delay-200 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-hidden px-6 py-4"
            style={{ scrollBehavior: "auto" }}
          >
            {allBooks.map((book, i) => (
              <BookCard key={`${book.title}-${i}`} book={book} />
            ))}
          </div>

          {/* Fade edges */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* CTA */}
        <div
          className={`mt-12 flex justify-center px-6 transition-all duration-700 delay-400 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mt-8 relative z-10">
            <a
              href="/explore"
              className="group inline-flex items-center gap-3 rounded-full border border-[#27272a] bg-[#141414] px-5 py-2.5 text-sm font-medium text-[#fafafa] hover:bg-[#1a1a2e] transition-colors"
            >
              Explore All Stories
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#fafafa] text-[#0a0a0a] transition-transform group-hover:translate-x-0.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.33337 8H12.6667"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.66671 4L12.6667 8L8.66671 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
