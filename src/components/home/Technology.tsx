
function Technology() {
  return (
    <div className="relative flex justify-between md:flex-col md:justify-normal w-full h-full text-white  space-x-4 px-40 xl:px-24 lg:px-10 sm:px-4 py-10">

        <div className="flex flex-col w-1/2 md:w-full space-y-6 z-10">
            <p className="font-black text-6xl halflg:text-3xl sm:text-2xl bg-gradient-to-r from-white to-white/40 inline-block text-transparent bg-clip-text">The most trusted way to build value.</p>
            <p className="text-xl md:text-base sm:text-sm tall:text-lg iphonese:text-sm">Our underlying infrastructure uses smart contracts to define and enforce licensing terms automatically. Authors can set specific terms for how their work can be used, and these terms are executed by the smart contracts without the need for intermediaries.</p>
            <p className="text-xl md:text-base sm:text-sm tall:text-lg iphonese:text-sm">Decentralized storage reduces the risk of data loss or theft associated with centralized servers. Content is distributed across multiple nodes, making it more resilient to attacks and failures.</p>
        </div>

        <div className=" flex flex-col md:flex-row md:w-full md:space-x-4 sm:space-x-1 space-y-10 md:space-y-0 md:mt-8 z-10">
            <div className="md:w-1/3">
                <p className="font-mono text-gray-400 sm:text-xs">NO FEES</p>
                <p className="text-9xl mdandtall:text-8xl  mdandtallimit:text-4xl lg:text-8xl tall:text-4xl md:text-4xl iphonese:text-3xl sm:text-xl font-extrabold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">$0.00</p>
                <p className="w-[400px] md:w-full font-mono sm:text-xs iphonese:hidden">Zero publishing fees.</p>
            </div>

            <div className="md:w-1/3">
                <p className="font-mono text-gray-400 sm:text-xs">FAST TRANSACTIONS</p>
                <p className="text-9xl mdandtall:text-8xl  mdandtallimit:text-4xl lg:text-8xl tall:text-4xl md:text-4xl sm:text-xl iphonese:text-3xl font-extrabold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">5 sec</p>
                <p className='w-[400px] md:w-full font-mono sm:text-xs iphonese:hidden'>Publishing confirmed on chain within seconds.</p>
            </div>

            <div className="md:w-1/3">
                <p className="font-mono text-gray-400 sm:text-xs">MORE EFFIECIENT</p>
                <p className="text-9xl mdandtall:text-8xl mdandtallimit:text-4xl lg:text-8xl tall:text-4xl md:text-4xl sm:text-xl iphonese:text-3xl font-extrabold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">288x</p>
                <p className="w-[400px] md:w-full font-mono sm:text-xs iphonese:hidden">Approximately 288 times more efficient carbon emissions than traditional publishing companies. </p>
            </div>
        </div>
    
    </div>
  )
}

export default Technology