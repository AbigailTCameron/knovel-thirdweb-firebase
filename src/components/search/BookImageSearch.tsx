import React, { useEffect, useState } from 'react'

type Props = {
  imageFile: string;
}

function BookImageSearch({imageFile}: Props) {

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

    if (isHttpUrl(imageFile)) {
        // If it's a valid HTTP/HTTPS link, use it directly
        setBookUrl(imageFile);
    }
 
  }, [imageFile])

  return (
    <div className="w-[300px] h-[480px] xl:w-[250px] xl:h-[400px] lg:w-[200px] lg:h-[320px] sm:w-[230px] sm:h-[368px] ss:w-[280px] ss:h-[448px]">
      {bookUrl !== '' && (
        <img 
          className="z-10 p-0.5 bg-white w-full h-full  group-hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] rounded-xl object-cover" 
          src={bookUrl}
          alt={"cover image"} 
        />
      )}
       
    </div>
  )
}

export default BookImageSearch