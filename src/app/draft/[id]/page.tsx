'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import { editDraftSynopsis, fetchChapterInfo } from '../../../../functions/drafts/fetch';
import DraftSider from '@/components/draft/DraftSider';
import DraftList from '@/components/draft/DraftList';
import NewSynopsis from '@/components/draft/NewSynopsis';
import SpinLoader from '@/components/loading/SpinLoader';
import Sider from '@/components/headers/Sider';
import Top from '@/components/headers/Top';
import UserSearch from '@/components/explore/popup/UserSearch';
import Notifications from '@/components/community/Notifications';
import SettingsPopup from '@/components/explore/popup/SettingsPopup';
import MediumHeader from '@/components/headers/MediumHeader';


type Props = {}
const { auth } = initializeFirebaseClient();
function Draft({}: Props) {
  const params = useParams<{ id: string }>();

  const router = useRouter();
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

  
  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data =  await getUserProfile(user.uid, setProfileUrl);    
         if(data){
          setFilePath(data.profilePicturePath);
          setUsername(data.username);
          setName(data.name);
         }
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  
  }, []);

  useEffect(() => {
    if(params.id && currentUser){
      fetchChapterInfo(currentUser, params.id, setChapterCount, setChapters, setImageUrl, setTitle, setBookGenres, setOldSynopsis, setAuthorName, router, setImagePath, setCreated);
    }
  }, [params.id, genres, title, currentUser])

  const handleConfirm = async () => {
    if(currentUser){
      await editDraftSynopsis(currentUser, params?.id, newSynopsis);
    }
    setSynopsis(false);
  }


  return (
    <main className="flex w-screen h-screen overflow-hidden">
      <div className='flex w-fit md:hidden border-r-[0.5px] border-white/50'>
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
              setLoading={setLoading}
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
              <div className="flex basis-1/4 halflg:basis-2/5 md:h-fit bg-[#171717] rounded-xl w-full h-full text-white">
                <DraftSider
                  draftId={params?.id}
                  chapterCount={chapterCount}
                  imageUrl={imageUrl}
                  title={title}
                  userId={currentUser || ''}
                  genres={genres || []}
                  setLoading={setLoading}
                  name={authorName}
                  newSynopsis={newSynopsis !== '' ? newSynopsis : oldSynopsis}
                  chapters={chapters}
                  imagePath={imagePath}
                  setPublishing={setPublishing}
                  setDeleting={setDeleting}
                  created_at={created}
                  setSynopsis={setSynopsis}
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
                    />
                  )}
                
              </div>

              {synopsis && (
                <NewSynopsis 
                  onCancel={() => setSynopsis(false)}
                  setNewSynopsis={setNewSynopsis}
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


      {/* ✅ Overlay with blur effect */}
      {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}

      {/* ✅ Overlay with blur effect */}
      {publishing && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Publishing...</p>
        </div>
      )}

      {deleting && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Deleting draft...</p>
        </div>
      )}
    </main>
  )
}

export default Draft