import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // Import auth from firebase.js
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { FaBackward } from "react-icons/fa";

export default function Chat() {
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverInfo, setReceiverInfo] = useState(null);
  const messagesEndRef = useRef(null);

  const currentUser = auth.currentUser;

  const chatId = currentUser
    ? currentUser.uid > receiverId
      ? `${currentUser.uid}_${receiverId}`
      : `${receiverId}_${currentUser.uid}`
    : null;

  // Ensure chat document exists before anything else and THEN set up listeners
  useEffect(() => {
    let unsubscribe = null;
    if (!currentUser || !chatId) {
      navigate("/sign-in");
      return;
    }

    let isMounted = true;

    const setupChatAndListeners = async () => {
      const chatDocRef = doc(db, "chats", chatId);
      const chatDocSnap = await getDoc(chatDocRef);
      if (!chatDocSnap.exists()) {
        await setDoc(chatDocRef, {
          participants: [currentUser.uid, receiverId],
          lastMessage: "",
          updatedAt: serverTimestamp(),
          unread: [],
        });
      }

      // Fetch receiver info
      const userDoc = await getDoc(doc(db, "users", receiverId));
      if (userDoc.exists() && isMounted) {
        setReceiverInfo(userDoc.data());
      }

      // Mark chat as read
      const chatDoc = await getDoc(chatDocRef);
      if (chatDoc.exists() && chatDoc.data().unread?.includes(currentUser.uid)) {
        const unread = chatDoc.data().unread.filter((id) => id !== currentUser.uid);
        await updateDoc(chatDocRef, { unread });
      }

      // Now set up the message listener
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (isMounted) setMessages(msgs);
        // Mark as read again in case new messages arrive while on the page
        if (msgs.length > 0) {
          updateDoc(chatDocRef, {
            unread: (chatDoc.data().unread || []).filter((id) => id !== currentUser.uid),
          });
        }
      });
    };

    setupChatAndListeners();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, chatId, receiverId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const chatDocRef = doc(db, "chats", chatId);
    // Always create chat doc if missing, and set correct fields
    let chatDocSnap = await getDoc(chatDocRef);
    if (!chatDocSnap.exists()) {
      await setDoc(chatDocRef, {
        participants: [currentUser.uid, receiverId],
        lastMessage: newMessage,
        updatedAt: serverTimestamp(),
        unread: [receiverId],
      });
    } else {
      await setDoc(
        chatDocRef,
        {
          participants: [currentUser.uid, receiverId],
          lastMessage: newMessage,
          updatedAt: serverTimestamp(),
          unread: [receiverId],
        },
        { merge: true }
      );
    }

    // Now add the message
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  if (!currentUser) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] max-w-4xl mx-auto bg-cream">
      <header className="flex items-center p-4 border-b border-golden-yellow sticky top-0 bg-cream z-10">
        <button onClick={() => navigate(-1)} className="p-2 mr-4">
          <FaBackward className="text-dark-olive" />
        </button>
        {receiverInfo && (
          <div className="flex items-center gap-3">
            <img
              src={receiverInfo.avatarUrl || "/default-avatar.png"}
              alt="receiver avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold text-dark-olive">
              {receiverInfo.name}
            </h1>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${
              msg.senderId === currentUser.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                msg.senderId === currentUser.uid
                  ? "bg-olive-green text-white"
                  : "bg-golden-yellow text-dark-olive"
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-golden-yellow flex items-center gap-4 sticky bottom-0 bg-cream"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-white border border-golden-yellow rounded-2xl focus:outline-none focus:ring-2 focus:ring-burnt-orange text-dark-olive"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-olive-green text-white font-semibold rounded-2xl hover:bg-dark-olive transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
    