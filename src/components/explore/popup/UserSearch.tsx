import XMark from "@/components/icons/XMark";
import React, { useEffect, useState } from "react";
import { SearchedUser } from "../../../..";
import { useRouter } from "next/navigation";
import Profile from "@/components/icons/Profile";
import {
  fetchUsernameResults,
  fetchUsernameResultsWithoutLogin,
  updateFollowList,
} from "../../../../functions/community/fetch";
import { ConnectEmbed } from "thirdweb/react";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/actions/login";
import { firebaseAuthClient, firebaseLogout } from "@/app/actions/firebaseauth";
import { client } from "@/lib/client";
import { defineChain } from "thirdweb";

type Props = {
  setSearchResults: Function;
  userId: string;
};

function UserSearch({ setSearchResults, userId }: Props) {
  const avalanchefuji = defineChain({
    id: 43113,
  });

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [usernameResults, setUsernameResults] = useState<SearchedUser[]>([]);
  const [showConnect, setShowConnect] = useState(false);

  const quickSearch = async () => {
    if (!userId) {
      await fetchUsernameResultsWithoutLogin(searchQuery, setUsernameResults);
    } else {
      await fetchUsernameResults(searchQuery, setUsernameResults, userId);
    }
  };

  const toggleFollow = async (user: string) => {
    if (!userId) {
      onRequireWalletConnect?.();
      return;
    }

    await updateFollowList(userId, user);

    // Update the local state to reflect follow/unfollow changes
    setUsernameResults((prevResults) =>
      prevResults.map((u) =>
        u.id === user ? { ...u, isFollowing: !u.isFollowing } : u,
      ),
    );
  };

  useEffect(() => {
    if (searchQuery) {
      quickSearch();
    } else {
      setUsernameResults([]);
    }
  }, [searchQuery]);

  const onRequireWalletConnect = () => {
    setShowConnect(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 text-base">
      <div className="relative flex flex-col w-1/3 xl:w-1/2 sm:w-2/3 ss:w-3/4 max-h-[75vh] bg-[#131418] border border-[#272831] text-white rounded-xl shadow-lg py-4 px-4 sm:text-sm overflow-hidden">
        <div className="w-full place-self-center self-center flex space-x-2">
          <div className="flex items-center justify-center w-full border border-[#272831] rounded-xl p-0.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex py-3 px-3 bg-inherit w-full h-full text-white/70 rounded-3xl focus:outline-none"
              placeholder="Search username..."
            />
          </div>

          <XMark
            onClick={() => setSearchResults(false)}
            className="hover:cursor-pointer hover:bg-[#1b1c22] hover:rounded-lg stroke-[#7c7a85] size-6"
          />
        </div>

        {usernameResults.length > 0 ? (
          <div className="flex-1 flex-col w-full mt-6 space-y-2 overflow-y-auto">
            {usernameResults.map((user) => (
              <div
                key={user.id}
                className="flex text-white w-full items-center rounded-xl justify-center hover:bg-[#1b1c22] p-2"
              >
                <div className="w-full flex items-center justify-between gap-3">
                  {/* LEFT: avatar + names */}
                  <div className="flex space-x-4 flex-1 min-w-0">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        className="w-[50px] h-[50px] ss:w-[40px] ss:h-[40px] rounded-full"
                      />
                    ) : (
                      <Profile className="w-[50px] h-[50px] ss:w-[40px] ss:h-[40px] rounded-full stroke-white" />
                    )}

                    <div className="flex flex-col mx-2 min-w-0">
                      <div className="flex items-center space-x-2 min-w-0">
                        <p className="truncate max-w-full">{user.name}</p>
                        {user.verified && (
                          <img
                            className="w-[15px] h-[15px] se:w-[10px] se:h-[10px] shrink-0"
                            src="/verified.png"
                          />
                        )}
                      </div>

                      <p className="text-sm text-white/70 truncate max-w-full">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: follow button */}
                  {user.isFollowing ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(user.id);
                      }}
                      className="shrink-0 border-[0.1px] bg-[#0b0b0b] border-white/30 px-4 ss:px-2 py-1 rounded-xl"
                    >
                      <p className="ss:text-xs">following</p>
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(user.id);
                      }}
                      className="shrink-0 bg-[#7F60F9] px-4 ss:px-2 py-2 h-fit rounded-xl"
                    >
                      <p className="text-sm ss:text-xs font-bold">follow</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full items-center justify-center text-[#eeeef0] text-sm py-2 text-center">
            {searchQuery == "" ? (
              <p>Search for user</p>
            ) : (
              <p>No results found</p>
            )}
          </div>
        )}
      </div>

      {showConnect && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 text-base">
          <div className="relative bg-transparent rounded-lg shadow-lg p-0">
            <button
              onClick={() => setShowConnect(false)}
              className="absolute top-4 right-4 hover:bg-[#1b1c22] hover:stroke-slate-200 hover:rounded-lg text-2xl font-bold z-10"
              aria-label="Close"
            >
              <XMark className="stroke-[#7c7a85] size-6" />
            </button>
            <ConnectEmbed
              client={client}
              chain={avalanchefuji}
              modalSize="wide"
              header={{
                title: "Knovel Protocol ",
                titleIcon: "/knovel-logo-white.png",
              }}
              auth={{
                getLoginPayload: async ({ address }) => {
                  return generatePayload({ address });
                },
                doLogin: async (params) => {
                  const result = await login(params);
                  if (result && result.token) {
                    const { token } = result;
                    firebaseAuthClient(token, router);
                    setShowConnect(false);
                  }
                },
                isLoggedIn: async () => {
                  return await isLoggedIn();
                },
                doLogout: async () => {
                  await logout();
                  await firebaseLogout(router);
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSearch;
