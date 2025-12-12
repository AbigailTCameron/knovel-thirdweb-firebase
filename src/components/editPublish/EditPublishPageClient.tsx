"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import { deleteEntireBook, editBookSynopsis, editPublishTitle, fetchPublishInfo, removePublishGenre, reuploadBookImage, updatePublishGenre, updateUploadEpub } from '../../../functions/editPublish/fetch';
import Sider from '../headers/Sider';
import Top from '../headers/Top';
import MediumHeader from '../headers/MediumHeader';
import EditPublishSider from './EditPublishSider';
import PublishedList from './PublishedList';
import NewSynopsis from '../draft/NewSynopsis';
import UserSearch from '../explore/popup/UserSearch';
import SettingsPopup from '../explore/popup/SettingsPopup';
import Notifications from '../community/Notifications';
import SpinLoader from '../loading/SpinLoader';
import GenrePopup from '../draft/GenrePopup';
import EditPublishedTitle from './EditPublishTitle';
import UpdatePublish from './UpdatePublish';
import { useActiveAccount } from 'thirdweb/react';
import ConfirmDeletePublish from './ConfirmDeletePublish';
import Cropper from 'react-easy-crop';
import { Area, getCroppedImg } from '../../../tools/cropImage';


const { auth } = initializeFirebaseClient();

