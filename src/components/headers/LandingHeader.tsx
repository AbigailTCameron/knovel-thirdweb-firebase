"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

function LandingHeader({}) {
  const router = useRouter();

  return (
    <div className="fixed flex justify-between top-0 left-0 right-0 z-[200] px-6 py-4  border-b border-[#19182c]/40 bg-[#030308]/80 backdrop-blur-2xl">
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
        className="relative text-center rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>

        <p className="bg-transparent font-semibold px-6 py-4">Explore</p>
      </div>
    </div>
  );
}

export default LandingHeader;
