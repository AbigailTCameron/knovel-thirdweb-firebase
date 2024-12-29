import LandingHeader from "./components/headers/LandingHeader";

export default function Home() {
  return (
    <div className="flex w-screen min-h-screen flex-col items-center overflow-x-hidden">
        <div className="sticky top-0 w-full z-50">
           <LandingHeader />
        </div>

     
    </div>
  );
}
