"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import { editBookSynopsis, fetchPublishInfo } from '../../../functions/editPublish/fetch';
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


type Props = {}

const { auth } = initializeFirebaseClient();

function EditPublishPageClient({}: Props) {
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
    const params = useParams<{ id: string }>();
    const [profileUrl, setProfileUrl] = useState<string>(''); 
  
  
    const router = useRouter();
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
    const [bytesId, setBytesId] = useState<string>('');
    const [publishing, setPublishing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [searchResults, setSearchResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [filePath, setFilePath] = useState<string>('');
    const [created, setCreated] = useState();

    useEffect(() => { 
      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, async(user) => {
          setCurrentUser(user?.uid);
          if(user){
            const data = await getUserProfile(user.uid, setProfileUrl); 
            if(data){
              setAuthorName(data?.name);
              setUsername(data.username);
              setName(data.name);
              setFilePath(data.profilePicturePath);
            }
                
          }else {
            setProfileUrl(''); 
          }
      })
      return () => unsubscribe(); 
    
    }, []);
    
    useEffect(() => {
      if(params.id && currentUser){
        fetchPublishInfo(currentUser, params.id, setChapterCount, setChapters, setImageUrl, setTitle, setBookGenres, setOldSynopsis, router, setImagePath, setIpfsHash, setBytesId, setCreated); 
      }
    }, [params.id, genres, title, currentUser])
  
    const handleConfirm = async () => {
      if(currentUser){
        await editBookSynopsis(currentUser, params?.id, newSynopsis);
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
                  <EditPublishSider 
                    imageFile={imageUrl}
                    title={title}
                    chapterCount={chapterCount}
                    genres={genres || []}
                    bookId={params.id}
                    userId={currentUser || ''}
                    setLoading={setLoading}
                    authorName={authorName}
                    synopsis={newSynopsis !== '' ? newSynopsis : oldSynopsis}
                    chapters={chapters}
                    ipfsHash={ipfsHash}
                    bytesId={bytesId as `0x${string}`}
                    imageFilePath={imagePath}
                    setPublishing={setPublishing}
                    created_at={created}
                    setSynopsis={setSynopsis}
                    setDeleting={setDeleting}
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


      {/* ✅ Overlay with blur effect */}
      {loading && (
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