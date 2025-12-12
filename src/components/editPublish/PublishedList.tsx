import React, { useState } from 'react'
import { DraftChapters } from '../../..';
import { useRouter } from 'next/navigation';
import { deletePublishedChapter, updateCompletedBookChapter } from '../../../functions/editPublish/fetch';
import DeleteChapter from '../draft/DeleteChapter';

type Props = {
  chapters: DraftChapters[];
  bookId : string; 
  userId: string;
  setLoading: Function;
  setChapters: React.Dispatch<React.SetStateAction<DraftChapters[]>>;
  setChapterCount?: React.Dispatch<React.SetStateAction<number | null>>;
}

function PublishedList({chapters, bookId, userId, setLoading, setChapters, setChapterCount}: Props) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<null | { index: number; title: string }>(null);
  
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

  const handleDeleteChapter = async (index: number) => {
      if (!bookId || !userId) return;
  
      setLoading(true);
  
      // keep a snapshot for rollback
      const prevChapters = chapters;
  
      // update parent chapters immediately
      setChapters((prev) => prev.filter((_, i) => i !== index));
      setCompletionStates((prev) => prev.filter((_, i) => i !== index));
      setChapterCount?.((prev) => (prev == null ? prev : Math.max(0, prev - 1)));
  
      try {
        await deletePublishedChapter(userId, bookId, index);
      } catch (e) {
        // rollback on error
        setChapters(prevChapters);
        setCompletionStates(prevChapters.map((c) => Boolean(c.completed)));
        setChapterCount?.((prev) => (prev == null ? prev : prev + 1));
        console.error(e);
        alert('Failed to delete chapter');
      } finally {
        setLoading(false);
        setPendingDelete(null); // close popup
      }
    };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 h-fit w-full py-4">
      {chapters.length == 0 ? (
        <p className="text-gray-400">No chapters available.</p>
      ): (
        chapters.map((chapter, index) => (
          <div onClick={() => navigateToEditUnpublishedChapters(index, chapter.published)} key={index} className={`p-4 ${!chapter?.published && 'hover:cursor-pointer hover:bg-[#7F60F9]/5 hover:backdrop-blur-lg hover:border hover:border-[#7F60F9]/15'} rounded-xl hover:cursor-not-allowed`}>
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
                  <div className="flex justify-between text-slate-500 w-full space-x-4 text-sm items-center">
                      <div className="flex items-center space-x-2">
                          <p>Incomplete</p>
                          <div onClick={(event) => toggleComplete(index, event)} className={`${completionStates[index] ? 'bg-green-500 justify-end' : 'bg-white'} flex items-center border-1 border-white rounded-xl w-[60px] h-[22px]`}>
                          <div className={`flex ${completionStates[index] ? 'bg-white' : 'bg-green-500'}  w-[20px] h-[20px] rounded-xl ml-0.5 mr-0.5`}/>
                      </div>
                          <p>Complete</p>
                      </div>

                      <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { 
                        e.stopPropagation();
                        setPendingDelete({ index, title: chapter.title });
                      }} 
                      className={`hover:text-red-600 hover:underline`}>
                          <p>delete</p>
                      </div>
                  </div>
             
                )}
               
              
              </div>

          </div>
        ))
      )}  

      {pendingDelete && (
        <DeleteChapter 
          onConfirm={() => handleDeleteChapter(pendingDelete.index)}
          onCancel={() => setPendingDelete(null)}
          chapterTitle={pendingDelete.title}
        />
      )}
    </div>
  )
}

export default PublishedList