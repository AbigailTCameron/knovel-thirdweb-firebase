import React from 'react'
import XMark from '../icons/XMark'

type Props = {
  usernameResults: any[];
  setSearchResults: Function;
  handleUsernameSearch ?:() => void;
  searchQuery : string;
  setSearchQuery: Function;
}

function UserList({usernameResults, setSearchResults, handleUsernameSearch, searchQuery, setSearchQuery}: Props) {

  return (
    <div className="w-full h-full">
         <div className="w-3/4 place-self-center flex my-2">
            <form onSubmit={handleUsernameSearch} className="flex items-center w-full bg-[#2b3a4a] rounded-3xl p-0.5">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex justify-between py-3 px-3 bg-inherit w-full h-full text-white/70 rounded-3xl focus:outline-none" 
                  placeholder="Search username..."
                />
            </form>
          </div>
          {usernameResults.length > 0 ? (
            <div className="flex flex-col w-full mt-6 space-y-2">
              {usernameResults.map((user) => (
                <div key={user.id} className="flex text-white w-full items-center justify-center hover:cursor-pointer hover:bg-[#030712] p-2">
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