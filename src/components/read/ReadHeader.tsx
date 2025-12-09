import React from "react";
import Menu from "../icons/Menu";
import BookmarkPage from "../icons/BookmarkPage";
import { useRouter } from "next/navigation";
import ArrowLeft from "../icons/ArrowLeft";

type Props = {
  setShowChapters: (value: boolean) => void;
  showChapters?: boolean;
  title?: string;
  bookId : string;
  theme: string;
};

function ReadHeader({ setShowChapters, showChapters, title, bookId, theme}: Props) {
  const router = useRouter(); 

  return (
    <div className={`relative bg-[#1e1e1e] ${theme === "light" && "bg-white"} rounded-t-xl flex w-full h-full text-white px-4 py-2`}>
      <div onClick={() => router.push(`/book/${bookId}`)} className="flex self-center items-center text-white hover:cursor-pointer">
          <ArrowLeft 
            className={`stroke-white size-6 hover:stroke-slate-400  ${theme === "light" && "stroke-black"}`}
          />
      </div>
   

      <div className={`flex w-full self-center text-center items-center space-x-3 justify-center ${theme === "light" && "text-black"}`}>
        <h2>{title}</h2>
        <Menu
          onClick={() => setShowChapters(!showChapters)}
          className={`size-8 stroke-2 hover:cursor-pointer hover:stroke-slate-400  ${theme === "light" && "stroke-black"}`}
        />
      </div>

      {/* <div className="absolute flex right-1 top-0 z-10">

          <BookmarkPage          
            onClick={onBookmark} // Call the onBookmark handler
            className={`sm:hidden ${isBookmarked ? 'stroke-[#FA0000]' : 'stroke-white'}`}
            fill={`${isBookmarked ? '#FA0000' : 'none'}`}
          />


      </div> */}
    </div>
  );
}

export default ReadHeader;
