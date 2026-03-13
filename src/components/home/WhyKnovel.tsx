"use client";

import React from "react";

const steps = [
  {
    num: "01",
    label: "Publish",
    title: "Creator Ownership",
    desc:
      "Knovel removes dependence on centralized platforms and publishing intermediaries. Authors publish directly, build lasting relationships with readers, and grow an audience that belongs to them.",
    bg: "#d6d2c9",
    visualBg: "#e8e4db",
    glow: "oklch(0.55 0.25 290 / 0.15)",
    textColor: "#0f0f0f",
    top: 80,
    zIndex: 1,
    Visual: "/publish.png",
  },
  {
    num: "02",
    label: "Discover Socially",
    title: "Social Discovery",
    desc:
      "Instead of paid promotion or opaque ranking systems, Knovel surfaces stories through real engagement signals — creating a discovery ecosystem driven by authentic reader interest.",
    bg: "#0f0f0f",
    visualBg: "#1a1a1a",
    glow: "oklch(0.50 0.22 275 / 0.15)",
    textColor: "#fff",
    top: 160,
    zIndex: 2,
    Visual: "/discover.png",
  },
  {
    num: "03",
    label: "Build Community",
    title: "Community-Driven Growth",
    desc:
      "Stories evolve through conversation, fandom, and shared enthusiasm. Authors build loyal communities that sustain long-term momentum beyond a single book launch.",
    bg: "#7F60F9",
    visualBg: "#6f4de5",
    glow: "oklch(0.55 0.25 310 / 0.15)",
    textColor: "#fff",
    top: 240,
    zIndex: 3,
    Visual: "/communities.png",
  },
  {
    num: "04",
    label: "Earn & Own",
    title: "Sustainable Monetization",
    desc:
      "Through collector editions, exclusive releases, and community support mechanisms, creators gain direct revenue opportunities aligned with genuine reader demand.",
    bg: "#7F60F90d",
    visualBg: "#7F60F91A",
    glow: "oklch(0.55 0.25 290 / 0.15)",
    textColor: "#fff",
    top: 320,
    zIndex: 4,
    Visual: "/earn.png",
  },
];

function WhyKnovel({}) {
  return (
    <div className="relative py-24 lg:py-32">
      <div className="relative flex space-x-[2px] md:flex-col pb-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className={`group relative flex-1 transition-all duration-700 translate-y-0 opacity-100`}
          >
            <div className="relative h-full overflow-hidden rounded-3xl space-y-4 border bg-card p-8 transition-all duration-300 border-purple-500/30 shadow-2xl shadow-purple-500/10">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle, ${step.glow}, transparent 70%)`,
                }}
              />
              <h3 className="text-white text-2xl font-medium uppercase">
                {step.title}
              </h3>

              <p className="text-white text-base">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyKnovel;
