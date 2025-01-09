'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import NewSynopsis from '@/components/draft/NewSynopsis';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import { editBookSynopsis, fetchPublishInfo } from '../../../../functions/editPublish/fetch';
import EditPublishSider from '@/components/editPublish/EditPublishSider';
import PublishedList from '@/components/editPublish/PublishedList';
import UploadingBook from '@/components/loading/UpdatingBook';

type Props = {
  
}
const { auth } = initializeFirebaseClient();

function EditPublish({}: Props) {
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

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
          const data = await getUserProfile(user.uid, setProfileUrl); 
          if(data){
            setAuthorName(data?.name);
          }
             
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  
  }, []);

  useEffect(() => {
    if(params.id && currentUser){
      fetchPublishInfo(currentUser, params.id, setChapterCount, setChapters, setImageUrl, setTitle, setBookGenres, setOldSynopsis, router, setImagePath, setIpfsHash, setBytesId); 
    }
  }, [params.id, genres, title, currentUser])

  const handleConfirm = async () => {
    if(currentUser){
      await editBookSynopsis(currentUser, params?.id, newSynopsis);
    }
    setSynopsis(false);
  }

  if(publishing){
    return (
      <div className="w-screen h-screen">
          <UploadingBook />
      </div>
    )
  }


  return (
    <main className="flex w-screen h-screen flex-col items-center">
      <div className="sticky top-0 w-full z-50">
          <ExploreHeader profileUrl={profileUrl}/>
      </div>

      <div className={`flex md:flex-col w-full h-full items-center space-x-2 p-4 overflow-hidden`}>
          <div className="flex basis-1/4 bg-[#171717] rounded-xl w-full h-full text-white">
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
                <PublishedList 
                  chapters={chapters}
                  bookId={params?.id} 
                  userId={currentUser || ''}
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

export default EditPublish