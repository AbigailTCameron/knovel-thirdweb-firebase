"use client";

import initializeFirebaseClient from "@/lib/initFirebase";

import { useEffect, useState } from "react";
import PageAnalytics from "../analytics/PageAnalytics";
import Sider from "../headers/Sider";
import Top from "../headers/Top";
import MediumHeader from "../headers/MediumHeader";
import Carousel from "./trending/Carousel";
import Recommend from "../community/Recommend";
import Trending from "./trending/Trending";
import Genre from "./genre/Genre";
import NftMint from "./popup/NftPopup";
import SpinLoader from "../loading/SpinLoader";
import UserSearch from "./popup/UserSearch";
import SettingsPopup from "./popup/SettingsPopup";
import ClaimedNft from "./popup/ClaimedNfft";
import Notifications from "../community/Notifications";
import { ConnectEmbed, useActiveAccount } from "thirdweb/react";
import {
  computeAffinity,
  fetchUserNftBalance,
  getUserProfile,
  mintNft,
} from "../../../functions/explore/fetch";
import { onAuthStateChanged } from "firebase/auth";
import { defineChain } from "thirdweb";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/actions/login";
import { firebaseAuthClient, firebaseLogout } from "@/app/actions/firebaseauth";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import XMark from "../icons/XMark";

const { auth } = initializeFirebaseClient();

function ExplorePageClient({}) {
  const router = useRouter();

  const avalanchefuji = defineChain({
    id: 43113,
  });

  const account = useActiveAccount();
  const [showConnect, setShowConnect] = useState(false);

  const [booting, setBooting] = useState(true); // 🔑 blocks UI until ready
  const [currentUser, setCurrentUser] = useState<string | undefined>(
    auth?.currentUser?.uid,
  );
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [genreOptions, setGenreOptions] = useState<string[]>([]);
  const [userBalance, setUserBalance] = useState(0);

  // existing popups/loaders…
  const [loading, setLoading] = useState(false);
  const [mintPopup, setMintPopup] = useState<boolean>(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [claimed, setClaimed] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settingsPopup, setSettingsPopup] = useState<boolean>(false);

  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [finishedIds, setFinishedIds] = useState<Set<string>>(new Set());
  const [followedAuthorIds, setFollowedAuthorIds] = useState<Set<string>>(
    new Set(),
  );
  const [genreAffinity, setGenreAffinity] = useState<Record<string, number>>(
    {},
  ); // for current user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u?.uid);

      if (u?.uid) {
        // Fetch user data in parallel
        const [userData] = await Promise.all([
          getUserProfile(u.uid, setProfileUrl),
          fetchUserNftBalance(u.uid, setUserBalance),
        ]);

        if (userData) {
          setUsername(userData.username ?? "");
          setName(userData.name ?? "");
          setFilePath(userData.profilePicturePath ?? "");
          if (Array.isArray(userData.genres)) setGenreOptions(userData.genres);

          const liked = Array.isArray(userData.liked) ? userData.liked : [];
          const finished = Array.isArray(userData.finished)
            ? userData.finished
            : [];
          const followedAuthors = Array.isArray(userData.following)
            ? userData.following
            : [];

          setLikedIds(new Set(liked));
          setFinishedIds(new Set(finished));
          setFollowedAuthorIds(new Set(followedAuthors));
        }
      } else {
        // logged out
        setProfileUrl("");
        setUsername("");
        setName("");
        setGenreOptions([]);
        setUserBalance(0);

        setLikedIds(new Set());
        setFinishedIds(new Set());
        setFollowedAuthorIds(new Set());
      }

      setBooting(false);
    });

    return () => unsubscribe();
  }, []);

  const mint = async () => {
    if (currentUser && account) {
      setMintLoading(true);
      await mintNft(currentUser, setClaimed, account);
      setMintLoading(false);
    }
  };

  useEffect(() => {
    if (claimed) {
      const timer = setTimeout(() => {
        setClaimed(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [claimed]);

  useEffect(() => {
    if (currentUser) {
      computeAffinity(
        currentUser,
        setGenreAffinity,
        genreOptions,
        likedIds,
        finishedIds,
      );
    }
  }, [currentUser, genreOptions, likedIds, finishedIds]);

  if (booting) {
    return (
      <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
        <SpinLoader />
        <p className="text-lg text-white font-semibold">
          Loading your Explore feed…
        </p>
      </div>
    );
  }

  const onRequireWalletConnect = () => {
    setShowConnect(true);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gradient-to-br from-[#7F60F9]/20 from-15% via-[#7F60F9]/10 via-20% to-[#000000] to-60%">
      <PageAnalytics pageTitle="Explore" pagePath="/explore" />

      <div className="relative md:hidden flex w-fit border-r-[0.5px] border-white/50 z-50">
        <Sider
          setLoading={setLoading}
          userId={currentUser}
          setSearchResults={setSearchResults}
          setShowNotifications={setShowNotifications}
          setSettingsPopup={setSettingsPopup}
        />
      </div>

      <div className="flex flex-col w-full h-full overflow-y-scroll">
        <div className="md:hidden flex flex-col w-full sticky top-0 z-40">
          <Top profileUrl={profileUrl} />
        </div>

        <div className="hidden md:flex w-full sticky top-0 z-40">
          <MediumHeader
            setLoading={setLoading}
            userId={currentUser}
            setUserResults={setSearchResults}
            setShowNotifications={setShowNotifications}
            setSettingsPopup={setSettingsPopup}
            onRequireWalletConnect={onRequireWalletConnect}
          />
        </div>

        <div className="w-full flex flex-col px-4">
          <div className="m-2">
            <Carousel userId={currentUser || ""} />
          </div>

          {genreOptions.length != 0 && (
            <div className="flex w-full mt-5 halfxl:mt-10 sm:px-2">
              <Recommend userGenres={genreOptions} />
            </div>
          )}

          <div className="flex w-full mt-20 halfxl:mt-10 sm:px-2">
            <Trending />
          </div>

          <div className="flex w-full halfxl:mt-5 lg:mt-0 sm:px-2">
            <Genre
              likedIds={likedIds}
              finishedIds={finishedIds}
              followedAuthorIds={followedAuthorIds}
              genreAffinity={genreAffinity}
            />
          </div>
        </div>
      </div>

      {mintPopup && (
        <NftMint
          onCancel={() => setMintPopup(false)}
          onConfirm={mint}
          userBalance={userBalance}
        />
      )}

      {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}

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

      {searchResults && (
        <UserSearch
          setSearchResults={setSearchResults}
          userId={currentUser || ""}
        />
      )}

      {settingsPopup && (
        <SettingsPopup
          setSettingsPopup={setSettingsPopup}
          userId={currentUser}
          profileUrl={profileUrl}
          setProfileUrl={setProfileUrl}
          oldFilePath={filePath}
          setOldFilePath={setFilePath}
          name={name}
          username={username}
        />
      )}

      {claimed && <ClaimedNft onCancel={() => setClaimed(false)} />}

      {mintLoading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Minting...</p>
        </div>
      )}

      {showNotifications && (
        <Notifications
          setShowNotifications={setShowNotifications}
          userId={currentUser}
        />
      )}
    </div>
  );
}

export default ExplorePageClient;
