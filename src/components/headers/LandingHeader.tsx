"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, PenLine } from "lucide-react";

function LandingHeader({}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] border-b border-[#19182c]/40 bg-[#030308]/80 backdrop-blur-2xl">
      <div className="mx-auto flex items-center justify-between px-8 py-2 lg:px-6">
        <div className="flex w-[150px] h-fit">
          <Image
            src="/knovel-logo-full.png"
            className="w-full h-full"
            alt=""
            width="500"
            height="500"
          />
        </div>

        <div
          onClick={() => router.push("/explore")}
          className="md:hidden relative text-center rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>

          <p className="bg-transparent font-semibold px-6 py-4">Explore</p>
        </div>

        <button
          className="text-[#f5f5f5] hidden md:flex"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="bg-purple-600 rounded-2xl p-4">
              <Menu className="h-8 w-8" />
            </div>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-[#19182c]/40 bg-[#030308]/95 backdrop-blur-2xl hidden md:flex">
          <div className="flex flex-col gap-1 px-6 py-4">
            <div className="mt-3 flex flex-col gap-2 border-t border-[#19182c]/40 pt-3">
              <p className="justify-start text-[#7f7f8c]">Explore</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingHeader;
