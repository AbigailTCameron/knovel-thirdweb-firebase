import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import PublishUpload from './PublishUpload';
import TrashIcon from '../icons/TrashIcon';
import { deleteEntireBook, editPublishTitle, removePublishGenre, updatePublishGenre, updateUploadEpub } from '../../../functions/editPublish/fetch';
import ConfirmDeletePublish from './ConfirmDeletePublish';
import EditPublishedTitle from './EditPublishTitle';
import UpdatePublish from './UpdatePublish';
import Options from '../icons/Options';
import Calendar from '../icons/Calendar';
import { formatDate } from '../../../tools/formatDate';
import Finger from '../icons/Finger';
import GenrePopup from '../draft/GenrePopup';
import OptionsPopup from '../draft/OptionsPopup';

type Props = {
  imageFile: string;
  title : string;
  chapterCount ?: number | null;
  genres : string[];
  bookId : string;
  userId : string;
  setLoading : Function; 
  authorName : string;
  synopsis : string;
  chapters : any[]
  ipfsHash : string;
  bytesId : `0x${string}`;
  imageFilePath : string;
  setPublishing: Function;
  created_at: any;
  setSynopsis: Function;
}

function EditPublishSider({imageFile, title, chapterCount, genres, bookId, userId, setLoading, authorName, synopsis, chapters, ipfsHash, bytesId, imageFilePath, setPublishing, created_at, setSynopsis}: Props) {
  const router = useRouter();

  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [addGenre, setAddGenre] = useState<boolean>(false);
  const [publishPopup, setPublishPopup] = useState(false); 
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [genre, setGenre] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [options, showOptions] = useState(false);
  const [genrePopup, setGenrePopup] = useState(false);
  

  const handleNewChapter = () => {
    setLoading(true); 
    router.push(`/newChapterPublished/${bookId}`)
  }

  const handleRemoveGenre = async(selectedGenre:string) => {
    await removePublishGenre(userId, bookId, selectedGenre);
  }

  const handleDelete = () => {
    setConfirmDelete(true);
  }

  const handleGenreConfirm = async() => {
    if(genre){
      await updatePublishGenre(userId, bookId, genre.trim()); 
      setAddGenre(false); 
    }
  }

  const handleConfirmTitle = async() => {
    if(newTitle.trim() != title){
      await editPublishTitle(userId, newTitle, bookId);
    }
    setEditTitle(false);
  }

  const handleConfirm = async() => {
    if(bookId){
      setLoading(true);
      router.push("/explore");
  
      const success = await deleteEntireBook(userId, bookId, imageFilePath, ipfsHash, bytesId);
      if(!success){
        console.log('could not delete book');
      }
    }
  }

  const handlePublish = async () => {
    setPublishing(true);
    await updateUploadEpub(title, authorName, synopsis, chapters, userId, genres, imageFile, ipfsHash, bytesId, bookId).then(success => {
      if(success){
        router.push("/explore");
      }else{
        alert("Error trying to your draft!")
      }
    })
  };


  return (
    <div className="relative h-full w-full flex flex-col">
        <div className="flex flex-col px-4">
            <PublishUpload 
              imageFile={imageFile}
              userId={userId}
              oldFilePath={imageFilePath}
              bookId={bookId}
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
                <div onClick={handleNewChapter} className="flex hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg w-full py-3 px-2 font-semibold">
                        <p>Add New Chapter</p>
                </div>

                <div onClick={() => setSynopsis(true)} className="flex hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg w-full py-3 px-2 font-semibold">
                        <p>Add/Update Synopsis</p>
                </div>

                <div onClick={() => setGenrePopup(true)} className="flex hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg w-full py-3 px-2 font-semibold">
                      <p>Add/Update Genres</p>
                </div>
            </div>

        </div>

        <div className="absolute bottom-0 flex-shrink-0 md:flex md:p-1 md:justify-center md:items-center p-4 lg:p-2 mb-2 w-full border-t border-[#272831] tall:p-1 tall:text-sm">
          <div onClick={() => setPublishPopup(true)} className="group flex items-center justify-center space-x-2 hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg text-center w-full py-3 tall:py-1 font-semibold">
            <Finger className='size-7 group-hover:stroke-[#5D3FD3] tall:size-4'/>
            <p>Publish</p>
          </div>

          <div onClick={handleDelete} className="group flex items-center justify-center space-x-2 hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg text-center w-full py-3 tall:py-1 font-semibold">
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

        {genrePopup && (
          <GenrePopup
            genres={genres}
            setGenre={setGenre}
            onCancel={() => setGenrePopup(false)}
            onConfirm={handleGenreConfirm}
            handleRemoveGenre={handleRemoveGenre}
          />
        )}

        {confirmDelete && (
          <ConfirmDeletePublish 
            onConfirm={handleConfirm}
            onCancel={() => setConfirmDelete(false)}
            bookTitle={title}
          />
        
        )}

        {editTitle && (
          <EditPublishedTitle 
            onCancel={() => setEditTitle(false)}
            setTitle={setNewTitle}
            onConfirm={handleConfirmTitle}
          />
        )}


        {publishPopup && (
          <UpdatePublish 
            title={title}
            onConfirm={handlePublish}
            onCancel={() => setPublishPopup(false)}
          />
        )}

    </div>
  )
}

export default EditPublishSider