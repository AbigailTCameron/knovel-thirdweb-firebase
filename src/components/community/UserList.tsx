import React, { useEffect, useState } from 'react'
import XMark from '../icons/XMark'
import { fetchUsernameResults } from '../../../functions/community/fetch';

type Props = {
  setSearchResults: Function;
}

function UserList({setSearchResults}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [usernameResults, setUsernameResults] = useState([]);


  // const handleUsernameSearch = async () => {
  //   console.log("search query is", searchQuery);
  //   if (searchQuery.trim()) {
  //     await fetchUsernameResults(searchQuery.trim(), setUsernameResults);
  //   }
  // };

  const quickSearch = async() => {
    await fetchUsernameResults(searchQuery, setUsernameResults);
  }

  useEffect(() => {
    if (searchQuery) {
      quickSearch(); 
    } else {
      setUsernameResults([]); 
    }
  }, [searchQuery]);


  return (
    <div className="w-full h-full">
         <div className="w-3/4 place-self-center flex my-2">
            <div className="flex items-center w-full bg-[#111317] rounded-3xl p-0.5">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex justify-between py-3 px-3 bg-inherit w-full h-full text-white/70 rounded-3xl focus:outline-none" 
                  placeholder="Search username..."
                />
            </div>
          </div>
          
          {usernameResults.length > 0 ? (
            <div className="flex flex-col w-full mt-6 space-y-2">
              {usernameResults.map((user) => (
                <div key={user.id} className="flex text-white w-full items-center justify-center hover:cursor-pointer hover:bg-[#1c202a] p-2">
                  <div className="w-4/5 flex items-center justify-between">

                      <div className="flex space-x-4">
                          <img 
                            src={user.profilePicture}
                            className="w-[50px] h-[50px] rounded-full"
                          />

                          <div className="flex flex-col mx-2">
                                <div className="flex items-center space-x-2">
                                  <p className="">{user.name}</p>  
                                  {user.verified && (
                                    <img 
                                      className="w-[20px] h-[20px]"
                                      src="/verified.png"
                                    />
                                  )}
                                </div>
                                
                                
                                <p className="text-sm">@{user.username}</p>
                          </div>
                      </div>

                      <div className="bg-[#7F60F9] px-4 py-2 h-fit rounded-xl">
                        <p className="text-sm font-bold">follow</p>
                      </div>
                  </div>
                </div>

              ))}
          
            </div>
          ) : (
            <div className="w-full items-center justify-center text-white text-center">
              <p>No results found</p>
            </div>
          )}

          <XMark 
            className="absolute right-2 top-2 size-5 stroke-white hover:cursor-pointer"
            onClick={() => setSearchResults(false)}
          />

    </div>
  )
}

export default UserList