"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import { deleteEntireDraft, editDraftSynopsis, editDraftTitle, fetchChapterInfo, removeDraftGenre, reuploadBookImageToSupabase, updateDraftGenre, uploadEpub } from '../../../functions/drafts/fetch';
import Sider from '../headers/Sider';
import Top from '../headers/Top';
import MediumHeader from '../headers/MediumHeader';
import DraftSider from './DraftSider';
import UserSearch from '../explore/popup/UserSearch';
import SettingsPopup from '../explore/popup/SettingsPopup';
import Notifications from '../community/Notifications';
import SpinLoader from '../loading/SpinLoader';
import DraftList from './DraftList';
import NewSynopsis from './NewSynopsis';
import GenrePopup from './GenrePopup';
import EditTitlePopup from './EditTitlePopup';
import PublishPopup from './PublishPopup';
import { useActiveAccount } from 'thirdweb/react';
import ConfirmDeleteDraft from './ConfirmDelete';
import Cropper from 'react-easy-crop';
import { Area, getCroppedImg } from '../../../tools/cropImage';

const { auth } = initializeFirebaseClient();

function DraftPageClient({}) {
    const router = useRouter();
    const account = useActiveAccount();
    
    const params = useParams<{ userId: string, id: string }>();
  
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
    const [profileUrl, setProfileUrl] = useState<string>(''); 
  
    const [chapterCount, setChapterCount] = useState<number | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [genres, setBookGenres] = useState<string[]>();
    const [synopsis, setSynopsis] = useState<boolean>(false);
    const [oldSynopsis, setOldSynopsis] = useState<string>('');
    const [chapters, setChapters] = useState<any[]>([]); // Store the list of chapters
    const [newSynopsis, setNewSynopsis] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [authorName, setAuthorName] = useState<string>('');
    const [imagePath, setImagePath] = useState<string>('');
    const [publishing, setPublishing] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [created, setCreated] = useState();
    const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
    const [filePath, setFilePath] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [booting, setBooting] = useState<boolean>(true);  
    const [genre, setGenre] = useState<string>('');
    const [genrePopup, setGenrePopup] = useState(false);
    const [newTitle, setNewTitle] = useState(title);         
    const [editTitle, setEditTitle] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const [publishPopup, setPublishPopup] = useState(false); 
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [chooseCropped, setChooseCropped] = useState<boolean>(false); 
    
    const [localPreview, setLocalPreview] = useState<string | null>(null);    // NEW: optimistic preview
      const [filename, setFilename] = useState<string>('');
    
    
    

    useEffect(() => { setNewTitle(title); }, [title]);      
    
    
    
    useEffect(() => { 
      setBooting(true);

      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, async(user) => {
          const routeUserId = params?.userId;
          if (!user) {
            setCurrentUser(undefined);
            setBooting(false);

            router.replace("/explore"); // or "/"
            return;
          }

          setCurrentUser(user?.uid);

          // ❌ Logged in but trying to view someone else’s drafts → redirect to their own drafts
          if (routeUserId && routeUserId !== user.uid) {
            router.replace(`/drafts/${user.uid}`);
            return;
          }

          const data =  await getUserProfile(user.uid, setProfileUrl);    
          if(data){
            setFilePath(data.profilePicturePath);
            setUsername(data.username);
            setName(data.name);
          }

          setBooting(false)
      })
      return () => unsubscribe(); 
    
    }, []);
    
    useEffect(() => {
      if (!params.id || !currentUser || deleting) return;
  
      let alive = true;
      setBooting(true);
  
      (async() => {
        try{
            await fetchChapterInfo(
              currentUser,
              params.id,
              setChapterCount,
              setChapters,
              setImageUrl,
              setTitle,
              setBookGenres,
              setOldSynopsis,
              setAuthorName,
              setImagePath,
              setCreated
            );
        } finally {
          if (alive) setBooting(false);
        }
      })();
  
      return () => { alive = false; };
    }, [params.id, currentUser, deleting])
  
    const handleConfirm = async () => {
      if (!currentUser || !params?.id) return;
  
      const prev = oldSynopsis;       
      const next = newSynopsis.trim();
  
      // show the new text immediately everywhere
      setOldSynopsis(next);
      setLoading(true);
  
      try{
        await editDraftSynopsis(currentUser, params.id, next);
        setNewSynopsis(''); 
      }catch(e){
        setOldSynopsis(prev);
        console.error(e);
        alert('Failed to update synopsis');
      }finally {
        setLoading(false);
        setSynopsis(false);          
      }
    }

  const handleGenreConfirm = async() => {
    if (!genre.trim()) return;
    const g = genre.trim();

    setBookGenres(prev => {
      const arr = prev ?? [];
      return arr.includes(g) ? arr : [...arr, g];
    });

    try{
      if(!currentUser) return;
      await updateDraftGenre(currentUser, params?.id, g);
    }catch(e){
      setBookGenres(prev => (prev ?? []).filter(x => x !== g));
      console.error(e);
      alert('Failed to add genre');
    }
  }

  const handleRemoveGenre = async(selectedGenre:string) => {
      setBookGenres(prev => (prev ?? []).filter(x => x !== selectedGenre));
  
      try{
        if(!currentUser) return;
        await removeDraftGenre(currentUser, params?.id, selectedGenre);
      }catch(e){
        setBookGenres(prev => {
          const arr = prev ?? [];
          return arr.includes(selectedGenre) ? arr : [...arr, selectedGenre];
        });
        console.error(e);
        alert('Failed to remove genre');
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
        if(!currentUser) return;
        await editDraftTitle(currentUser, params?.id, next);
      }catch(e){
        setTitle(prev);                                    
        console.error(e);
        alert('Failed to update title');
      }finally {
        setLoading(false);
        setEditTitle(false);
      }
  
    }

  const handlePublish = async (upto: number) => {
    if (!imagePath) {
      alert('Book cover file is missing. Please upload a book cover.');
      setPublishPopup(false);
      return;
    }

    const selectedChapters = chapters.slice(0, Math.max(0, Math.min(upto, chapters.length)));
    setPublishing(true);
    if(!currentUser) return;
    const ok = await uploadEpub(currentUser, genres || [], chapters, selectedChapters, title, name, newSynopsis, imagePath, params?.id, imageUrl, selectedChapters.length, account);

    if (ok) {
      router.push('/explore');
    } else {
      alert('Error trying to publish your draft!');
    }
  };

  const handleConfirmDelete = async() => {
    if (!params.id) return;

    try{
      setDeleting(true);   
      if(!currentUser) return;         
      const success = await deleteEntireDraft(currentUser, params.id, imagePath);

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

  const urlToFile = async (croppedImage: string) => {
    const response = await fetch(croppedImage);
    const blob = await response.blob();
    
    // Create a new File object
    const file = new File([blob], "croppedImage.jpg", { type: blob.type });
    
    return file;
  };

  const onCropComplete = (_: Area, pixels: Area) => setCroppedAreaPixels(pixels);

  const handleCropConfirm = async () => {
      if (!croppedAreaPixels || !imageSrc || !currentUser) return;
  
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels); 
  
      setLocalPreview(croppedImage);
      setChooseCropped(false);
  
      // Start upload
      setLoading?.(true);
  
      try{
          const file = await urlToFile(croppedImage);
          const result = await reuploadBookImageToSupabase(filename, file, currentUser, imagePath, params?.id);
  
          if (result) {
            setImageUrl(result.downloadURL);
            setImagePath(result.filePath);
            //onUploaded?.(result.downloadURL, result.filePath); // tell parent to update
          }
      }finally {
        setLoading?.(false);
      }
    };
  


  return (
    <main className="flex w-screen h-screen overflow-hidden bg-gradient-to-br from-[#7F60F9]/20 from-15% via-[#7F60F9]/10 via-20% to-[#000000] to-60%">
      <div className='flex w-fit md:hidden border-r-[0.5px] z-50 border-white/50'>
          <Sider 
            setLoading={setLoading}
            userId={currentUser}
            setSearchResults={setSearchResults}
            setShowNotifications={setShowNotifications}
            setSettingsPopup={setSettingsPopup}
          />
      </div>

      <div className="flex flex-col w-full h-full relative">
          <div className='flex flex-col md:hidden w-full'>
            <Top 
              profileUrl={profileUrl}
            />
          </div>

          <div className="hidden md:flex w-full sticky top-0 z-40">
            <MediumHeader 
              setLoading={setLoading}
              userId={currentUser}
              setUserResults={setSearchResults}
              setShowNotifications={setShowNotifications}
              setSettingsPopup={setSettingsPopup}
            />
          </div>

          <div className={`flex md:flex-col w-full h-full items-center space-x-2 p-4 overflow-hidden`}>
              <div className="flex basis-1/4 halflg:basis-2/5 md:h-fit bg-[#7F60F9]/5 backdrop-blur-lg border border-[#7F60F9]/15 rounded-xl w-full h-full text-white">
                <DraftSider
                  draftId={params?.id}
                  chapterCount={chapterCount}
                  imageUrl={imageUrl}
                  title={title}
                  userId={currentUser || ''}
                  setGenres={setBookGenres}  
                  setLoading={setLoading}
                  imagePath={imagePath}
                  created_at={created}
                  setSynopsis={setSynopsis}
                  setEditTitle={setEditTitle} 
                  setGenrePopup={setGenrePopup}   
                  setPublishPopup={setPublishPopup}    
                  setConfirmDelete={setConfirmDelete} 
                  setFilename={setFilename}   
                  setImageSrc={setImageSrc}
                  setChooseCropped={setChooseCropped}
                  localPreview={localPreview}
                />
              </div>

              <div className="flex flex-col basis-3/4 halflg:basis-3/5 md:grow rounded-xl w-full h-full overflow-y-scroll px-4">

                  <div className='flex flex-col border-b  border-[#272831] space-y-2 py-2'>
                      <div className="flex space-x-2 text-white">
                          <p className="text-white font-semibold">Genres:</p>

                          {genres?.map((genre: string, index: any) => (
                            <div key={index} className="flex text-sm space-x-0.5 border-[0.5px] py-0.5 px-1 rounded-full font-light">
                              <p>{genre}</p>
                            </div>
                          ))}
                      </div>

                      <p className="text-white text-sms overflow-hidden break-words text-ellipsis whitespace-normal text-wrap"> <span className="font-semibold text-base">Synopsis:</span> {oldSynopsis}</p>

                  </div>

              
                  
                  {chapters.length !== 0 && (
                    <DraftList
                      userId={currentUser || ''}
                      chapters={chapters}
                      draftId={params?.id} 
                      setLoading={setLoading}
                      setChapters={setChapters}     
                      setChapterCount={setChapterCount}
                    />
                  )}
                
              </div>


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

              {synopsis && (
                <NewSynopsis 
                  value={newSynopsis === '' ? oldSynopsis : newSynopsis}
                  setValue={setNewSynopsis}
                  onCancel={() => setSynopsis(false)}
                  onConfirm={handleConfirm}
                />
              )}

              {genrePopup && (
                <GenrePopup 
                  onCancel={() => setGenrePopup(false)}
                  genres={genres || []}
                  setGenre={setGenre}
                  handleRemoveGenre={handleRemoveGenre}
                  onConfirm={handleGenreConfirm}
                />
              )}
          </div>

      </div>

      {searchResults && (
        <UserSearch 
          setSearchResults={setSearchResults}
          userId={currentUser || ''}
        />
      )}

      {settingsPopup && (
        <SettingsPopup 
            setSettingsPopup={setSettingsPopup}
            userId={currentUser}
            profileUrl={profileUrl}
            setProfileUrl={setProfileUrl}
            oldFilePath={filePath}
            setOldFilePath={setFilePath}
            name={name}
            username={username}
        />
      )}

      {showNotifications && (
        <Notifications 
          setShowNotifications={setShowNotifications}
          userId={currentUser}
        />
      )} 

      {publishPopup && (
          <PublishPopup 
            chaptersCount={chapters.length}
            defaultUpto={chapters.length}    
            title={title}
            onConfirm={handlePublish}
            onCancel={() => setPublishPopup(false)}
          />
      )}

      {confirmDelete && (
        <ConfirmDeleteDraft 
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(false)}
          bookTitle={title}
        />
      )}   

      {chooseCropped && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
            <div className="flex flex-col w-1/3 h-3/4 bg-black/60 text-white rounded-xl shadow-lg p-6">
                <div className="relative w-full h-full">    
                  <Cropper 
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1/1.5} // 1:1.5 aspect ratio
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="flex justify-center w-full space-x-2">
                    <button
                      onClick={handleCropConfirm}
                      className="px-2 py-3 w-5/12 text-white font-semibold bg-zinc-800 rounded-xl"
                    >
                      Crop
                    </button>
                  
                </div>
            </div>
        </div>
      )} 
        
      

      {/* One unified overlay */}
      {(booting || loading || publishing || deleting) && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          {publishing && <p className="text-lg text-white font-semibold mt-2">Publishing...</p>}
          {deleting && <p className="text-lg text-white font-semibold mt-2">Deleting draft...</p>}
        </div>
      )}
    </main>
  )
}

export default DraftPageClient