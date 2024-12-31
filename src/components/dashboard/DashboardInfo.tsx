import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

type Props = {
  userId ?: string
  setLoading : Function;
  draftsLength ?: number;
  publishedLength ?: number;
  bookmarkLength ?: number;
}

function DashboardInfo({userId, setLoading, draftsLength, publishedLength, bookmarkLength}: Props) {
  const router = useRouter(); 
  const pathname = usePathname(); 

  const handleDraftsClick = () => {
    if(pathname !== `/drafts/${userId}`){
      setLoading(true); 
      router.push(`/drafts/${userId}`);
    }
  };

  const handleReadingClick = () => {
    if(pathname !== `/readinglist/${userId}`){
      setLoading(true); 
      router.push(`/readinglist/${userId}`);
    }
  }

  const handlePublishClick = () => {
    if(pathname !== `/publish`){
      setLoading(true); 
      router.push(`/publish`);
    }
  }

  useEffect(() => {
    if(userId){
      router.prefetch(`/drafts/${userId}`);
      router.prefetch(`/readinglist/${userId}`);
      router.prefetch(`/publish`)
    }
  }, [userId])


  return (
    <div className='grid h-fit w-full grid-cols-3 grid-rows-3 gap-4 p-4 xxl:grid-cols-2 md:grid-cols-2 ss:grid-cols-1 overflow-y-auto'>
        <div onClick={handleDraftsClick} className="flex flex-col bg-[#2a2829] rounded-3xl hover:cursor-pointer hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] p-8 ss:p-4">
            <p className="flex basis-1/4 font-bold text-xl text-white/50">Draft</p>
            <p className='flex basis-1/2 text-9xl halfxl:text-8xl sm:text-7xl ss:text-4xl font-extrabold bg-gradient-to-r from-white to-white/50 text-transparent bg-clip-text'>{draftsLength}</p>
            <p className="flex basis-1/4 text-white/50">documents</p>
        </div>

        <div onClick={handlePublishClick} className="flex flex-col bg-[#2a2829] rounded-3xl hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] hover:cursor-pointer p-8 ss:p-4">
          <p className="flex basis-1/4 font-bold text-xl text-white/50">Published</p>
          <p className='flex basis-1/2 text-9xl halfxl:text-8xl sm:text-7xl ss:text-4xl font-extrabold bg-gradient-to-r from-white to-white/50 text-transparent bg-clip-text'>{publishedLength}</p>
          <p className="flex basis-1/4 text-white/50">documents</p>
        </div>

        <div onClick={handleReadingClick} className="flex flex-col bg-[#2a2829] rounded-3xl hover:cursor-pointer p-8 hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] ss:p-4">
          <p className="flex basis-1/4 font-bold text-xl text-white/50">Reading List</p>
          <p className='flex basis-1/2 text-9xl halfxl:text-8xl sm:text-7xl ss:text-4xl font-extrabold bg-gradient-to-r from-white to-white/50 text-transparent bg-clip-text'>{bookmarkLength}</p>
          <p className="flex basis-1/4 text-white/50">books</p>
        </div>

        {/* <div className="flex flex-col bg-[#2a2829] rounded-3xl hover:cursor-pointer p-8 hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] ss:p-4">
          <p className="flex basis-1/4 font-bold text-xl text-white/50">Following</p>
          <p className='flex basis-1/2 text-9xl halfxl:text-8xl sm:text-7xl ss:text-4xl font-extrabold bg-gradient-to-r from-white to-white/50 text-transparent bg-clip-text'>{0}</p>
        </div> */}
    </div>
  )
}

export default DashboardInfo