import Light from '../icons/Light';
import Dark from '../icons/Dark';

type Props = {
  toggleTheme: (theme: "light" | "dark") => void;
  theme: string;
}

function Mode({toggleTheme, theme}: Props) {
  return (
    <div className="flex justify-between">
        <div className="relative flex w-full max-w-xs items-center justify-between rounded-full bg-white/10 backdrop-blur-md px-1 py-1 shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-visible">
            <div
              onClick={() => toggleTheme("light")}
              className={`relative flex flex-1 items-center justify-center transition-all duration-200 ease-out cursor-pointer
                ${theme === "light" ? "z-20 scale-110" : "z-10 scale-100"}`}>
     
              <div className={`absolute inset-0 rounded-full
                  transition-all duration-200 ease-out
                  ${theme === "light" ? "bg-[#7F60F9] shadow-lg" : "bg-none"}
                `}
              />
              
              {/* Content */}
              <div className="relative z-30 flex items-center gap-1 px-3 py-1 text-xs font-medium">
                <Light className={`stroke-current size-4 ${theme === "light" && "stroke-white"}`} />
                <span className={`${theme === "light" ? "text-white font-bold" : "text-slate-300"}`}>
                  Light
                </span>
              </div>

            </div>


          <div
            onClick={() => toggleTheme("dark")}
            className={`
              relative flex flex-1 items-center justify-center
              transition-all duration-200 ease-out cursor-pointer
              ${theme === "dark" ? "z-20 scale-110" : "z-10 scale-100"}
            `}
          >
            <div
              className={`
                absolute inset-0 rounded-full
                transition-all duration-200 ease-out
                ${theme === "dark" ? "bg-white/20 shadow-lg" : "bg-none"}
              `}
            />

            {/* Content */}
            <div className="relative z-30 flex items-center gap-1 px-3 py-1 text-xs font-medium">
              <Dark className={`size-4 ${theme === "dark" ? "stroke-white" : "stroke-black"}`}/>
              <span className={`${theme === "dark" ? "text-white font-bold" : "text-black"}`}>
                Dark
              </span>
            </div>
          </div>
        </div>
    </div>

  )
}

export default Mode