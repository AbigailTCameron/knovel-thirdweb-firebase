"use client";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import initializeFirebaseClient from "@/lib/initFirebase";
import { useParams, useRouter } from "next/navigation";
import { BookChapters, BookMetadata, EpubBook } from "../../..";
import { fetchBookInfo } from "../../../functions/read/fetch";
import { getUserProfile } from "../../../functions/explore/fetch";
import PageAnalytics from "../analytics/PageAnalytics";
import ExploreHeader from "../headers/ExploreHeader";
import Reader from "./Reader";
import UsernamePopup2 from "./UsernamePopup";
import CommentSection from "./CommentSection";
import SpinLoader from "../loading/SpinLoader";
import { defineChain } from "thirdweb";
import { client } from "@/lib/client";
import { ConnectEmbed } from "thirdweb/react";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/actions/login";
import { firebaseAuthClient, firebaseLogout } from "@/app/actions/firebaseauth";
import XMark from "../icons/XMark";

const { auth } = initializeFirebaseClient();
function ReadPageClient({}) {
  const router = useRouter();

  const avalanchefuji = defineChain({
    id: 43113,
  });

  const [showConnect, setShowConnect] = useState(false);
  const params = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>("");

  const [chapters, setChapters] = useState<BookChapters[]>([]);
  const [book, setBook] = useState<EpubBook>();
  const [metadata, setMetadata] = useState<BookMetadata>();
  const [authorId, setAuthorId] = useState<string>("");

  const [showChat, setShowChat] = useState(false);
  const [usernamePopup, setUsernamePopup] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user?.uid || undefined);

      if (user?.uid) {
        const data = await getUserProfile(user.uid, setProfileUrl);
        if (data) {
          setUsername(data.username ?? "");
          setName(data.name ?? "");
        }
      } else {
        setProfileUrl("");
        setUsername("");
        setName("");
      }
    });

    return () => unsubscribe();
  }, []);

  // 📚 2) Fetch book data when params.id changes
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!params?.id) {
        setBooting(false);
        return;
      }

      setBooting(true);
      setLoading(true);

      await fetchBookInfo(
        params.id,
        (chs: BookChapters[]) => {
          if (alive) setChapters(chs);
        },
        (bk: EpubBook) => {
          if (alive) setBook(bk);
        },
        (md: BookMetadata) => {
          if (alive) setMetadata(md);
        },
        (aid: string) => {
          if (alive) setAuthorId(aid);
        },
      );

      if (!alive) return;

      setLoading(false);
      setBooting(false);
    })();

    return () => {
      alive = false;
    };
  }, [params?.id]);

  const onRequireWalletConnect = () => {
    setShowConnect(true);
  };

  return (
    <div className="flex w-screen h-screen flex-col items-center bg-gradient-to-br from-[#7F60F9]/20 from-15% via-[#7F60F9]/10 via-20% to-[#000000] to-60%">
      <PageAnalytics pageTitle="Read" pagePath="/read" />

      <div className="sticky top-0 w-full z-50">
        <ExploreHeader
          userId={currentUser}
          profileUrl={profileUrl}
          setLoading={setLoading}
        />
      </div>

      <div className="flex w-full h-full overflow-x-hidden">
        <div
          className={`${
            showChat ? "w-[49%] sm:hidden" : "w-[100%]"
          } flex items-center justify-center h-full px-4 py-1`}
        >
          <Reader
            chapters={chapters}
            book={book}
            metadata={metadata}
            id={params.id}
            setShowChat={setShowChat}
            theme={theme}
            setTheme={setTheme}
          />
        </div>

        {usernamePopup && (
          <UsernamePopup2
            onCancel={() => setUsernamePopup(false)}
            onConfirm={() => router.push("/settings")}
          />
        )}

        {showChat && (
          <div
            className={`${
              showChat ? "grow w-[50%] sm:w-full" : "hidden"
            } h-full z-10`}
          >
            <CommentSection
              title={metadata?.title || ""}
              profileUrl={profileUrl}
              userId={currentUser || ""}
              bookId={params.id}
              authorId={authorId}
              setShowChat={setShowChat}
              username={username}
              name={name}
              setUsernamePopup={setUsernamePopup}
              onRequireWalletConnect={onRequireWalletConnect}
              theme={theme}
            />
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

      {/* ✅ Overlay with blur effect */}
      {(booting || loading) && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">
            {" "}
            {booting ? "Loading book…" : "Fetching book…"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ReadPageClient;
