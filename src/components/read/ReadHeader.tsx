import Menu from "../icons/Menu";
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
    <div className={`relative bg-[#1e1e1e] ${theme === "light" && "bg-[#f9fafb]"} rounded-t-xl flex w-full h-full text-white px-4 py-2`}>
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
    </div>
  );
}

export default ReadHeader;
