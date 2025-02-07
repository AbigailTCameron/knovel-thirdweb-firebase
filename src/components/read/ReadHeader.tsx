import React from "react";
import Menu from "../icons/Menu";
import BookmarkPage from "../icons/BookmarkPage";
import { useRouter } from "next/navigation";
import ArrowLeft from "../icons/ArrowLeft";

type Props = {
  setShowChapters: Function;
  showChapters?: boolean;
  title?: string;
  onBookmark: () => void; // Add a prop for bookmarking
  isBookmarked ?: any;
  bookId : string;
};

function ReadHeader({ setShowChapters, showChapters, title, onBookmark, isBookmarked, bookId}: Props) {
  const router = useRouter(); 

  return (
    <div className="relative bg-[#1e1e1e] rounded-t-xl flex w-full h-full text-white px-4 py-2">
      <div onClick={() => router.push(`/book/${bookId}`)} className="flex self-center items-center text-white hover:cursor-pointer">
          <ArrowLeft 
            className="stroke-white size-6 hover:stroke-slate-400"
          />
      </div>
   

      <div className="flex w-full self-center text-center items-center space-x-3 justify-center">
        <h2>{title}</h2>
        <Menu
          onClick={() => setShowChapters(!showChapters)}
          className="size-8 stroke-2 hover:cursor-pointer hover:stroke-slate-400"
        />
      </div>

      <div className="absolute flex right-1 top-0 z-10">

          <BookmarkPage          
            onClick={onBookmark} // Call the onBookmark handler
            className={`sm:hidden ${isBookmarked ? 'stroke-[#FA0000]' : 'stroke-white'}`}
            fill={`${isBookmarked ? '#FA0000' : 'none'}`}
          />


      </div>
    </div>
  );
}

export default ReadHeader;
