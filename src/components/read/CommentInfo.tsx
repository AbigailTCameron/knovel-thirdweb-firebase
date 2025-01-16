import React, { useEffect, useState } from 'react'
import SolidHeart from '../icons/SolidHeart';
import EmptyHeart from '../icons/EmptyHeart';
import { timeAgo } from '../../../tools/timeago';
import { deleteComment, fetchCommenterImageAndName, fetchLikesCount, toggleLikeComment } from '../../../functions/comments/fetch';
import Profile from '../icons/Profile';



type Props = {
  commenterId: string;
  comment: string;
  date: string;
  userId: string;
  commentId: string;
  bookId: string; 
  authorId: string
  onDeleteComment: (commentId: string) => void; 
}

function CommentInfo({commenterId, comment, date, userId, commentId, bookId, onDeleteComment, authorId}: Props) {
  const [profileUrl, setProfileUrl] = useState('');
  const [fullname, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [liked, setLiked] = useState(false); 
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchCommenterInfo = async() => {
      await fetchCommenterImageAndName(commenterId, setProfileUrl, setUsername, setFullName)
      const numOfLikes = await fetchLikesCount(authorId, bookId, commentId, userId, setLiked); 
      setLikesCount(numOfLikes);
    }

    fetchCommenterInfo();
    
  }, [commenterId]);

  const handleToggleLike = async () => {
    const { success, liked: newLiked } = await toggleLikeComment(authorId, bookId, commentId, userId);
    if (success) {
      setLiked(newLiked ?? false);
      setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    } else {
      console.error('Failed to toggle like');
    }
  };

  const handleDelete = async () => {
    const { success } = await deleteComment(authorId, bookId, commentId);
    if (success) {
      onDeleteComment(commentId); // Update the parent state
    } else {
      alert('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div className="flex space-x-3 w-full">
        <div className="flex-none">
          {profileUrl ? (
             <img 
              className="w-[30px] h-[30px] rounded-full"
              src={profileUrl}
             />
          ) : (
            <Profile 
              className="w-[30px] h-[30px] rounded-full stroke-white"
            />
          )}
           
        </div>
      
        <div className="flex-grow flex-col -mt-1">
          <p className="text-sm">{fullname || username} •  <span className="text-xs">{timeAgo(date)}</span></p>
          <p className="text-sm break-words break-all whitespace-normal text-wrap max-w-full">{comment}</p>

          <div className="flex text-xs mt-1 space-x-4">
            {/* <p className='hover:cursor-pointer hover:underline'>Reply</p> */}
            {commenterId === userId && (
              <p 
                onClick={handleDelete}
                className="hover:cursor-pointer hover:underline hover:text-red-500">delete</p>
            )}
          </div>
          
        </div>
      
        <div className='flex flex-col flex-none self-center items-center justify-center text-xs'>
            {liked ?  (
              <SolidHeart 
                onClick={handleToggleLike} 
                className="stroke-white fill-white size-4 hover:cursor-pointer"
              />

            ) : (
              <EmptyHeart
                onClick={handleToggleLike} 
                className="stroke-white size-4 hover:cursor-pointer"
              />
            )}
            <p>{likesCount}</p>
        </div>
    </div>
  )
}

export default CommentInfo