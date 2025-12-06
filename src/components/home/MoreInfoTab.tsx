import Image from 'next/image';
import React from 'react'

type TabProps = {
  groupName?: string; 
  itemName?: string;
  label?: string;
  description?: string;
  icon?: string;
}

function MoreInfoTab({groupName, itemName, label, description, icon}: TabProps) {
  return (
    <div className={groupName}>
        <p className="font-extrabold xl:font-bold text-xl lg:text-base px-2 text-white">{label}</p>

        <div className="flex w-full justify-center justify-items-center	justify-self-center	content-center py-4">
            <Image 
                src={icon || ''}
                alt="icon"
                className='w-[120px] h-[120px] iphonese:w-[50px] iphonese:h-[50px]'
                width="500"
                height="500"
            />
        </div>
   
      <p className={itemName}>{description}</p>
    </div>
  )
}

export default MoreInfoTab