import React, { useMemo, useState } from 'react'
import UpDown from '../icons/UpDown';

type Props = {
  title ?: string;
  chaptersCount: number;               
  defaultUpto?: number;   
  onConfirm : Function;
  onCancel ?: () => void;
}

function PublishPopup({title, onConfirm, onCancel, chaptersCount, defaultUpto}: Props) {
  const [upto, setUpto] = useState<number>(defaultUpto ?? chaptersCount);
  const [open, setOpen] = useState(false); // 👈 controls dropdown visibility

  const help = useMemo(() => {
    if (upto <= 0) return 'Select at least chapter 1';
    if (upto > chaptersCount) return `Max is ${chaptersCount}`;
    return `You will publish chapters 1–${upto}.`;
  }, [upto, chaptersCount]);

  const handleProceed = () => {
    if (upto >= 1 && upto <= chaptersCount) onConfirm(upto);
  };

  const list = Array.from({ length: chaptersCount }, (_, i) => i + 1);


  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
      <div className="flex flex-col w-[500px] sm:w-[300px] sm:p-4 h-fit bg-black/60 text-white rounded-xl shadow-lg p-6  sm:text-sm">
            <div className="mb-4 space-y-2">
                  <p> You are about to publish your draft <span className="font-bold">"{title}"</span></p>

                  {/* Prefix selector */}
                  <div className="w-full relative space-y-1">
                    <p className="text-sm text-white/80">Publish through chapter:</p>

                    <div
                      onClick={() => setOpen((o) => !o)}
                      className="flex justify-between items-center w-full px-3 py-2 bg-zinc-800 rounded-xl text-left border border-white/20
                                hover:bg-zinc-700 transition"
                    >
                      Chapters 1–{upto}

                      <UpDown className='size-4 stroke-white/80'/>
                    </div>

                    {open && (
                      <ul
                        className="absolute w-full mt-1 bg-zinc-900 border border-white/20 rounded-xl
                                  max-h-48 overflow-y-auto z-50"
                      >
                        {list.map((n) => (
                          <li
                            key={n}
                            className={`px-4 py-2 cursor-pointer select-none
                              ${
                                n === upto
                                  ? "bg-purple-600 text-white"
                                  : "hover:bg-zinc-700"
                              }`}
                            onClick={() => {
                              setUpto(n);
                              setOpen(false);
                            }}
                          >
                            Chapters 1–{n}
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="text-white/60 text-sm">{help}</p>
                  </div>  


                  <p className="text-white/60 text-xs">Note: After publishing you can go back and add new chapters, edit title, genre and synopsis, however you will not be able to alter details of chapters already published.
                  </p>

            </div>
            <div className="flex justify-center w-full space-x-2">
                <button
                  className="px-2 py-3 w-5/12 text-white font-semibold bg-zinc-800 rounded-xl"
                  onClick={handleProceed}
                  disabled={upto < 1 || upto > chaptersCount}
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

export default PublishPopup