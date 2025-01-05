'use client'
import React, { useEffect, useState } from 'react'
import ExploreHeader from '@/components/headers/ExploreHeader';
import { useParams, useRouter } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import { editDraftSynopsis, fetchChapterInfo } from '../../../../functions/drafts/fetch';
import DraftSider from '@/components/draft/DraftSider';
import DraftList from '@/components/draft/DraftList';
import NewSynopsis from '@/components/draft/NewSynopsis';


type Props = {}
const { auth } = initializeFirebaseClient();
function Draft({}: Props) {
  const params = useParams<{ id: string }>();

  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 

  const [chapterCount, setChapterCount] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [genres, setBookGenres] = useState<string[]>();
  const [synopsis, setSynopsis] = useState<boolean>(false);
  const [oldSynopsis, setOldSynopsis] = useState<string>('');
  const [chapters, setChapters] = useState<any[]>([]); // Store the list of chapters
  const [newSynopsis, setNewSynopsis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>('');
  const [imagePath, setImagePath] = useState<string>('');

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
          await getUserProfile(user.uid, setProfileUrl);    
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  
  }, []);

  useEffect(() => {
    if(params.id && currentUser){
      fetchChapterInfo(currentUser, params.id, setChapterCount, setChapters, setImageFile, setTitle, setBookGenres, setOldSynopsis, setAuthorName, router, setImagePath);
    }
  }, [params.id, genres, title, currentUser])

  const handleConfirm = async () => {
    if(currentUser){
      await editDraftSynopsis(currentUser, params?.id, newSynopsis);
    }
    setSynopsis(false);
  }


  return (
    <main className="flex flex-col w-screen h-screen items-center">
      <div  className="sticky top-0 w-full z-50">
        <ExploreHeader  profileUrl={profileUrl}/> 
      </div>

      <div className={`flex md:flex-col w-full h-full items-center space-x-2 p-4 overflow-hidden`}>
          <div className="flex basis-1/4 bg-[#171717] rounded-xl w-full h-full text-white">
            <DraftSider
              draftId={params?.id}
              chapterCount={chapterCount}
              imageFile={imageFile}
              title={title}
              userId={currentUser || ''}
              genres={genres || []}
              setLoading={setLoading}
              name={authorName}
              synopsis={newSynopsis !== '' ? newSynopsis : oldSynopsis}
              chapters={chapters}
              imagePath={imagePath}
            />
          </div>

          <div className="flex flex-col basis-3/4 rounded-xl w-full h-full overflow-y-scroll">
              <div onClick={() => setSynopsis(true)} className="p-4 text-gray-500 hover:text-gray-600 hover:cursor-pointer">
                {oldSynopsis ? (
                  <p>{oldSynopsis}</p>
                ) : (
                  <p>+ click to add a synopsis</p>
                )}
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
    </main>
  )
}

export default Draft