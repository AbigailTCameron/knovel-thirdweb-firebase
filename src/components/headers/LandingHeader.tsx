"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Explore", href: "/explore" },
  { label: "Trending", href: "#trending" },
];

function LandingHeader({}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] border-b border-[#19182c]/40 bg-[#030308]/80 backdrop-blur-2xl">
      <div className="flex mx-auto lg:px-6 py-4 px-8 items-center justify-between">
        <div className="flex w-[150px] h-fit">
          <Image
            src="/knovel-logo-full.png"
            className="w-full h-full"
            alt=""
            width="500"
            height="500"
          />
        </div>

        {/* Center nav links */}
        <div className="md:hidden items-center gap-8 flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#7f7f8c] transition-colors hover:text-[#f5f5f5]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div
          onClick={() => router.push("/explore")}
          className="relative text-center rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>

          <p className="bg-transparent font-semibold px-6 py-4">Explore</p>
        </div>

        {/* Mobile menu button */}
        <button
          className="text-foreground md:hidden flex"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-[#19182c]/40 bg-[#030308]/95 backdrop-blur-2xl md:hidden flex">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border/40 pt-3">
              {/* <Button
                variant="ghost"
                size="sm"
                className="justify-start text-muted-foreground"
              >
                Sign in
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <PenLine className="h-3.5 w-3.5" />
                Start Writing
              </Button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingHeader;
