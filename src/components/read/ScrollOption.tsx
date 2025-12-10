import Scroll from '../icons/Scroll';
import Paginated from '../icons/Paginated';

type Props = {
  page: string;
  toggleMode: (page: "paginated" | "scrolled-continuous") => void;
  theme: string;
}

function ScrollOption({toggleMode, page, theme}: Props) {
  return (
    <div className="flex justify-between">
        <div className="relative flex w-full max-w-xs items-center justify-between rounded-full bg-white/10 backdrop-blur-md px-1 py-1
            shadow-[0_0_20px_rgba(0,0,0,0.4)]
            overflow-visible
          ">

          <div
            onClick={() => toggleMode("paginated")}
            className={`
              relative flex flex-1 items-center justify-center
              transition-all duration-200 ease-out cursor-pointer
              ${page === "paginated" ? "z-20 scale-110" : "z-10 scale-100"}
            `}
          >
          
            <div
              className={`
                absolute inset-0 rounded-full
                transition-all duration-200 ease-out
                ${(page === "paginated" && theme === "light") ? "bg-[#7F60F9]" : "bg-none"}
                ${(page === "paginated" && theme === "dark") ? "bg-white/20 shadow-lg" : "bg-none"}
              `}
            />
            
            
            <div className="relative z-30 flex items-center gap-1 px-3 py-1 text-xs font-medium">
              <Paginated className={`size-4 ${(page === "scrolled-continuous" && theme === "light") ? "stroke-black" : "stroke-white"}`}/>
              <span className={`${(page === "paginated" && theme === "light") && "text-white font-bold"}
              ${(page === "paginated" && theme === "dark") && "text-white font-bold"}
              ${(page === "scrolled-continuous" && theme === "dark") && "text-white"}
              ${(page === "scrolled-continuous" && theme === "light") && "text-black"}

              `}>
                Page
              </span>
            </div>
          </div>

    
          <div
            onClick={() => toggleMode("scrolled-continuous")}
            className={`
              relative flex flex-1 items-center justify-center
              transition-all duration-200 ease-out cursor-pointer
              ${page === "scrolled-continuous" ? "z-20 scale-110" : "z-10 scale-100"}
            `}
          >
          
            <div
              className={`
                absolute inset-0 rounded-full
                transition-all duration-200 ease-out
                ${(page === "scrolled-continuous" && theme === "dark") ? "bg-white/20 shadow-lg" : "bg-none"}
                ${(page === "scrolled-continuous" && theme === "light") ? "bg-[#7F60F9]" : "bg-none"}
              `}
            />

            {/* Content */}
            <div className="relative z-30 flex items-center gap-1 px-3 py-1 text-xs font-medium">
              <Scroll className={`size-4 stroke-white ${(page === "paginated" && theme === "light") && "stroke-black"}`}
              
              />
              <span className={`${(page === "paginated" && theme === "light") ? "text-black": "text-white"}
              ${(page === "scrolled-continuous" && theme === "light") && "text-white font-bold"}
              ${(page === "scrolled-continuous" && theme === "dark") && "text-white font-bold"}
              `}>
                Scroll
              </span>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ScrollOption