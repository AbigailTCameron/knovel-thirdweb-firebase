import React, { useEffect, useState } from 'react'
import { deleteNotif, fetchNotifications } from '../../../functions/explore/fetch';
import { Notification } from '../../..';
import { useRouter } from 'next/navigation';

type Props = {
  userId: string;
}

function Notifications({userId}: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = async () => {
    if(userId){
        await fetchNotifications(userId, setNotifications);
    }
  
  };

  const deleteNotification = async(id: string) => {
    const { success } = await deleteNotif(id);
    if (success) {
      setNotifications((prevNotifications: any[]) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );    } else {
      alert('Failed to delete notification. Please try again.');
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [userId]);


  return (
    <div className="flex flex-col w-full text-white space-y-2">
      <p className="text-xl font-bold mb-2">Notifications:</p>

      {notifications.length == 0 ? (
        <div className="flex w-full h-full items-center justify-center">
          <p>You have no new notifications</p>
        </div>
      ) : (
          <div className="flex flex-col space-y-4">
            {notifications.map((notification) => (
              <div onClick={() => router.push(`/read/${notification.bookId}`)} key={notification.id} className="flex space-x-3 w-full hover:cursor-pointer items-center">
                    <div className="relative w-fit h-fit flex flex-col">
                      <div className="w-[100px] h-[100px] rounded-full">
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
                          className='w-[40px] h-[64px] rounded-md'
                          src={notification.bookImage}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col text-lg font-semibold">
                      <p>{notification.message}</p>

                      <p onClick={(e) => {
                         e.stopPropagation();
                        deleteNotification(notification.id)
                        }} 
                        className="hover:cursor-pointer hover:underline text-sm font-normal hover:text-red-600">delete</p>
                    </div>

              </div>
            ))}
          </div> 
      )}

  
     

    </div>
  )
}

export default Notifications