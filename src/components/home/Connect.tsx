"use client";
import Image from "next/image";

const steps = [
  {
    num: "01",
    label: "Publish",
    title: "Publish Directly.",
    desc:
      "Upload your book, create your author presence, and launch directly to readers without relying on traditional publishing gatekeepers. Knovel gives writers the tools to share their work instantly, maintain creative control, and start building an audience from day one.",
    bg: "#d6d2c9",
    visualBg: "#e8e4db",
    textColor: "#0f0f0f",
    top: 80,
    zIndex: 1,
    Visual: "/publish.png",
  },
  {
    num: "02",
    label: "Discover Socially",
    title: "Get discovered through people.",
    desc:
      "Books surface through real reader engagement — likes, comments, bookmarks, and follows — creating a discovery experience driven by community interest rather than paid placement or opaque algorithms. Great writing gains visibility organically as readers interact and share.",
    bg: "#0f0f0f",
    visualBg: "#1a1a1a",
    textColor: "#fff",
    top: 160,
    zIndex: 2,
    Visual: "/discover.png",
  },
  {
    num: "03",
    label: "Build Community",
    title: "Grow an audience around your work.",
    desc:
      "Readers don’t just consume stories — they connect with them. Knovel enables ongoing conversations between authors and readers, helping writers turn casual readers into loyal followers and active participants in the creative journey.",
    bg: "#7F60F9",
    visualBg: "#6f4de5",
    textColor: "#fff",
    top: 240,
    zIndex: 3,
    Visual: "/communities.png",
  },
  {
    num: "04",
    label: "Earn & Own",
    title: "Monetize and own your growth",
    desc:
      "As your audience grows, new opportunities to earn emerge. Knovel supports direct creator monetization through collector editions, exclusive content, and community-driven support while leveraging decentralized infrastructure to strengthen long-term ownership and audience portability.",
    bg: "#592dc6",
    visualBg: "#490db0",
    textColor: "#fff",
    top: 320,
    zIndex: 4,
    Visual: "/earn.png",
  },
];

function Connect({}) {
  return (
    <div className="relative bg-[#030308] px-24 md:px-10">
      {/* Header */}
      <div className="flex items-baseline gap-6 pt-10 pb-10">
        <h2 className="text-white font-black text-8xl lg:text-6xl line-height-1">
          How Knovel
          <br />
          Works.
        </h2>
      </div>

      {/* Sticky stack */}
      <div className="relative pb-6">
        {steps.map((step) => (
          <div
            className={`flex md:flex-col sticky h-[70vh] overflow-hidden rounded-2xl`}
            key={step.num}
            style={{
              top: step.top,
              zIndex: step.zIndex,
              color: step.textColor,
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            {/* Left: text */}
            <div
              className="flex flex-col basis-1/2 justify-between p-14"
              style={{ background: step.bg }}
            >
              <div>
                <span
                  className="block text-sm opacity-50 uppercase tracking-widest mb-5"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {step.num} — {step.label}
                </span>
                <h3
                  style={{
                    fontSize: "clamp(36px, 4vw, 60px)",
                    lineHeight: 1,
                    marginBottom: 20,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-2xl md:text-lg opacity-80"
                  style={{
                    lineHeight: 1.7,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>

            {/* Right: illustration */}
            <div
              className="flex basis-1/2 items-center w-full justify-center p-4 md:rounded-b-2xl"
              style={{ background: step.visualBg }}
            >
              <Image
                className="w-full h-fit"
                alt={`Cover of ${step.label}`}
                src={step.Visual}
                width="500"
                height="500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Connect;
