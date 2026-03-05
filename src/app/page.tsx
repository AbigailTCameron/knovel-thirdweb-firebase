"use client";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/home/HeroSection";
import WhoWeAre from "@/components/home/WhoWeAre";
import Connect from "@/components/home/Connect";
import Technology from "@/components/home/Technology";
import ComingSoon from "@/components/home/ComingSoon";
import Footer from "@/components/footers/Footer";
import PageAnalytics from "@/components/analytics/PageAnalytics";
import NavBar from "@/components/headers/NavBar";
import Social from "@/components/home/Social";
import LandingHeader from "@/components/headers/LandingHeader";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen text-foreground">
      <PageAnalytics pageTitle="Home" pagePath="/" />

      <div className="relative z-10">
        <LandingHeader />
        <HeroSection />
        <Social />
      </div>

      {/* <div className="w-screen h-screen md:my-16 sm:mt-20 tall:mt-20 mediumtall:mt-52 mini:mt-60 smmini:mt-60 iphonese:mt-20">
        <WhoWeAre />
      </div>

      <div className="w-screen h-full sm:mt-20 lgtall:mt-36">
        <Connect />
      </div>

      <div className="relative w-screen h-screen lg:h-full mt-60 sm:mt-40 mb-40 iphonese:mb-10">
        <div className="absolute inset-0 bg-tech-bg bg-contain bg-no-repeat bg-center opacity-80 filter z-0"></div>
        <p className="text-gray-300 font-mono pl-40 xl:pl-28 lg:pl-10 sm:pl-4">
          TECHNOLOGY
        </p>
        <Technology />
      </div>

      <div className="w-screen h-screen lg:h-full tall:my-20 iphonese:mb-10">
        <p className="text-gray-300 font-mono pl-40 xl:pl-28 lg:pl-4 sm:pl-2">
          COMING SOON
        </p>
        <ComingSoon />
      </div>

      <div className="flex md:flex-col md:space-y-4 items-center justify-center text-white w-full h-full px-60 2xl:px-36 xl:px-28 halfxl:px-16 my-52 xl:my-20 md:my-16 tall:my-20 lgtall:mt-40 mdtall:mt-56 space-x-8 md:space-x-0 halfxl:space-x-4 iphonese:mt-10">
        <div className="flex flex-col text-3xl sm:text-xl tall:text-xl font-semibold xl:w-[700px] lg:w-[500px] halflg:w-[400px] md:w-full md:text-center space-y-4">
          <p>Ready to join the most inclusive literary community? </p>
          <p>Join our platform today! </p>
        </div>

        <div
          onClick={() => router.push("/explore")}
          className="relative text-center rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>
          <p className="bg-transparent font-semibold px-6 py-4">Explore</p>
        </div>
      </div>

      <div className="bottom-0 w-full">
        <Footer />
      </div> */}
    </main>
  );
}
