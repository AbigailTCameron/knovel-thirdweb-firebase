import React, { useCallback, useEffect, useState } from 'react'
import { Comment } from '../../..';
import XMark from '../icons/XMark';
import CommentInfo from './CommentInfo';
import { addComment, fetchbookComments } from '../../../functions/comments/fetch';
import Profile from '../icons/Profile';
import Image from 'next/image';


type Props = {
  profileUrl: string;
  userId : string;
  bookId : string;
  authorId: string;
  setShowChat : React.Dispatch<React.SetStateAction<boolean>>;
  title : string;
  username: string;
  name: string;
  setUsernamePopup: React.Dispatch<React.SetStateAction<boolean>>;
  onRequireWalletConnect?: () => void;
  theme: string;
}

function CommentSection({profileUrl, userId, bookId, authorId, setShowChat, title, username, name, setUsernamePopup, onRequireWalletConnect, theme}: Props) {
  const [commentText, setCommentText] = useState(''); 
  const [comments, setComments] = useState<Comment[]>([]);


  const grabComments = useCallback(async() => {
    if(authorId){
      await fetchbookComments(authorId, bookId, setComments);
    }
  }, [authorId, bookId])

  
  useEffect(() => {
    grabComments()
  }, [userId, grabComments])

  const handlePostComment = async () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }

    if(!username && !name){
      setUsernamePopup(true);
      return;
    }
    if (!commentText.trim()) return; // Avoid empty comments

    const result = await addComment(authorId, bookId, userId, commentText, title, username, name);
    if (result.success) {
      const newComment: Comment = {
        commenter: userId,
        comment: commentText,
        id: result.commentId || 'generated-uuid',  // Use the commentId returned by the backend
        createdAt: new Date().toISOString(), // Use ISO string for proper date format
      };
  
     setComments([newComment, ...comments]); 
     setCommentText(''); // Clear input field
    } else {
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
  };


  return (
    <div className={`relative flex flex-col rounded-xl ${theme === "light" ? "bg-white text-black" : "bg-[#7F60F9]/5 backdrop-blur-lg border border-[#7F60F9]/15 text-white"} w-full h-full px-2 overflow-hidden`}>
        <div className={`relative text-lg font-semibold flex items-center justify-center p-4`}>
          <p>{comments.length} Comments</p>
          
        
          <XMark onClick={() => setShowChat((prev: boolean) => !prev)} className={`hover:cursor-pointer ${theme === "light" ? "stroke-black" : "stroke-white"} absolute right-2 size-6`}/>
         
        </div>

        <div className="flex flex-col space-y-6 px-2 py-4 overflow-x-hidden overflow-y-auto pb-20 max-h-[calc(100%-120px)]">
          {comments
          .map((comment, index) => (
            <div key={index} className="w-full">
            
                <CommentInfo 
                  authorId={authorId}
                  commenterId={comment.commenter}
                  comment={comment.comment}
                  date={comment.createdAt}
                  userId={userId}
                  commentId={comment.id}
                  bookId={bookId}
                  onDeleteComment={handleDeleteComment} // Pass delete handler
                  onRequireWalletConnect={onRequireWalletConnect}
                  theme={theme}
                />
      
            </div>

          ))}
        </div>

  

        <div className={`absolute backdrop-blur-lg flex w-full h-fit items-center justify-center bottom-0 ${theme === "dark" && "border-t border-[#282828]"} px-4 py-4 space-x-2`}>
            {profileUrl ? (
                <Image 
                  className="rounded-full w-[40px] h-[40px]"
                  src={profileUrl}
                  alt=""
                  width="500"
                  height="500"
                />
            ) : (
                <Profile 
                 className="rounded-full w-[40px] h-[40px] stroke-white"
                />
            )}
        
        
            <textarea
              className={`flex items-center field-sizing:content focus:outline-none ${theme === "light" ? "bg-slate-200" : "bg-[#7F60F9]/20 backdrop-blur-lg border border-[#7F60F9]/15"} w-full h-full rounded-3xl px-3 py-2 font-normal resize-none`}
              placeholder='Add a comment...'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

                
            <div onClick={handlePostComment}>
                <div className={`relative w-fit text-center rounded-xl px-10 py-4 sm:py-1 sm:text-sm ${theme === "light" ? "text-black border-2 border-black" : "bg-white/30 text-white"} overflow-hidden font-semibold group hover:cursor-pointer `}>
                  <p>post</p>
                </div>
            </div>
           
        </div>
    </div>
  )
}

export default CommentSection