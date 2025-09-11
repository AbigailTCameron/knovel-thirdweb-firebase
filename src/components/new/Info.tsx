import React, { useRef, useState } from 'react'
import Multidot from '../design/Multidot';
import ArrowRight from '../icons/ArrowRight';
import Cropper from 'react-easy-crop';
import { Area, getCroppedImg } from '../../../tools/cropImage';
import { newUpload } from '../../../functions/new/fetch';

type Props = {
  screen ?: number;
  setScreen ?: any;
  profileUrl ?: string; 
  setProfileUrl: Function;
  setFilename: Function;
  setBio: Function;
  bio: string;
}

function Info({screen, profileUrl, setProfileUrl, setFilename, setScreen, setBio, bio}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef(null);
  const [chooseCropped, setChooseCropped] = useState<boolean>(false); 
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  function readFile(file: File) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file?.name){
      setFilename(file?.name);
    }

    if (file && file.type.startsWith('image/')) {
      const imageDataUrl = await readFile(file)

      if(typeof imageDataUrl === 'string'){
        setImageSrc(imageDataUrl);
        setChooseCropped(true); 
      }
    }
  };


  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }


  const handleCropConfirm = async () => {
    if (croppedAreaPixels && imageSrc) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels); 
        setChooseCropped(false); 
        setProfileUrl(croppedImage);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center text-white">
    <div className='flex flex-col space-y-8 bg-[#131418] items-center justify-center w-1/4 h-fit shadow-2xl text-center inset-shadow shadow-white/50 rounded-2xl p-8'>
      <p className='text-white text-xs font-semibold'>PROFILE INFORMATION</p>

      <p className='text-white'>Tell us about yourself</p>

      <div className="flex self-start items-center space-x-2">
          <div className="w-[70px] h-[70px] rounded-full">
                {profileUrl ? (
                    <img
                      className="w-full h-full rounded-full"
                      src={profileUrl}
                      alt={`profile pic`}
                    />
                ) : (
                  <div className="flex hover:cursor-pointer text-white text-sm bg-[#2a2929] p-2 text w-[70px] h-[70px] rounded-full text-center items-center justify-center">
                    <p>Upload Photo</p>
                  </div>
                )}
          </div>
            
          <input ref={fileInputRef} accept="image/*"  className="hidden" type="file" onChange={handleImageChange}/>
          <div ref={imageContainerRef} onClick={() => fileInputRef?.current?.click()} className="bg-[#2a2929] hover:cursor-pointer font-bold rounded-3xl x-fit h-fit py-3 px-4">
            <p>Upload a photo</p>
          </div>
      </div>

      {chooseCropped && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
              <div className="flex flex-col w-1/3 h-3/4 bg-black/60 text-white rounded-xl shadow-lg p-6">
                  <div className="relative w-full h-full">
                      <Cropper 
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} 
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                  </div>

                  <div className="flex justify-center w-full space-x-2">
                      <button
                        onClick={handleCropConfirm}
                        className="px-2 py-3 w-5/12 text-white font-semibold bg-zinc-800 rounded-xl"
                      >
                        Crop
                      </button>
                  </div>
              </div>
          </div>
        )}


       <p className='text-white/50 self-start text-sm font-semibold'>BIO</p>
      
       <textarea 
          maxLength={150}
          id="bio" 
          name="bio" 
          placeholder={"enter short bio (150 character limit)"} 
          value={bio}
          onChange={(e) => (
            setBio(e.target.value)
          )}
         className="focus:outline-none bg-inherit resize-none bg-slate-800 w-full rounded-2xl p-2"
       />

       <div className='flex bg-[#262629] h-fit w-fit p-2 rounded-full hover:cursor-pointer'
        onClick={() => setScreen((prev:number) => prev + 1)
        }>
           <ArrowRight className="stroke-[#FFFFFF] size-6"/>
       </div>

       <Multidot selected={screen}/>

     </div></div>
  )
}

export default Info