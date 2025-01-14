import React from "react";
import Menu from "../icons/Menu";
import Bookmark from "../icons/Bookmark";

type Props = {
  setShowChapters: Function;
  showChapters?: boolean;
  title?: string;
};

function ReadHeader({ setShowChapters, showChapters, title }: Props) {
  return (
    <div className="bg-[#1e1e1e] rounded-t-xl flex w-full h-full text-white px-4 py-2">
      <Menu
        onClick={() => setShowChapters(!showChapters)}
        className="size-8 stroke-2 hover:cursor-pointer hover:stroke-slate-400"
      />

      <div className="flex w-full self-center items-center justify-center">
        <h2>{title}</h2>
      </div>

      <div className="flex right-2 top-0 bg-white">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="10px" y="10px" viewBox="0 0 24 24" enable-background="new 0 0 24 24">
<g id="Layer_1_copy">
</g>
<path d="M15,5H8C6.9,5,6,5.9,6,7v3h3v11l4-3l4,3V7C17,5.9,16.1,5,15,5z M9,9H7V7c0-0.6,0.4-1,1-1h1V9z"/>
</svg>
      </div> 
    </div>
  );
}

export default ReadHeader;
