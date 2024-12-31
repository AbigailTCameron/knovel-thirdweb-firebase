import React, { useRef, useState } from 'react'
import Cropper from 'react-easy-crop';
import { Area, getCroppedImg } from '../../../tools/cropImage';
import { uploadProfilePicture } from '../../../functions/settings/fetch';

type Props = {
  profileUrl ?: string; 
  userId ?: string;
  setProfileUrl: Function;
  oldFilePath: string;
  setOldFilePath : Function
}

function ProfilePhotoSettings({profileUrl, userId, setProfileUrl, oldFilePath, setOldFilePath}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef(null);

  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [chooseCropped, setChooseCropped] = useState<boolean>(false); 
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [filename, setFilename] = useState<string>('');

  function readFile(file: File) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
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

        urlToFile(croppedImage).then(async(file) => {
          const fileExt = file.name.split('.').pop()

          if(userId){
            const filePath = `${userId}/${filename}.${fileExt}`
            const newProfileUrl = await uploadProfilePicture(filePath, file, userId, oldFilePath);
            setProfileUrl(newProfileUrl);
            setOldFilePath(filePath); 
          }
        })
    }
  };


  return (
    <div className="flex items-center py-4 space-x-4">
        <div className="w-[100px] h-[100px] rounded-full">
            {profileUrl ? (
                <img
                  className="w-full h-full rounded-full"
                  src={profileUrl}
                  alt={`profile pic`}
                />
            ) : (
              <div className="flex text-white bg-[#2a2929] text w-full h-full rounded-full text-center items-center justify-center">
                <p>upload a photo</p>
              </div>
            )}
        </div>
                
        <input ref={fileInputRef} accept="image/*"  className="hidden" type="file" onChange={handleImageChange}/>
        <div ref={imageContainerRef}  onClick={() => fileInputRef?.current?.click()} className="hover:cursor-pointer font-semibold bg-white/70 w-fit h-fit text-black py-3 px-5 rounded-3xl">
            <p>Upload Photo</p>
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
           
    </div>
  )
}

export default ProfilePhotoSettings