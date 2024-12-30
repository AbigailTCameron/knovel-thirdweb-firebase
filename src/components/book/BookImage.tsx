import React, { useEffect, useState } from 'react'

type Props = {
  imageFile?: string;
}

function BookImage({imageFile}: Props) {
  const [bookUrl, setBookUrl] = useState<string>('');


  useEffect(() => {
    const isHttpUrl = (file: string): boolean => {
      try {
        const url = new URL(file);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false; // Not a valid URL
      }
    };

    if(imageFile){
        if (isHttpUrl(imageFile)) {
          // If it's a valid HTTP/HTTPS link, use it directly
          setBookUrl(imageFile);
        }
    }

  }, [imageFile])


  return (
    <div className="w-[400px] h-[640px] halfxlysm:w-[250px] halfxlysm:h-[400px] xlyhalflg:w-[300px] xlyhalflg:h-[480px] halflgyhalflg:w-[150px] halflgyhalflg:h-[240px] mdymd:w-[100px] mdymd:h-[160px] lg:w-[300px] lg:h-[480px] halflg:w-[250px] halflg:h-[400px] sm:w-[150px] sm:h-[240px] halflgylg:w-[125px] halflgylg:h-[200px]">
      {bookUrl !== '' && (
        <img 
          className="z-10 p-0.5 bg-white w-full h-full rounded-xl" 
          src={bookUrl} 
          alt={"cover image"}
        />
      )} 
      
    </div>
  )
}

export default BookImage