import React, { useState } from 'react'
import { DraftChapters } from '../../..';
import { useRouter } from 'next/navigation';
import { updateCompletedBookChapter } from '../../../functions/editPublish/fetch';

type Props = {
  chapters: DraftChapters[];
  bookId : string; 
  userId: string;
}

function PublishedList({chapters, bookId, userId}: Props) {
  const router = useRouter();
  const [completionStates, setCompletionStates] = useState<boolean[]>(
    chapters.map((chapter) => chapter.completed) // Initialize with the completed status of each chapter
  );

  const toggleComplete = async(index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click event from bubbling up
    setCompletionStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );

    // Get the new completed status
    const newCompleted = !completionStates[index];

    if(bookId){
      await updateCompletedBookChapter(userId, bookId, index, newCompleted);
    }
  };

  const navigateToEditUnpublishedChapters = async(index: number, published: boolean) => {
    if(!published){
      router.push(`/editChapter/${bookId}/${index}`);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-fit w-full py-4">
      {chapters.length == 0 ? (
        <p className="text-gray-400">No chapters available.</p>
      ): (
        chapters.map((chapter, index) => (
          <div onClick={() => navigateToEditUnpublishedChapters(index, chapter.published)} key={index} className={`p-4 ${!chapter?.published && 'hover:cursor-pointer hover:bg-[#171717]'} rounded-xl`}>
              {/* <div className="text-slate-500 font-light text-xs">
                {new Date(chapter.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div> */}

              <div className="text-slate-500">
                  <p>Chapter {index + 1}</p>   
              </div>

              <div className="text-slate-500 text-xl font-semibold">
                  <p>{chapter.title}</p>   
              </div>

              <div className="flex text-slate-500 space-x-4 text-sm items-center">
                {chapter?.published && (
                  <p>Published</p>
                )}
                

                {!chapter?.published && (
                  <div className="p-4 hover:cursor-pointer hover:bg-[#1b1c22] rounded-xl">
                   <p>Incomplete</p>
                   <div onClick={(event) => toggleComplete(index, event)} className={`${completionStates[index] ? 'bg-green-500 justify-end' : 'bg-white'} flex items-center border-1 border-white rounded-xl w-[60px] h-[22px]`}>
                     <div className={`flex ${completionStates[index] ? 'bg-white' : 'bg-green-500'}  w-[20px] h-[20px] rounded-xl ml-0.5 mr-0.5`}>
                     </div>
                   </div>
                   <p>Complete</p>
                 </div>
             
                )}
               
              
              </div>

          </div>
        ))
      )}  
    </div>
  )
}

export default PublishedList