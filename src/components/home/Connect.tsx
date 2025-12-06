'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'


function Connect({}) {
  const router = useRouter(); 

  return (
    <div className="flex sm:flex-col sm:py-4 sm:space-y-10 items-center px-28 halfxl:px-10 md:px-4 space-x-8 md:space-x-2 sm:space-x-0">

        <div className="flex flex-col space-y-8 sm:space-y-4 py-4 w-2/5 sm:w-full text-white sm:items-center">
              <p className="text-4xl lg:text-3xl md:text-xl font-bold">Connect with a Community of Readers and Writers</p>

            <div className="flex space-x-2 md:space-x-0 items-center md:flex-col sm:flex-row sm:w-full sm:px-2 sm:space-x-4">
              <Image 
                className="w-fit h-fit halfxl:w-[90px] md:hidden sm:flex"
                src="/community.png"
                alt="knovel community"
                width={"500"}
                height={"500"}
              />
              <p className="font-extralight lg:text-sm md:text-xs">Join thousands of authors and readers on Knovel now to share your stories, discover new works, and earn rewards in a vibrant, decentralized ecosystem!</p>
            </div>

            <div onClick={() => router.push('/explore')} className="relative text-center w-fit rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white">
              <div className="absolute inset-0 w-fit h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>
                <p className="bg-transparent font-semibold px-6 py-4">Connect</p>
              </div>

        </div>

        <div className="flex w-3/5 h-full sm:w-full">
          <Image 
             className="w-fit h-fit"
              src="/connect-img.png"
              alt=""
              width={"500"}
              height={"500"}  
          />
        </div>
    </div>
  )
}

export default Connect