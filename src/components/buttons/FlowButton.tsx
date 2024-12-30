import React from 'react'

type ButtonProps = {
  title ?: string;
  buttonRadius ?: string;
  buttonWidth ?: string;
}


function FlowButton({title, buttonRadius, buttonWidth}: ButtonProps) {
  return (
    <div className={`relative ${buttonWidth} text-center ${buttonRadius} px-10 py-4 bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white`}>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine">
      </div>
      <p>{title}</p>
    </div>
  )
}

export default FlowButton