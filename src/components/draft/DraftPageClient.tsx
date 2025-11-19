"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import { editDraftSynopsis, fetchChapterInfo } from '../../../functions/drafts/fetch';
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


type Props = {}
const { auth } = initializeFirebaseClient();

function DraftPageClient({}: Props) {
    const router = useRouter();
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
                  setGenres={setBookGenres}  
                  setLoading={setLoading}
                  setImageUrl={setImageUrl}          
                  setImagePath={setImagePath} 
                  name={authorName}
                  newSynopsis={newSynopsis !== '' ? newSynopsis : oldSynopsis}
                  chapters={chapters}
                  imagePath={imagePath}
                  setPublishing={setPublishing}
                  setDeleting={setDeleting}
                  created_at={created}
                  setSynopsis={setSynopsis}
                  setTitle={setTitle}             // 👈 NEW: lift title updates to the page
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