function EditPublishPageClient({}) {
    const router = useRouter();
    const account = useActiveAccount(); // This is the currently signed-in user
    
  
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
    const params = useParams<{ id: string }>();
    const [profileUrl, setProfileUrl] = useState<string>(''); 
  
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imagePath, setImagePath] = useState<string>('');

    const [chapterCount, setChapterCount] = useState<number | null>(null);
    const [chapters, setChapters] = useState<any[]>([]); // Store the list of chapters
    const [title, setTitle] = useState<string>('');
    const [genres, setBookGenres] = useState<string[]>();
    const [oldSynopsis, setOldSynopsis] = useState<string>('');
    const [synopsis, setSynopsis] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [newSynopsis, setNewSynopsis] = useState<string>('');
    const [ipfsHash, setIpfsHash] = useState<string>('')
    const [authorName, setAuthorName] = useState<string>('');
    const [bytesId, setBytesId] = useState<`0x${string}` | null>(null);
    const [publishing, setPublishing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [searchResults, setSearchResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [filePath, setFilePath] = useState<string>('');
    const [created, setCreated] = useState();
    const [booting, setBooting] = useState<boolean>(true); 
    const [genre, setGenre] = useState<string>('');
    const [genrePopup, setGenrePopup] = useState(false);
    const [addGenre, setAddGenre] = useState<boolean>(false);

    const [editTitle, setEditTitle] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>('');

    const [publishPopup, setPublishPopup] = useState(false); 
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);  


    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [imageSrc, setImageSrc] = useState<string>('');
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);    
       
    const [chooseCropped, setChooseCropped] = useState<boolean>(false); 
    const [filename, setFilename] = useState(''); 
    
    

    useEffect(() => { 
  
      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, async(user) => {
        if (!user) {
          setCurrentUser(undefined);
          setBooting(false);

          router.replace("/explore"); // or "/"
          return;
        }

          setCurrentUser(user?.uid);
   
          const data = await getUserProfile(user.uid, setProfileUrl); 
          if(data){
            setAuthorName(data?.name);
            setUsername(data.username);
            setName(data.name);
            setFilePath(data.profilePicturePath);
          }
          setBooting(false);
      })
      return () => unsubscribe(); 
    
    }, []);
    
    useEffect(() => {
      if(params.id && currentUser){
        fetchPublishInfo(currentUser, params.id, setChapterCount, setChapters, setImageUrl, setTitle, setBookGenres, setOldSynopsis, setImagePath, setIpfsHash, setBytesId, setCreated); 
      }
    }, [params.id, genres, title, currentUser])
  
    const handleConfirm = async () => {
      if(currentUser){
        await editBookSynopsis(currentUser, params?.id, newSynopsis);
      }
      setSynopsis(false);
    }

  const handleGenreConfirm = async() => {
    if(genre){
      if(!currentUser) return;
      await updatePublishGenre(currentUser, params.id, genre.trim()); 
      setAddGenre(false); 
    }
  }

  const handleRemoveGenre = async(selectedGenre:string) => {
    if(!currentUser) return;
    await removePublishGenre(currentUser, params.id, selectedGenre);
  }
  
    
  const handleConfirmTitle = async() => {
    if(newTitle.trim() != title){
      if(!currentUser) return;
      await editPublishTitle(currentUser, newTitle, params.id);
    }
    setEditTitle(false);
  }

  const publishedCount = chapters.filter((c) => c?.published).length; 
  const totalChapters = chapters?.length ?? 0;


  const handlePublish = async (upto: number) => {
    if (upto < publishedCount || upto > chapters.length) return;
    if(!currentUser || !bytesId) return;

    const selectedChapters = chapters.slice(0, upto); // prefix only

    setPublishing(true);
    
    const synopsis = newSynopsis !== '' ? newSynopsis : oldSynopsis
    await updateUploadEpub(title, authorName, synopsis, chapters, selectedChapters, currentUser, genres || [], imageUrl, ipfsHash, bytesId, params.id, upto, account).then(success => {
      if(success){
        router.push("/explore");
      }else{
        alert("Error trying to your draft!")
      }
    })
  };

  const handleConfirmDelete = async() => {
    if(params.id){
      setDeleting(true);
      router.push("/explore");

      if(!currentUser || !bytesId) return;
      const success = await deleteEntireBook(currentUser, params.id, imageUrl, ipfsHash, bytesId, account);
      if(!success){
        console.log('could not delete book');
      }
    }
  }

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const urlToFile = async (croppedImage: string) => {
    const response = await fetch(croppedImage);
    const blob = await response.blob();
    
    // Create a new File object
    const file = new File([blob], "croppedImage.jpg", { type: blob.type });
    
    return file;
  };

  const handleCropConfirm = async () => {
    if (croppedAreaPixels && imageSrc) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels); 

      setChooseCropped(false); 

      urlToFile(croppedImage).then((file) => { 
        if(currentUser){
          reuploadBookImage(filename, file, currentUser, imagePath, params.id); 
        }
        
      })

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
              <div className="flex basis-1/4 halflg:basis-2/5 md:h-fit rounded-xl w-full h-full bg-[#7F60F9]/5 backdrop-blur-lg border border-[#7F60F9]/15 text-white">
                  <EditPublishSider 
                    imageFile={imageUrl}
                    title={title}
                    chapterCount={chapterCount}
                    bookId={params.id}
                    setLoading={setLoading}
                    created_at={created}
                    setSynopsis={setSynopsis}
                    setGenrePopup={setGenrePopup}
                    setEditTitle={setEditTitle}
                    setPublishPopup={setPublishPopup}
                    setConfirmDelete={setConfirmDelete}
                    setFilename={setFilename}
                    setImageSrc={setImageSrc}
                    setChooseCropped={setChooseCropped}
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
                      <PublishedList 
                        chapters={chapters}
                        bookId={params?.id} 
                        userId={currentUser || ''}
                        setLoading={setLoading}
                        setChapters={setChapters}
                        setChapterCount={setChapterCount}
                      />
                    )}
              </div>

              {synopsis && (
                <NewSynopsis 
                  value={newSynopsis === '' ? oldSynopsis : newSynopsis}
                  setValue={setNewSynopsis}
                  onCancel={() => setSynopsis(false)}
                  onConfirm={handleConfirm}
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

      {chooseCropped && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
                <div className="flex flex-col w-1/3 h-3/4 bg-black/60 text-white rounded-xl shadow-lg p-6">
                    <div className="relative w-full h-full">    
                      <Cropper 
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1/1.6} // 1:1.5 aspect ratio
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


      {publishPopup && (
        <UpdatePublish 
          title={title}
          onConfirm={handlePublish}
          onCancel={() => setPublishPopup(false)}
          publishedCount={publishedCount}  
          chaptersCount={totalChapters}   
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

      
        {editTitle && (
          <EditPublishedTitle 
            onCancel={() => setEditTitle(false)}
            setTitle={setNewTitle}
            onConfirm={handleConfirmTitle}
          />
        )}

        {confirmDelete && (
          <ConfirmDeletePublish 
            onConfirm={handleConfirmDelete}
            onCancel={() => setConfirmDelete(false)}
            bookTitle={title}
          />
        
        )}



      {showNotifications && (
        <Notifications 
          setShowNotifications={setShowNotifications}
          userId={currentUser}
        />
      )}

      {genrePopup && (
        <GenrePopup
          genres={genres || []}
          setGenre={setGenre}
          onCancel={() => setGenrePopup(false)}
          onConfirm={handleGenreConfirm}
          handleRemoveGenre={handleRemoveGenre}
        />
      )}

      {/* ✅ Overlay with blur effect */}
      {booting || loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}

      {deleting && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Deleting...</p>
        </div>
      )}

      {publishing && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Publishing...</p>
        </div>
      )}
    </main>
  )
}

export default EditPublishPageClient