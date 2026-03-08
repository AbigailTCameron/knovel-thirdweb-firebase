"use client";
import React, { useEffect, useState } from "react";
import initializeFirebaseClient from "@/lib/initFirebase";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "../../../functions/explore/fetch";
import PageAnalytics from "../analytics/PageAnalytics";
import Sider from "../headers/Sider";
import Top from "../headers/Top";
import MediumHeader from "../headers/MediumHeader";
import BookInfo from "./BookInfo";
import UserSearch from "../explore/popup/UserSearch";
import Notifications from "../community/Notifications";
import SettingsPopup from "../explore/popup/SettingsPopup";
import SpinLoader from "../loading/SpinLoader";
import { ConnectEmbed } from "thirdweb/react";
import { defineChain } from "thirdweb";
import { client } from "@/lib/client";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/actions/login";
import { firebaseAuthClient, firebaseLogout } from "@/app/actions/firebaseauth";
import XMark from "../icons/XMark";

const { auth } = initializeFirebaseClient();

function BookPageClient({}) {
  const avalanchefuji = defineChain({
    id: 43113,
  });

  const router = useRouter();

  const params = useParams<{ id: string }>();
  const [booting, setBooting] = useState(true); // NEW: blocks UI until BookInfo done
  const [pageOverlay, setPageOverlay] = useState(false); // generic overlay (you already had `loading`)
  const [showConnect, setShowConnect] = useState(false);

  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [finishedList, setFinishedList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);

  const [searchResults, setSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user?.uid);
      if (user) {
        const data = await getUserProfile(user.uid, setProfileUrl);
        if (data?.bookmark) {
          setBookmarks(data.bookmark);
          setLikes(data.liked);
          setFinishedList(data.finished);
          const rated = data?.rated || [];
          const userRating = rated.find(
            (rating: { bookId: string; rating: number }) =>
              rating.bookId === params.id,
          )?.rating;
          setUserRating(userRating ?? 0);
        }
        if (data) {
          setFilePath(data.profilePicturePath);
          setUsername(data.username);
          setName(data.name);
        }
      } else {
        setProfileUrl("");
      }
    });
    return () => unsubscribe();
  }, [params?.id]);

  const onRequireWalletConnect = () => {
    setShowConnect(true);
  };

  return (
    <main className="flex w-screen h-screen overflow-hidden bg-gradient-to-br from-[#7F60F9]/20 from-15% via-[#7F60F9]/10 via-20% to-[#000000] to-60%">
      <PageAnalytics pageTitle="Book" pagePath="/book" />

      <div className="flex w-fit md:hidden border-r-[0.5px] border-white/50 z-50">
        <Sider
          setLoading={setLoading}
          userId={currentUser}
          setSearchResults={setSearchResults}
          setShowNotifications={setShowNotifications}
          setSettingsPopup={setSettingsPopup}
        />
      </div>

      <div className="flex flex-col w-full h-full overflow-y-scroll">
        <div className="flex flex-col w-full md:hidden sticky top-0 z-20">
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

        <BookInfo
          userId={currentUser}
          id={params?.id}
          bookmarks={bookmarks}
          likes={likes}
          finishedList={finishedList}
          userRating={userRating}
          setUserRating={setUserRating}
          onLoadingChange={setPageOverlay} // show/hide overlay for later re-fetches
          onReady={() => setBooting(false)}
          onRequireWalletConnect={onRequireWalletConnect}
        />
      </div>

      {showConnect && (
        <div className="absolute w-screen h-screen flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
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

      {showNotifications && (
        <Notifications
          setShowNotifications={setShowNotifications}
          userId={currentUser}
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

      {/* ✅ Overlay with blur effect */}
      {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">
            Fetching book info...
          </p>
        </div>
      )}

      {(booting || pageOverlay) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">
            {booting ? "Loading book…" : "Fetching book info…"}
          </p>
        </div>
      )}
    </main>
  );
}

export default BookPageClient;
