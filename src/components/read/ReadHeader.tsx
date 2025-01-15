import React from "react";
import Menu from "../icons/Menu";
import BookmarkPage from "../icons/BookmarkPage";

type Props = {
  setShowChapters: Function;
  showChapters?: boolean;
  title?: string;
  onBookmark: () => void; // Add a prop for bookmarking
  isBookmarked ?: any;
};

function ReadHeader({ setShowChapters, showChapters, title, onBookmark, isBookmarked}: Props) {
  return (
    <div className="relative bg-[#1e1e1e] rounded-t-xl flex w-full h-full text-white px-4 py-2">
      <Menu
        onClick={() => setShowChapters(!showChapters)}
        className="size-8 stroke-2 hover:cursor-pointer hover:stroke-slate-400"
      />

      <div className="flex w-full self-center items-center justify-center">
        <h2>{title}</h2>
      </div>

      <div className="absolute flex right-1 top-0 z-10">
          <BookmarkPage          
            onClick={onBookmark} // Call the onBookmark handler
            className={`${isBookmarked ? 'stroke-[#FA0000]' : 'stroke-white'}`}
            fill={`${isBookmarked ? '#FA0000' : 'none'}`}
          />


      </div>
    </div>
  );
}

export default ReadHeader;
