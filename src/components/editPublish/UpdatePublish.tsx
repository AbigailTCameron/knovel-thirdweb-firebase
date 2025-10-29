import React, { useMemo, useState } from 'react'
import UpDown from '../icons/UpDown';

type Props = {
  title ?: string;
  onConfirm: (upto: number) => void;
  onCancel ?: () => void;
  publishedCount: number; 
  chaptersCount: number;
}

function UpdatePublish({title, onConfirm, onCancel, publishedCount, chaptersCount}: Props) {
  const [upto, setUpto] = useState<number>(Math.max(publishedCount, 1));
  const [open, setOpen] = useState(false);

  const help = useMemo(() => {
    if (upto < publishedCount) return `You already have chapters 1–${publishedCount} published.`;
    if (upto > chaptersCount)  return `Max is ${chaptersCount}.`;
    if (upto === publishedCount) return `No new chapters will be added.`;
    return `You will publish chapters ${publishedCount + 1}–${upto}.`;
  }, [upto, chaptersCount, publishedCount]);

  const canProceed = upto >= publishedCount && upto <= chaptersCount;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
        <div className="flex flex-col w-[500px] sm:w-[300px] sm:p-4 h-fit bg-black/60 text-white rounded-xl shadow-lg p-6  sm:text-sm">
              <div className="mb-4 space-y-2">
                    <p> You are about to update your published book title: <span className='font-bold'>"{title}"</span></p>

                    <p className="text-white/70 text-sm">
                      Pick the highest chapter number to publish. You currently have chapters
                      {' '}<span className="font-semibold">{publishedCount}</span> published.
                    </p>
              </div>


              <div className="w-full relative space-y-1">
                <p className="mb-2 text-white/80 text-sm">Publish through chapter:</p>

                <div
                  onClick={() => setOpen((o) => !o)}
                  className="flex justify-between items-center w-full px-3 py-2 bg-zinc-800 rounded-xl text-left border border-white/20
                            hover:bg-zinc-700 transition"
                >
                  Chapters 1–{upto}

                  <UpDown className='size-4 stroke-white/80'/>
                </div>


                {open && (
                  <ul className="absolute w-full mt-1 bg-zinc-900 border border-white/20 rounded-xl max-h-48 overflow-y-auto z-50">
                    {Array.from({ length: chaptersCount }, (_, i) => i + 1).map((n) => {
                      const isLocked = n <= publishedCount;     // can’t go backwards
                      return (
                        <li
                          key={n}
                          onClick={() => {
                            !isLocked && setUpto(n) 
                            setOpen(false)
                          }}
                          className={`px-4 py-2 select-none ${isLocked ? "opacity-40 cursor-default hover:bg-none" : "cursor-pointer hover:bg-purple-600"}`}
                        
                        >
                          {n}
                        </li>
                      );
                    })}
                  </ul>     
                )}


                <p className="mt-2 text-white/70 text-sm">{help}</p>
                 
                <p className="mt-1 text-white/50 text-xs">
                  Note: You can edit title, image, and genres anytime. Chapters already published cannot be altered.
                </p>
              </div>


              <div className="flex justify-center w-full space-x-2">
                  <button
                    className="px-2 py-3 w-5/12 text-white font-semibold bg-zinc-800 rounded-xl"
                    onClick={() => canProceed && onConfirm(upto)}
                    disabled={!canProceed}
                  >
                    Proceed
                  </button>
                  <button 
                    className="px-2 py-3 w-5/12 text-white font-semibold bg-zinc-800 hover:bg-zinc-400 rounded-xl"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
              </div>
        </div>
    </div>
  )
}

export default UpdatePublish