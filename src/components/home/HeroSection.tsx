'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';

function HeroSection({}) {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const router = useRouter();

  const handleMouseMove = (e: MouseEvent) => {
    setOffsetX((e.clientX / window.innerWidth) * 250 - 50);
    setOffsetY((e.clientY / window.innerHeight) * 250 - 50);
  };


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative flex flex-col w-full h-full items-center justify-center text-white p-20 halfxl:px-18 xs:px-4 halfxl:py-10">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-no-repeat filter blur z-0 bg-black opacity-70 transition-transform duration-400 ease-out"
         style={{
          transform: `translate(${offsetX / 20}px, ${offsetY / 20}px) rotateX(${offsetY / 50}deg) rotateY(${offsetX / 50}deg)`,
        }}
        ></div>

        <div className="relative z-10 flex flex-col space-y-16 largetall:space-y-8 xs:space-y-4 items-center transition-transform duration-400 ease-out"
         style={{
          transform: `translate(${offsetX / 10}px, ${offsetY / 10}px)`,
        }}
        >

          <p className="font-black text-center text-9xl md:text-8xl xs:text-7xl largetall:text-6xl bg-gradient-to-r from-white to-white/50 inline-block text-transparent bg-clip-text">Read. Write. Earn.</p>
          <p className="text-2xl largetall:text-lg xs:text-lg md:text-xl max-w-prose text-center">Empowering authors with decentralized technology, Knovel revolutionizes the way you create, share, and earn from your stories.</p>
        <div onClick={() => router.push('/explore')} className="relative text-center rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine">  
          </div>
            <p className="bg-transparent font-semibold px-6 py-4">Get Started</p>
        </div>
            
        </div>
    
    </div>
  )
}

export default HeroSection