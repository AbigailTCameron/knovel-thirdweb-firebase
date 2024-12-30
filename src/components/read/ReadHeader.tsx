import React from 'react'
import Menu from '../icons/Menu';

type Props = {
  setShowChapters : Function;
  showChapters?: boolean;
  title ?: string;
}

function ReadHeader({setShowChapters, showChapters, title}: Props) {
  return (
    <div className="bg-[#1e1e1e] rounded-t-xl flex w-full h-full text-white px-4 py-2">
      <Menu onClick={() => setShowChapters(!showChapters)} className="size-8 stroke-2 hover:cursor-pointer hover:stroke-slate-400"/>

      <div className="flex w-full self-center items-center justify-center">
        <h2>{title}</h2>
      </div>
      
    </div>
  )
}

export default ReadHeader