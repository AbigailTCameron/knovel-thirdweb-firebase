import React from 'react'

type Props = {className?: string }

function HalloweenLights({className}: Props) {
  const bulbCount = 500;

  return (
    <div className={`flex flex-wrap justify-center items-center w-full h-full overflow-hidden gap-x-[10px] space-y-14 cursor-none 
    *:flex-none *:relative *:w-[30px] *:h-[30px] *:rounded-[50%] *:list-none

    *:before:absolute *:before:content-[''] *:before:-top-[10px] *:before:left-1/2 *:before:-translate-x-1/2 
    *:before:w-[10px] *:before:h-[7px] *:before:bg-slate-700 *:before:rounded-md *:before:z-10

    *:after:absolute *:after:z-[-1px] *:after:-top-1 *:after:left-1/2 *:after:w-14 *:after:h-[5px]
    *:after:border-b *:after:border-white *:after:rounded-[100%] *:after:content-['']

    last:*:after:hidden
    even:*:bg-[#0080ff] even:*:shadow-[0_5px_24px_3px_rgba(0,128,255,1)] even:*:animate-pulse 
    odd:*:bg-red-600 odd:*:animate-[pulse_1.5s_ease-in-out_infinite] odd:*:shadow-[0_5px_24px_3px_rgba(220,38,38,1)]
    [&>li:nth-child(3n)]:bg-white [&>li:nth-child(3n)]:shadow-[0_5px_24px_3px_rgba(255,255,255,1)]
  
    ${className}`}>
      {Array.from({ length: bulbCount }).map((_, i) => (
        <li key={i}></li>
      ))}   
    </div>
  )
}

export default HalloweenLights