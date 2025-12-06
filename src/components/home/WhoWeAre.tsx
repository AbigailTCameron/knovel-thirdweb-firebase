import MoreInfoTab from './MoreInfoTab'


function WhoWeAre({}) {
  return (
    <div className="relative flex flex-col items-center justify-center space-y-16 halflg:items-center w-full h-full text-white px-28 xl:px-14 lg:px-6 py-10 space-x-10 xl:space-x-5 iphonese:space-x-0">
    <div className="flex flex-col w-full items-center text-center space-y-8 z-10">
      <p className="font-black text-6xl lg:text-5xl sm:text-3xl bg-gradient-to-r from-white to-white/50 inline-block text-transparent bg-clip-text max-w-prose line-clamp-3">A decentralized literary platform for you powered by web3.</p>
      <p className="text-2xl lg:text-xl sm:text-lg">Knovel advocates for community, storytelling, information exchange, and as a general medium of expression.</p>
    </div>

    <div className="flex h-fit justify-center sm:flex-col w-full halflg:w-full space-x-8 md:space-x-2 iphonese:space-x-0 iphonese:items-center sm:space-x-0 sm:items-center sm:space-y-4">
      <div className="group flex w-1/4 sm:w-[300px] iphonese:w-full hover:bg-gradient-to-r from-[#6DDCFF] to-[#7F60F9] rounded-3xl p-0.5">
        <MoreInfoTab 
          groupName="w-full bg-[#141414] rounded-3xl p-6 halfxl:p-4 h-fit"
          itemName="block text-white md:text-sm hidden group-hover:block lg:text-sm"
          label="Revolutionize"
          description='We harness the power of blockchain technology to redefine and enhance copyright management for authors and publishers, providing a more secure, transparent and efficient system.'
          icon={"/revolutionize.png"}
      />
      </div>

      <div className="group flex w-1/4 sm:w-[300px] iphonese:w-full hover:bg-gradient-to-r from-[#6DDCFF] to-[#7F60F9] rounded-3xl p-0.5">
          <MoreInfoTab 
            groupName="w-full bg-[#141414] rounded-3xl p-6 halfxl:p-4 h-fit"
            itemName="block text-white md:text-sm hidden group-hover:block lg:text-sm"
            label="Liberate"
            description='Bypass the limitations and censorship enforced by centralized entities and embrace the freedom to publish and monetize your work independently, unlocking new opportunities for creativity and financial success.'
            icon={"/liberate.png"}
            />
      </div>
    
      <div className="group flex w-1/4 sm:w-[300px] iphonese:w-full hover:bg-gradient-to-r from-[#6DDCFF] to-[#7F60F9] rounded-3xl p-0.5">
          <MoreInfoTab 
            groupName="w-full bg-[#141414] rounded-3xl p-6 halfxl:p-4 h-fit" 
            itemName="block text-white md:text-sm hidden group-hover:block lg:text-sm"
            label="Empower"
            description='Authors maintain control over their creations, from draft to publication, ensuring rights protection, managing distribution, safeguarding intellectual property, and maximizing earnings.'
            icon={"/empower.png"}

          />
      </div>
    
    </div>
    
    </div>
  )
}

export default WhoWeAre