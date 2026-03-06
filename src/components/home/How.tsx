"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

function HowItWorks({}) {
  const router = useRouter();

  return (
    <div className="relative flex h-full min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030308]">
      {/* Center glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          width: 900,
          height: 500,
          background:
            "radial-gradient(ellipse, oklch(0.50 0.22 290 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex mx-auto w-full px-16 lg:px-8 lg:flex-col">
        <div className="w-2/5">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xl font-medium text-purple-300">
            How It Works
          </p>
          <h2 className="mt-4 font-mono text-5xl font-bold tracking-tight text-[#f5f5f5] sm:text-3xl lg:text-4xl text-balance">
            A simple new way to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              publish, discover, and grow
            </span>{" "}
            around books.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-1">
          <div className="group relative flex-1">
            <div className="relative h-full overflow-hidden rounded-2xl border border-purple-500/10 bg-[#080715] p-8 transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle, oklch(0.55 0.25 290 / 0.15), transparent 70%)`,
                }}
              />
              <span className="pointer-events-none absolute right-6 top-4 font-mono text-7xl font-black text-purple-500/5 transition-colors group-hover:text-purple-500/10">
                01
              </span>
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg`}
              >
                {/* <step.icon className="h-7 w-7 text-white" /> */}
              </div>
              <h3 className="mb-3 font-mono text-xl font-bold text-[#f5f5f5]">
                Publish
              </h3>
              <p className="text-sm leading-relaxed text-[#7f7f8c]">
                Authors upload their work, create a profile, and launch directly
                to readers.
              </p>
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-600" opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
            </div>
          </div>

          <div className="group relative flex-1">
            <div className="relative h-full overflow-hidden rounded-2xl border border-purple-500/10 bg-[#080715] p-8 transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle, oklch(0.55 0.25 290 / 0.15), transparent 70%)`,
                }}
              />
              <span className="pointer-events-none absolute right-6 top-4 font-mono text-7xl font-black text-purple-500/5 transition-colors group-hover:text-purple-500/10">
                02
              </span>
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg`}
              >
                {/* <step.icon className="h-7 w-7 text-white" /> */}
              </div>
              <h3 className="mb-3 font-mono text-xl font-bold text-[#f5f5f5]">
                Discover
              </h3>
              <p className="text-sm leading-relaxed text-[#7f7f8c]">
                Readers find books through social signals, activity, and
                community interest.
              </p>
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-600" opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
            </div>
          </div>

          <div className="group relative flex-1">
            <div className="relative h-full overflow-hidden rounded-2xl border border-purple-500/10 bg-[#080715] p-8 transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle, oklch(0.55 0.25 290 / 0.15), transparent 70%)`,
                }}
              />
              <span className="pointer-events-none absolute right-6 top-4 font-mono text-7xl font-black text-purple-500/5 transition-colors group-hover:text-purple-500/10">
                03
              </span>
              <div
                className={`mb-6 flex h-14 w-20 items-center justify-center rounded-2xl shadow-lg`}
              >
                <div className="flex justify-center">
                  <video
                    className="w-fit h-fit"
                    autoPlay
                    loop
                    playsInline
                    muted
                  >
                    <source src="/0.webm" type="video/webm" />
                  </video>
                </div>
              </div>
              <h3 className="mb-3 font-mono text-xl font-bold text-[#f5f5f5]">
                Collect & Engage
              </h3>
              <p className="text-sm leading-relaxed text-[#7f7f8c]">
                Readers follow authors, join conversations, and support the
                stories they love.
              </p>
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-600" opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
            </div>
          </div>

          <div className="group relative flex-1">
            <div className="relative h-full overflow-hidden rounded-2xl border border-purple-500/10 bg-[#080715] p-8 transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle, oklch(0.55 0.25 290 / 0.15), transparent 70%)`,
                }}
              />
              <span className="pointer-events-none absolute right-6 top-4 font-mono text-7xl font-black text-purple-500/5 transition-colors group-hover:text-purple-500/10">
                04
              </span>
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg`}
              >
                {/* <step.icon className="h-7 w-7 text-white" /> */}
              </div>
              <h3 className="mb-3 font-mono text-xl font-bold text-[#f5f5f5]">
                Earn & Grow
              </h3>
              <p className="text-sm leading-relaxed text-[#7f7f8c]">
                Authors grow audience ownership and unlock new monetization
                through collector editions and direct support.
              </p>
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-600" opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
