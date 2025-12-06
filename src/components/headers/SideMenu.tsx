import HomeIcon from '../icons/HomeIcon'
import { usePathname, useRouter } from 'next/navigation';
import Notifications from '../icons/Notifications';
import SettingsIcon from '../icons/SettingsIcon';
import People from '../icons/People';
import BookmarkIcon from '../icons/BookmarkIcon';
import Lib from '../icons/Lib';
import NewPage from '../icons/NewPage';
import Pencil from '../icons/Pencil';
import Dashboard from '../icons/Dashboard';
import XMark from '../icons/XMark';
import Image from 'next/image';

type Props = {
  userId ?: string;   
  setSearchResults: (value: boolean) => void;
  setShowNotifications: (value: boolean) => void;
  setSettingsPopup: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  showMenu: (value: boolean) => void;
  onRequireWalletConnect?: () => void;
}

function SideMenu({userId, setSearchResults, setShowNotifications, setSettingsPopup, setLoading, showMenu, onRequireWalletConnect}: Props) {
  const router = useRouter();
  const pathname = usePathname();   

  const handleHomeClick = () => {
    if(pathname !== '/explore'){
      setLoading(true); 
      router.push('/explore');
    }
  };

  const handleCollectiblesClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }

    if(pathname !== `/collection/${userId}`){
      setLoading(true); 
      router.push(`/collection/${userId}`);
    }
  }

  const handleCreateClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }
    if(pathname !== '/create'){
      setLoading(true); 
      router.push('/create');
    }
  };

  const handleDraftsClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }
    if(pathname !== `/drafts/${userId}`){
      setLoading(true); 
      router.push(`/drafts/${userId}`);
    }
  };

  const handleReadingClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }
    if(pathname !== `/readinglist/${userId}`){
      setLoading(true); 
      router.push(`/readinglist/${userId}`);
    }
  }

  const handlePublishClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }
    if(pathname !== `/publish`){
      setLoading(true); 
      router.push(`/publish`);
    }
  }

  return (
    <div className="flex z-50 fixed top-0 w-screen h-screen left-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md">
        <div className='relative flex flex-col w-1/2 h-full rounded-r-xl text-white bg-[#131418] border border-[#272831] border-r-[0.5px]'>
            <div className='w-full flex flex-col rounded-xl text-sm py-2 space-y-3'>
                  <div className="flex items-center justify-between px-2">
                      <div className="flex w-fit h-[60px] ss:h-[50px] hover:cursor-pointer">
                          <Image 
                            onClick={handleHomeClick}
                            className="w-full h-full"
                            src="/knovel-logo-full.png"
                            alt="knovel community"   
                            width={"500"}
                            height={"500"}
                          />
                      </div>

                      <XMark 
                        onClick={() => showMenu(false)}
                        className="hover:cursor-pointer hover:bg-[#1b1c22] hover:rounded-lg stroke-[#7c7a85] size-6"
                      />
                  </div>


                  <div onClick={handleHomeClick} className="flex w-full py-2 px-2 space-x-2 items-center text-2xl ss:text-xl font-semibold hover:cursor-pointer hover:bg-black">
                    <HomeIcon className='flex basis-1/5 size-10 ss:size-7'/>
                    <p className='flex basis-4/5'>Home</p>
                  </div>

                  <div onClick={handleCollectiblesClick} className='flex w-full py-2 px-2 space-x-2 items-center text-2xl ss:text-xl font-semibold hover:cursor-pointer hover:bg-black'>
                    <Dashboard className='flex basis-1/5 size-10 ss:size-7'/>
                    <p className='flex basis-4/5'>Collection</p>
                  </div>

                  <div onClick={handleCreateClick} className='flex w-full py-2 px-2 space-x-2 items-center text-2xl ss:text-xl font-semibold hover:cursor-pointer hover:bg-black'>
                    <Pencil className='flex basis-1/5 size-10 ss:size-7'/>
                    <p className='flex basis-4/5'>Create</p>
                  </div>

                  <div onClick={handleDraftsClick} className='flex w-full py-2 px-2 space-x-2 items-center text-2xl ss:text-xl font-semibold hover:cursor-pointer hover:bg-black'>
                    <NewPage className='flex basis-1/5 size-10 ss:size-7'/>
                    <p className='flex basis-4/5'>Drafts</p>
                  </div>

                  <div onClick={handlePublishClick} className='flex w-full py-2 px-2 space-x-2 items-center text-2xl ss:text-xl font-semibold hover:cursor-pointer hover:bg-black'>
                    <Lib className='flex basis-1/5 size-10 ss:size-7'/>
                    <p className='flex basis-4/5'>Published</p>
                  </div>

                  <div onClick={handleReadingClick} className='flex w-full py-2 px-2 space-x-2 items-center text-2xl ss:text-xl font-semibold hover:cursor-pointer hover:bg-black'>
                    <BookmarkIcon className='flex basis-1/5 size-10 ss:size-7'/>
                    <p className='flex basis-4/5'>Saved</p>
                  </div>

                  <div onClick={() => setSearchResults(true)} className='flex w-full py-2 px-2 space-x-2 items-center text-2xl ss:text-xl font-semibold hover:cursor-pointer hover:bg-black'>
                    <People className='flex basis-1/5 size-10 ss:size-7'/>
                    <p className='flex basis-4/5'>Users</p>
                  </div> 


                  <div onClick={() => {
                    if(!userId){
                      onRequireWalletConnect?.();
                      return;
                    }
                    setShowNotifications(true)
                  }} className='flex w-full py-2 px-2 space-x-2 items-center text-2xl ss:text-xl font-semibold hover:cursor-pointer hover:bg-black'>
                    <Notifications className='flex basis-1/5 size-10 ss:size-7'/>
                    <p className='flex basis-4/5'>Notifications</p>
                  </div> 

 
                  <div onClick={() => {
                    if(!userId){
                      onRequireWalletConnect?.();
                      return;
                    }
                    setSettingsPopup(true);
                  }} className="flex items-center text-2xl ss:text-xl self-center font-semibold space-x-2 absolute bottom-10 hover:border hover:rounded-xl hover:border-white/50 p-1 hover:cursor-pointer">
                      <SettingsIcon />
                      <p className='flex basis-4/5'>Settings</p>
                  </div>
            </div>
        </div>
    </div>
  )
}

export default SideMenu