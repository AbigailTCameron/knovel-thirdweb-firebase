import React, { useState } from 'react'
import FaqsPopup from './FaqsPopup';
import LinkedIn from '../icons/LinkedIn';
import UpArrow from '../icons/UpArrow';
import X from '../icons/X';
import Youtube from '../icons/Youtube';


function Footer() {
  const [faqsPopup, setFaqsPopup] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return (
    <div className="w-full items-center justify-center flex text-white px-40 xl:px-28 lg:px-16 sm:px-8">
        <div className="w-full border-t border-gray-600">

          <div className="my-8 flex w-full">
              <div className="flex items-center basis-1/3 font-mono ">
                <img 
                  src={"/knovel-logo-white.png"}
                  className="w-1/6 xxl:w-[90px] sm:w-[60px] h-fit sm:h-[60px]"
                />

                <div onClick={scrollToTop} className="hover:cursor-pointer flex items-center space-x-1">
                    <p className='text-xs sm:hidden'>BACK TO TOP</p>
                    <UpArrow />  
                </div>
               
              </div>

              <div className="basis-2/3 flex sm:flex-col w-full sm:space-x-0 sm:space-y-8 space-x-20 md:space-x-8">
                  <div className="flex flex-col">
                      <p className="text-white/40">Development</p>
                      <a href="https://docs.knovelprotocol.com/">
                        <p>Documentation</p>
                      </a>
                      
                      <p className="hover:cursor-pointer" onClick={() => setFaqsPopup(true)}>FAQs</p>
                  </div>

                  <div className="flex flex-col">
                      <p className="text-white/40">Social</p>

                      <div className="grid grid-cols-2 gap-2 items-center">
                        <a className="flex" target="_blank" href="https://www.youtube.com/@KnovelProtocol">
                          <Youtube />
                        </a>

                        <a className="flex" target="_blank" href="https://www.linkedin.com/company/knovelprotocol/">
                          <LinkedIn />
                        </a>

                        <a className="flex" target="_blank" href="https://x.com/knovelprotocol">
                          <X/>
                        </a>
                      </div>

                    
                  </div>

              </div>
          </div>

        </div>

        {faqsPopup && (
          <FaqsPopup 
            onClose={() => setFaqsPopup(false)}
          />
        )}
    </div>
  )
}

export default Footer