import React, { useEffect, useState } from 'react'
import { fetchNotifications } from '../../../functions/explore/fetch';
import { Notification } from '../../..';

type Props = {
  userId: string;
}

function Notifications({userId}: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotifications, setNewNotifications] = useState<boolean | null>(null); 



  const loadNotifications = async () => {
    if(userId){
        await fetchNotifications(userId, setNotifications);
        // console.log("the notifications are", notifications)
        // setNotifications(notifications);
        // setNewNotifications(notifications.some((n) => !n.isRead));
    }
  
  };

  useEffect(() => {
    loadNotifications();
  }, [userId]);


  return (
    <div className="flex flex-col w-full overflow-hidden text-white space-y-2">
      <p className="text-xl font-bold mb-2">Notifications:</p>

      <div className="flex flex-col space-y-2">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex w-full hover:cursor-pointer">
                <div className="relative w-fit h-fit flex flex-col">
                  <div className="w-[150px] h-[150px] rounded-full">
                    {notification.commenterProfile ? (
                      <img 
                        className="rounded-full w-full h-full"
                        src={notification.commenterProfile}
                      />
                    ): (
                      <div></div>
                    )}
                  </div>  

                  <div className="absolute right-0 bottom-0 border-2 border-white rounded-md">
                    <img 
                      className='w-[50px] h-[80px] rounded-md'
                      src={notification.bookImage}
                    />
                  </div>
                </div>

                <div className="text-lg font-semibold">
                  <p>{notification.message}</p>
                </div>

          </div>
        ))}
      </div>
     

    </div>
  )
}

export default Notifications