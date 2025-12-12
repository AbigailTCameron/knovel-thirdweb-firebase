
type Props = {
  imageFile : string;
}

function GenreImage({imageFile}: Props) {


  return (
    <div className="w-[200px] h-[320px] halflg:w-[150px] halflg:h-[240px] sm:w-[120px] sm:h-[192px] xs:w-[100px] xs:h-[160px] rounded-xl">
        {imageFile && (
            <img
              className="z-10 p-0.5 w-full h-full group-hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] rounded-xl object-cover" 
              src={imageFile}
              alt={imageFile}
            />
        )}
    </div>
  )
}

export default GenreImage