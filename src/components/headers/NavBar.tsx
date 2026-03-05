import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function NavBar({}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "For Authors", href: "#authors" },
    { label: "For Readers", href: "#readers" },
    { label: "How it Works", href: "#how-it-works" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 w-full">
      <div className="flex items-center gap-8 rounded-full bg-[#1a2a2e]/70 backdrop-blur-xl border border-white/10 py-3 shadow-lg shadow-black/20">
        <a href="#" className="flex items-center">
          <Image
            src="/knovel-logo-full.png"
            alt="Knovel Protocol"
            className="h-10 w-full"
            width="500"
            height="500"
          />
        </a>

        <div className="flex md:hidden items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="block md:hidden">
          <a
            href="/explore"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-medium text-[#1a2a2e] hover:bg-white/90 transition-colors"
          >
            Explore
          </a>
        </div>

        <button
          className="hidden md:flex text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full mt-2 left-4 right-4 hidden rounded-2xl bg-[#1a2a2e]/90 backdrop-blur-xl border border-white/10 px-6 py-4 md:flex flex-col gap-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/explore"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-medium text-[#1a2a2e] hover:bg-white/90 transition-colors w-fit"
          >
            Explore
          </a>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
