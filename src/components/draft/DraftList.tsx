import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { DraftChapters } from '../../..';
import { updateCompletedChapter } from '../../../functions/drafts/fetch';
import { formatDate } from '../../../tools/formatDate';

type Props = {
  chapters: DraftChapters[];
  draftId ?: string;
  setLoading : Function;
  userId: string
}

function DraftList({chapters, draftId, setLoading, userId}: Props) {
  const router = useRouter();
  const [completionStates, setCompletionStates] = useState<boolean[]>(
    chapters.map((chapter) => chapter.completed) // Initialize with the completed status of each chapter
  );

  const [navigatingIndex, setNavigatingIndex] = useState<number | null>(null);
  const baseHref = useMemo(() => draftId ? `/edit/${draftId}` : '', [draftId]);


  const handleBookClick = async(index: number) => {
    if (!draftId) return;
    if (navigatingIndex !== null) return; // prevent double-click spam

    setNavigatingIndex(index);
    setLoading(true); 

    const href = `${baseHref}/${index}`;

    try{
      router.prefetch(href);
      await router.push(href);
    } catch {
      setLoading(false);
      setNavigatingIndex(null);
    }
  };

  const toggleComplete = async(index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click event from bubbling up
    setCompletionStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );

    // Get the new completed status
    const newCompleted = !completionStates[index];

    if(draftId){
      try{
        await updateCompletedChapter(userId, draftId, index, newCompleted);
      }catch {
        // optional: revert local state on error
        setCompletionStates((prev) =>
          prev.map((state, i) => (i === index ? !state : state))
        );
      }
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 h-fit w-full py-4">
      {chapters.length == 0 ? (
         <p className="text-gray-400">No chapters available.</p>
      ): (
        chapters.map((chapter, index) => {
          const isNav = navigatingIndex === index;
          return(
            <div 
              onMouseEnter={() => draftId && router.prefetch(`${baseHref}/${index}`)}
              onClick={() => handleBookClick(index)}  
              key={index} 
              className={`p-4 rounded-xl hover:cursor-pointer hover:bg-[#1b1c22] ${
                isNav ? 'opacity-60 pointer-events-none' : ''
              }`}>
                {/* <div className="text-slate-500 font-light text-xs">
                  {new Date(chapter.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div> */}

                <div className="text-white">
                    <p>Chapter {index + 1}</p>   
                </div>

                <div className="text-slate-500 text-xl font-semibold">
                    <p>{chapter.title}</p>   
                </div>

                <div className="flex text-slate-500 space-x-4 text-sm items-center">

                  <div className="flex items-center space-x-2">
                    <p>Incomplete</p>
                    <div onClick={(event) => toggleComplete(index, event)} className={`${completionStates[index] ? 'bg-green-500 justify-end' : 'bg-white'} flex items-center border-1 border-white rounded-xl w-[60px] h-[22px]`}>
                      <div className={`flex ${completionStates[index] ? 'bg-white' : 'bg-green-500'}  w-[20px] h-[20px] rounded-xl ml-0.5 mr-0.5`}>
                      </div>
                    </div>
                    <p>Complete</p>
                  </div>
              
                
                </div>

            </div>
          )
        })
      )}  
    </div>
  )
}

export default DraftList