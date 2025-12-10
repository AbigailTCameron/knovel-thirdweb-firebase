type Props = {
  progressPercent: number;
  theme: string;
}

function ProgressBar({progressPercent, theme}: Props) {
  return (

    <div className='w-full h-fit'>
          <div className={`relative flex w-full items-end text-center h-[30px] rounded-full overflow-hidden ${theme === "light" ? "bg-slate-200" : "bg-[#262626]"}`}>
              <div
                className={`h-full items-center text-center transition-all duration-200 ${theme === "light" ? "bg-[#7F60F9]" : "bg-[#7F60F9]"}`}
                style={{ width: `${progressPercent}%` }}
              >
            </div>

            <p className={`absolute flex w-full place-self-center place-content-center place-items-center text-center py-3 ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>{progressPercent}% read</p>

          </div>
    </div>
  



  )
}

export default ProgressBar