import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

function FeaturedCollection({}) {
  const router = useRouter(); 
  
  return (
    <div className="relative flex flex-col w-full h-full bg-holiday bg-cover bg-center bg-no-repeat items-center justify-center text-white">

      <div className='flex flex-col items-center justify-center text-center space-y-1 z-10'>
        <p className="font-semibold text-xl xs:text-lg bg-gradient-to-b from-white to-[#0080ff] inline-block text-transparent bg-clip-text">Collection of the Month</p>
        <p className="text-6xl lg:text-4xl xs:text-2xl font-bold bg-gradient-to-b from-[#91bceb] via-[#0080ff]/70 to-[#0080ff] inline-block text-transparent bg-clip-text" style={{ fontFamily: '"Old English Text MT", "Goudy Old Style", serif' }}>HOLIDAY CLASSICS</p>
        <p className="font-semibold text-2xl halflg:text-xl md:text-lg xs:text-base bg-gradient-to-b from-[#0080ff] to-white inline-block text-transparent bg-clip-text">{"Discover this season's curated collection of must read classics!"}</p>
      </div>
    
      <div className="flex space-x-3 xs:space-x-1 z-10">
          <Image 
              className='w-[180px] 2xl:w-[150px] xl:w-[140px] halfxl:w-[100px] lg:w-[80px] ss:w-[60px] md:hidden h-full'
              src="/snowy.png"
              alt=""
              width="500"
              height={"500"}
          />

          <Image
              className='w-[180px] 2xl:w-[150px] xl:w-[140px] halfxl:w-[100px] lg:w-[80px] ss:w-[60px] xs:hidden h-full'
              src="/a-christmas-carol.png"
              alt=""
              width="500"
              height={"500"}
          />

          <Image
            className='w-[180px] 2xl:w-[150px] xl:w-[140px] halfxl:w-[100px] lg:w-[80px] ss:w-[60px] h-full'
            src="/little-women.png"
            alt=""
            width="500"
            height={"500"}
          />
        
          <Image
            className='w-[180px] 2xl:w-[150px] xl:w-[140px] halfxl:w-[100px] lg:w-[80px] ss:w-[60px] h-full'
            src="/holiday.png"
            alt=""
            width="500"
            height={"500"}
          />
      
          <Image
            className='w-[180px] 2xl:w-[150px] xl:w-[140px] halfxl:w-[100px] lg:w-[80px] ss:w-[60px] h-full'
            src="/adventuresofsanta.png"
            alt=""
            width="500"
            height={"500"}
          />
          
          <Image
            className='w-[180px] 2xl:w-[150px] xl:w-[140px] halfxl:w-[100px] lg:w-[80px] ss:w-[60px] h-full'
            src="/wuthering.png"
            alt=""
            width="500"
            height={"500"}
          />
      
          <Image
            className='w-[180px] 2xl:w-[150px] xl:w-[140px] halfxl:w-[100px] lg:w-[80px] ss:w-[60px] sm:hidden h-full'
            src="/night.png"
            alt=""
            width="500"
            height={"500"}
          />
      </div>

      <div className="w-full h-1/6 sm:h-1/8 -mt-8 lg:-mt-4">

          <Image
            className='w-full h-full'
            src="/shelf-w.png"
            alt=""
            width="500"
            height={"500"}
          />
      </div>


      <div
        onMouseEnter={() => router.prefetch('/special')}
        onClick={() => router.push('/special')} 
        className="absolute bottom-4 lg:bottom-2 sm:bottom-1 right-4 lg:right-2 sm:right-1 z-20 bg-[#272831] border-[0.5px] border-slate-600 px-4 sm:px-2 py-2 sm:py-1 rounded-md hover:cursor-pointer">
        <p className="font-semibold sm:text-sm sm:font-medium">Browse Collection</p>
      </div>

    </div>
  )
}

export default FeaturedCollection