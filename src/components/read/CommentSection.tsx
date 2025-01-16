import React, { useEffect, useState } from 'react'
import { Comment } from '../../..';
import FlowButton from '../buttons/FlowButton';
import XMark from '../icons/XMark';
import CommentInfo from './CommentInfo';
import { addComment, fetchbookComments } from '../../../functions/comments/fetch';
import Profile from '../icons/Profile';


type Props = {
  profileUrl: string;
  userId : string;
  bookId : string;
  authorId: string;
  setShowChat : Function;
  title : string;
  username?: string;
  name?: string;
  setUsernamePopup: Function;
}

function CommentSection({profileUrl, userId, bookId, authorId, setShowChat, title, username, name, setUsernamePopup}: Props) {
  const [commentText, setCommentText] = useState(''); 
  const [comments, setComments] = useState<Comment[]>([]);
  
  useEffect(() => {
    grabComments()
  }, [userId, bookId])

  const grabComments = async() => {
    if(authorId){
      await fetchbookComments(authorId, bookId, setComments);
    }
  }

  const handlePostComment = async () => {
    if(!username && !name){
      setUsernamePopup(true);
      return;
    }
    if (!commentText.trim()) return; // Avoid empty comments

    const result = await addComment(authorId, bookId, userId, commentText, title);
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
    <div className="relative flex flex-col rounded-xl bg-[#111111] w-full h-full text-white px-2 overflow-hidden">
        <div className="relative text-lg font-semibold flex items-center justify-center p-4">
          <p>{comments.length} Comments</p>
          
        
          <XMark onClick={() => setShowChat((prev: boolean) => !prev)} className="hover:cursor-pointer stroke-white absolute right-2 size-6"/>
         
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
                />
      
            </div>

          ))}
        </div>

  

        <div className="absolute backdrop-blur-lg flex w-full h-fit items-center justify-center bottom-0 border-t border-[#282828] px-4 py-4 space-x-2">
            {profileUrl ? (
                <img 
                  className="rounded-full w-[40px] h-[40px]"
                  src={profileUrl}
                />
            ) : (
                <Profile 
                 className="rounded-full w-[40px] h-[40px] stroke-white"
                />
            )}
        
        
            <textarea
              className="flex items-center field-sizing:content focus:outline-none bg-[#303030] w-full h-full rounded-3xl px-3 py-2 font-normal resize-none"
              placeholder='Add a comment...'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

                
            <div onClick={handlePostComment}>
                <FlowButton 
                  title="post"
                  buttonRadius='rounded-3xl'
                  buttonWidth='w-fit'
                />

            </div>
           
        </div>

    </div>
  )
}

export default CommentSection