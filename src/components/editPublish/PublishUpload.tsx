import React, { useRef, useState } from 'react'

type Props = {
  imageFile ?: string;
  setFilename: Function;
  setImageSrc: Function;
  setChooseCropped: Function;
}

function PublishUpload({imageFile, setFilename, setImageSrc, setChooseCropped}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);


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


  return (
    <div className="flex flex-col self-center my-4 md:my-2 w-[250px] h-[375px] lg:h-fit">
      <input ref={fileInputRef} accept="image/*"  className="hidden" type="file" onChange={handleImageChange}/>

      <div 
        onClick={() => fileInputRef?.current?.click()} 
        className="flex items-center justify-center w-full h-full lg:w-[200px] lg:h-[320px] halflg:w-[150px] halflg:h-[240px] md:w-[100px] md:h-[160px] tall:w-[90px] tall:h-[144px] self-center rounded-xl hover:cursor-pointer hover:border-2 hover:border-white"
        onMouseEnter={() =>  setIsHovered(true)}
        onMouseLeave={() =>  setIsHovered(false)}
      >
          {imageFile ? (
            <img
              className={`w-full h-full rounded-xl ${isHovered && "opacity-50"}`}
              src={imageFile}
              alt={`$ book cover`}
            />
          
          ) : (
            <div
            className={`flex bg-[#2a2929] items-center justify-center rounded-xl w-full h-full ${isHovered && "opacity-50"}`}>
              <p>upload book cover</p>
            </div>

          )}
        
      </div>
    
    </div>
  )
}

export default PublishUpload