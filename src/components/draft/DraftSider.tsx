import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import ImageUploader2 from './ImageUploader2';
import TrashIcon from '../icons/TrashIcon';
import { formatDate } from '../../../tools/formatDate';
import Calendar from '../icons/Calendar';
import Finger from '../icons/Finger';
import Options from '../icons/Options';
import OptionsPopup from './OptionsPopup';

type Props = {
  imageUrl : string;
  userId : string;
  draftId : string;
  title : string;
  chapterCount ?: number | null;
  setGenres: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setLoading: (b: boolean) => void;
  imagePath: string;
  created_at: any;
  setSynopsis: (value: boolean) => void; 
  setEditTitle: (t: boolean) => void;     
  setGenrePopup: (value: boolean) => void;
  setPublishPopup: (value: boolean) => void;
  setConfirmDelete: any;
  setFilename: Function;
  setImageSrc: Function;
  setChooseCropped: Function;
  localPreview: any;
}

function DraftSider({imageUrl, userId, localPreview, setChooseCropped, setImageSrc, draftId, title, setEditTitle, chapterCount, setGenrePopup, setLoading, imagePath, created_at, setSynopsis, setPublishPopup, setConfirmDelete, setFilename}: Props) {
  const router = useRouter();
  
  const [options, showOptions] = useState(false);

  const handleDelete = () => {
    setConfirmDelete(true);
  }

  const handleNewChapter = () => {
    setLoading(true); 
    router.push(`/newChapter/${draftId}`)
  }

  useEffect(() => {
    if(userId){
      router.prefetch(`/newChapter/${draftId}`)
    }
  }, [userId])

  return (
    <div className="relative h-full w-full flex flex-col">
        <div className="flex flex-col px-4">
            <ImageUploader2 
              bookUrl={imageUrl}
              setFilename={setFilename}
              setImageSrc={setImageSrc}
              setChooseCropped={setChooseCropped}
              localPreview={localPreview}
            />

            <div onClick={() => setEditTitle(true)} className="text-white font-bold text-4xl lg:text-2xl md:text-lg tall:text-base text-center hover:cursor-pointer hover:text-gray-500">
              <p>{title}</p>
            </div>

            <div onClick={()=> showOptions(true)} className='hidden md:flex absolute top-2 right-2 hover:cursor-pointer'>
              <Options className='stroke-white'/>
            </div>

            <div className='flex space-x-2 sm:space-x-0 my-3 md:absolute md:top-0 md:p-1 md:flex-col'>
                <div className='flex items-center justify-center border space-x-1 border-[#272831] rounded-lg px-2 py-2 text-sm md:text-xs sm:p-1 sm:w-fit ss:hidden'>
                    <Calendar className='size-6 md:size-4'/>
                    <p className="">{formatDate(created_at)}</p>
                </div>
                <div className='flex items-center justify-center border border-[#272831] rounded-lg px-2 py-2 text-sm md:text-xs sm:p-1 sm:w-fit'>
                 <p className="">Chapters {chapterCount}</p>
                </div>
            </div>

            <div className='flex flex-col md:hidden'>
                <div onClick={handleNewChapter} className="flex hover:cursor-pointer hover:bg-[#7F60F9]/5 hover:backdrop-blur-lg hover:border hover:border-[#7F60F9]/15 rounded-lg w-full py-3 px-2 font-semibold">
                        <p>Add New Chapter</p>
                </div>

                <div onClick={() => setSynopsis(true)} className="flex hover:cursor-pointer hover:bg-[#7F60F9]/5 hover:backdrop-blur-lg hover:border hover:border-[#7F60F9]/15 rounded-lg w-full py-3 px-2 font-semibold">
                        <p>Add/Update Synopsis</p>
                </div>

                <div onClick={() => setGenrePopup(true)} className="flex hover:cursor-pointer hover:bg-[#7F60F9]/5 hover:backdrop-blur-lg hover:border hover:border-[#7F60F9]/15 rounded-lg w-full py-3 px-2 font-semibold">
                        <p>Add/Update Genres</p>
                </div>
            </div>


        </div>

        <div className="absolute bottom-0 flex-shrink-0 md:flex md:p-1 md:justify-center md:items-center p-4 lg:p-2 mb-2 w-full border-t border-[#272831] tall:p-1 tall:text-sm">
          <div onClick={() => setPublishPopup(true)} className="group flex items-center justify-center space-x-2 hover:cursor-pointer hover:bg-[#7F60F9]/5 hover:backdrop-blur-lg hover:border hover:border-[#7F60F9]/15 rounded-lg text-center w-full py-3 tall:py-1 font-semibold">
            <Finger className='size-7 group-hover:stroke-[#5D3FD3] tall:size-4'/>
            <p>Publish</p>
          </div>

          <div onClick={handleDelete} className="group flex items-center justify-center space-x-2 hover:cursor-pointer hover:bg-[#7F60F9]/5 hover:backdrop-blur-lg hover:border hover:border-[#7F60F9]/15 rounded-lg text-center w-full py-3 tall:py-1 font-semibold">
            <TrashIcon className='size-7 group-hover:stroke-red-600 tall:size-4'/>
            <p>Delete</p>
          </div>

        </div>

        {options && (
          <OptionsPopup 
            showOptions={showOptions}
            handleNewChapter={handleNewChapter}
            setSynopsis={setSynopsis}
            setGenrePopup={setGenrePopup}
          />
        )} 
    </div>
  )
}

export default DraftSider