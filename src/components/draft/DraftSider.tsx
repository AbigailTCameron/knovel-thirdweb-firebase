import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import ImageUploader2 from './ImageUploader2';
import TrashIcon from '../icons/TrashIcon';
import { deleteEntireDraft, editDraftTitle, removeDraftGenre, updateDraftGenre, uploadEpub } from '../../../functions/drafts/fetch';
import ConfirmDeleteDraft from './ConfirmDelete';
import EditTitlePopup from './EditTitlePopup';
import PublishPopup from './PublishPopup';
import { formatDate } from '../../../tools/formatDate';
import Calendar from '../icons/Calendar';
import Finger from '../icons/Finger';
import GenrePopup from './GenrePopup';
import Options from '../icons/Options';
import OptionsPopup from './OptionsPopup';

type Props = {
  imageUrl : string;
  userId : string;
  draftId : string;
  title : string;
  chapterCount ?: number | null;
  genres : string[];
  setGenres: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setLoading: (b: boolean) => void;
  setDeleting : Function;
  name : string;
  newSynopsis : string;
  chapters : any[]
  imagePath: string;
  setPublishing: Function;
  created_at: any;
  setSynopsis: Function;
  setImageUrl: (url: string) => void;          
  setImagePath: (p: string) => void;  
  setTitle: (t: string) => void;     
}

function DraftSider({imageUrl, userId, setImageUrl, setImagePath, draftId, title, setTitle, chapterCount, genres, setGenres, setLoading, name, newSynopsis, chapters, imagePath, setPublishing, setDeleting, created_at, setSynopsis}: Props) {
  const router = useRouter();
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [genre, setGenre] = useState<string>('');
  const [newTitle, setNewTitle] = useState(title);          // 👈 init with current title
  const [publishPopup, setPublishPopup] = useState(false); 
  const [genrePopup, setGenrePopup] = useState(false);
  const [options, showOptions] = useState(false);

  useEffect(() => { setNewTitle(title); }, [title]);        // 👈 keep in sync


  const handleRemoveGenre = async(selectedGenre:string) => {
    setGenres(prev => (prev ?? []).filter(x => x !== selectedGenre));

    try{
      await removeDraftGenre(userId, draftId, selectedGenre);
    }catch(e){
      setGenres(prev => {
        const arr = prev ?? [];
        return arr.includes(selectedGenre) ? arr : [...arr, selectedGenre];
      });
      console.error(e);
      alert('Failed to remove genre');
    }
  }

  const handleDelete = () => {
    setConfirmDelete(true);
  }

  const handleConfirm = async() => {
    if (!draftId) return;

    try{
      setDeleting(true);                   // show overlay on parent
      const success = await deleteEntireDraft(userId, draftId, imagePath);

      if (success) {
        // ✅ navigate AFTER delete completes
        router.replace('/explore');
      } else {
        alert('Could not delete draft.');
        setDeleting(false);
      }
    }catch(e){
      console.error(e);
      alert('An error occurred deleting the draft.');
      setDeleting(false);
    }
  }

  const handleGenreConfirm = async() => {
    if (!genre.trim()) return;
    const g = genre.trim();

    setGenres(prev => {
      const arr = prev ?? [];
      return arr.includes(g) ? arr : [...arr, g];
    });

    try{
      await updateDraftGenre(userId, draftId, g);
    }catch(e){
      setGenres(prev => (prev ?? []).filter(x => x !== g));
      console.error(e);
      alert('Failed to add genre');
    }
  }

  const handleConfirmTitle = async() => {
    const next = newTitle.trim();
    if (!next || next === title) {                   
      setEditTitle(false);
      return;
    }

    const prev = title;
    setTitle(next);                                       
    setLoading(true); 

    try{
      await editDraftTitle(userId, draftId, next);
    }catch(e){
      setTitle(prev);                                    
      console.error(e);
      alert('Failed to update title');
    }finally {
      setLoading(false);
      setEditTitle(false);
    }

  }

  const handleNewChapter = () => {
    setLoading(true); 
    router.push(`/newChapter/${draftId}`)
  }

  const handlePublish = async () => {
    if (!imagePath) {
      alert('Book cover file is missing. Please upload a book cover.');
      setPublishPopup(false);
      return;
    }

    setPublishing(true);
    await uploadEpub(userId, genres, chapters, title, name, newSynopsis, imagePath, draftId, imageUrl).then(success => {
      if(success){
        router.push("/explore");
      }else{
        alert("Error trying to your draft!")
      }
    })
  };

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
              userId={userId}
              draftId={draftId}
              oldFilePath={imagePath}
              onUploadingChange={setLoading}                           // show overlay while uploading
              onUploaded={(url, path) => {                            // update parent immediately
                setImageUrl(url);
                setImagePath(path);
              }}
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
            onCancel={() => setGenrePopup(false)}
            genres={genres}
            setGenre={setGenre}
            handleRemoveGenre={handleRemoveGenre}
            onConfirm={handleGenreConfirm}
          />
        )}

        {confirmDelete && (
          <ConfirmDeleteDraft 
            onConfirm={handleConfirm}
            onCancel={() => setConfirmDelete(false)}
            bookTitle={title}
          />
        )}

        {editTitle && (
          <EditTitlePopup 
            value={newTitle}
            setValue={setNewTitle} 
            onCancel={() => {
              setNewTitle(title);               // reset to current on cancel
              setEditTitle(false);
            }} 
            onConfirm={handleConfirmTitle}
            
          />
        )} 

        {publishPopup && (
          <PublishPopup 
            title={title}
            onConfirm={handlePublish}
            onCancel={() => setPublishPopup(false)}
          />
        )}

    
   
    </div>
  )
}

export default DraftSider