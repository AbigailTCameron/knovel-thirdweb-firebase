import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import PublishUpload from './PublishUpload';
import BookIcon from '../icons/BookIcon';
import NewPage from '../icons/NewPage';
import TrashIcon from '../icons/TrashIcon';
import NewGenrePublish from './NewGenrePublish';
import { deleteEntireBook, editPublishTitle, removePublishGenre, updatePublishGenre, updateUploadEpub } from '../../../functions/editPublish/fetch';
import ConfirmDeletePublish from './ConfirmDeletePublish';
import EditPublishedTitle from './EditPublishTitle';
import UpdatePublish from './UpdatePublish';

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
}

function EditPublishSider({imageFile, title, chapterCount, genres, bookId, userId, setLoading, authorName, synopsis, chapters, ipfsHash, bytesId, imageFilePath, setPublishing}: Props) {
  const router = useRouter();

  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [addGenre, setAddGenre] = useState<boolean>(false);
  const [publishPopup, setPublishPopup] = useState(false); 
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [genre, setGenre] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');

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
      await deleteEntireBook(userId, bookId, imageFilePath, ipfsHash, bytesId).then(success => {
        if(success){
          router.push("/explore")
        }else{
          console.log('could not delete book')
        }
      })
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
        <div className="flex flex-col">
            <PublishUpload 
              imageFile={imageFile}
              userId={userId}
              oldFilePath={imageFilePath}
              bookId={bookId}
            />
           

            <div onClick={() => setEditTitle(true)} className="text-white font-bold text-4xl lg:text-2xl text-center hover:cursor-pointer hover:text-gray-500">
              <p>{title}</p>
            </div>

            <div className="flex-col w-full text-[#a5a5a5] text-sm items-center px-4 lg:px-2 py-6 lg:py-4 md:py-1">
                <p className="text-xs text-center mb-2">BOOK STATS</p>

                <div className="flex w-full space-x-10 text-sm items-center">
                    <div className="flex space-x-2 items-center">
                      <BookIcon className="stroke-[#a5a5a5]"/>
                      <p>Chapters</p>
                    </div>
                  
                    <div className="flex items-center bg-[#a5a5a5] rounded-2xl px-3 py-1 text-white">
                      <p>{chapterCount}</p>
                    </div>

                </div>
          

            </div>

            <div onClick={handleNewChapter} className="flex text-[#a5a5a5] text-sm items-center space-x-2 px-4 lg:px-2 hover:cursor-pointer">
              <NewPage className="stroke-[#a5a5a5]"/>
              <p>new chapter</p>
            </div> 
        </div>

        <div onClick={() => setAddGenre(true)} className="flex text-gray-500 hover:text-gray-600 hover:cursor-pointer px-4 lg:px-2 self-center mt-4">
          <p>+ click to add genre</p>
        </div>

        <div className="flex-grow overflow-y-auto md:h-[50px] px-4 lg:px-2 py-2">
          {genres?.map((genre, index) => (
            <div onClick={() => handleRemoveGenre(genre)} key={index} className="hover:cursor-pointer">
              {genre}
            </div>
          ))}
        </div>

        <div className="flex-shrink-0 md:flex md:p-1 md:justify-center md:items-center md:mt-2 p-4 lg:p-2 mb-2 w-full">
            <div onClick={() => setPublishPopup(true)} className="hover:cursor-pointer bg-indigo-600 text-center p-3 lg:p-2 md:w-1/2 rounded-xl font-semibold text-lg lg:text-base text-white">
              <p>update</p>
            </div>

          <div onClick={handleDelete} className="flex items-center w-full md:w-1/2 justify-center mt-4 md:mt-0 space-x-2 text-red-600 hover:cursor-pointer hover:underline">
            <TrashIcon />
            <p>delete</p>
          </div>
        </div>

        {addGenre && (
          <NewGenrePublish
            setGenre={setGenre}
            onCancel={() => setAddGenre(false)}
            onConfirm={handleGenreConfirm}
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