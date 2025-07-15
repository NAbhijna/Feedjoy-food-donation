import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function ChatList({ sidebarMode = false, onChatClick }) {
  const auth = getAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const chatsData = await Promise.all(
        querySnapshot.docs.map(async (chatDoc) => {
          const chatData = chatDoc.data();
          const receiverId = chatData.participants.find(
            (p) => p !== currentUser.uid
          );
          if (!receiverId) return null;

          const userDoc = await getDoc(doc(db, "users", receiverId));
          const receiverInfo = userDoc.data();

          return {
            id: chatDoc.id,
            receiverId,
            ...chatData,
            receiverInfo,
          };
        })
      );
      setChats(chatsData.filter(Boolean));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={sidebarMode ? "space-y-2" : "max-w-4xl mx-auto p-4"}>
      {!sidebarMode && (
        <h1 className="text-2xl sm:text-3xl text-center my-4 sm:my-6 font-bold text-dark-olive">
          My Chats
        </h1>
      )}
      {chats.length === 0 ? (
        <p
          className={
            sidebarMode
              ? "text-dark-olive/80 text-sm"
              : "text-center text-dark-olive/80"
          }
        >
          You have no active conversations.
        </p>
      ) : (
        <div className={sidebarMode ? "space-y-2" : "space-y-4"}>
          {chats.map((chat) => {
            const isUnread =
              Array.isArray(chat.unread) &&
              chat.unread.includes(currentUser.uid);
            return (
              <div
                key={chat.id}
                onClick={() => {
                  navigate(`/chat/${chat.receiverId}`);
                  if (onChatClick) onChatClick();
                }}
                className={`flex items-center p-2 ${
                  sidebarMode ? "rounded-lg" : "rounded-2xl"
                } shadow-md cursor-pointer hover:shadow-lg transition-shadow hover:bg-golden-yellow relative bg-white`}
              >
                <div className="relative">
                  <img
                    src={chat.receiverInfo?.avatarUrl || "/default-avatar.png"}
                    alt="avatar"
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover mr-3"
                  />
                  {isUnread && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-dark-olive truncate">
                    {chat.receiverInfo?.name}
                  </p>
                  {!sidebarMode && (
                    <p className="text-sm text-dark-olive/70 truncate">
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
