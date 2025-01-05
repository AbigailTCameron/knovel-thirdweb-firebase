import React, { useRef, useState } from 'react'
import Cropper from 'react-easy-crop';
import { Area, getCroppedImg } from '../../../tools/cropImage';
import { reuploadBookImageToSupabase } from '../../../functions/drafts/fetch';

type Props = {
  bookUrl ?: string;
  draftId : string;
  userId : string;
  oldFilePath: string;
}

function ImageUploader2({bookUrl, draftId, userId, oldFilePath}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [chooseCropped, setChooseCropped] = useState<boolean>(false); 
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [filename, setFilename] = useState<string>('');

  function readFile(file: File) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const urlToFile = async (croppedImage: string) => {
    const response = await fetch(croppedImage);
    const blob = await response.blob();
    
    // Create a new File object
    const file = new File([blob], "croppedImage.jpg", { type: blob.type });
    
    return file;
  };

  const handleCropConfirm = async () => {
    if (croppedAreaPixels && imageSrc) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels); 

      setChooseCropped(false); 

      urlToFile(croppedImage).then((file) => { 
        reuploadBookImageToSupabase(filename, file, userId, oldFilePath, draftId);
      })

    }
  };


  return (
    <div className="flex flex-col self-center my-4 w-[250px] h-[375px] lg:h-fit">
        <input ref={fileInputRef} accept="image/*"  className="hidden" type="file" onChange={handleImageChange}/>

        <div 
          onClick={() => fileInputRef?.current?.click()} 
          className="flex items-center justify-center w-full h-full lg:w-[200px] lg:h-[320px] sm:w-[150px] sm:h-[240px] self-center rounded-xl hover:cursor-pointer hover:border-2 hover:border-white"
          onMouseEnter={() =>  setIsHovered(true)}
          onMouseLeave={() =>  setIsHovered(false)}
        >
            {bookUrl ? (
              <img
                className={`w-full h-full rounded-xl ${isHovered && "opacity-50"}`}
                src={bookUrl}
                alt={`$ book cover`}
              />
            
            ) : (
              <div
              className={`flex bg-[#2a2929] items-center justify-center rounded-xl w-full h-full ${isHovered && "opacity-50"}`}>
                <p>upload book cover</p>
              </div>

            )}
          
        </div>

      {chooseCropped && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
            <div className="flex flex-col w-1/3 h-3/4 bg-black/60 text-white rounded-xl shadow-lg p-6">
                <div className="relative w-full h-full">    
                  <Cropper 
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1/1.6} // 1:1.5 aspect ratio
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
        
    </div>
  )
}

export default ImageUploader2