import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FaHome, FaBell, FaComments, FaHandHoldingHeart } from "react-icons/fa";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, getDocs, writeBatch } from "firebase/firestore";

export default function Header() {
  const [user, setUser] = useState(null);
  const [hasUnseenNotifications, setHasUnseenNotifications] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  // Listen for auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsub();
  }, [auth]);

  // Listen for unseen notifications
  useEffect(() => {
    if (!user) return;
    // Restructure query to avoid needing a composite index
    const q = query(
      collection(db, "notifications"),
      where("toUserId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const hasUnread = snapshot.docs.some((doc) => !doc.data().read);
      setHasUnseenNotifications(hasUnread);
    });
    return () => unsub();
  }, [user]);

  // Listen for unread chats in real-time
  useEffect(() => {
    if (!user) return;
    // Only use one array-contains filter to avoid Firestore error
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      // Check for unread in client-side
      const hasUnread = snapshot.docs.some(
        (doc) => Array.isArray(doc.data().unread) && doc.data().unread.includes(user.uid)
      );
      setHasUnreadMessages(hasUnread);
    });
    return () => unsub();
  }, [user]);

  // Mark notifications as read when visiting /notifications
  useEffect(() => {
    if (!user) return;
    if (location.pathname === "/notifications") {
      const markAllNotificationsRead = async () => {
        const q = query(
          collection(db, "notifications"),
          where("toUserId", "==", user.uid),
          where("read", "==", false)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const batch = writeBatch(db);
          snapshot.forEach((docSnap) => {
            batch.update(docSnap.ref, { read: true });
          });
          await batch.commit();
        }
      };
      markAllNotificationsRead();
    }
  }, [location.pathname, user]);

  // Mark chats as read when visiting /chats
  useEffect(() => {
    if (!user || location.pathname !== "/chats") return;

    const markAllChatsRead = async () => {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", user.uid)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return;

      const batch = writeBatch(db);
      let hasChanges = false;
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.unread?.includes(user.uid)) {
          const unread = data.unread.filter((id) => id !== user.uid);
          batch.update(docSnap.ref, { unread });
          hasChanges = true;
        }
      });

      if (hasChanges) {
        await batch.commit();
      }
    };

    markAllChatsRead();
  }, [location.pathname, user]);

  function pathMatchRoute(route) {
    return route === location.pathname;
  }

  // Badge component
  const RedDot = (
    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
  );

  return (
    <div className="bg-cream shadow-sm sticky top-0 z-40">
      <header className="flex justify-between items-center max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-12 py-2">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <img src="/logo.png" alt="FeedJoy Logo" className="h-8 w-8" />
            <h1 className="text-dark-olive font-bold text-2xl">FEEDJOY</h1>
          </button>
        </div>
        <div>
          <ul className="flex space-x-4 sm:space-x-8 items-center">
            <li
              className={`relative cursor-pointer py-3 text-xl sm:text-2xl border-b-[3px] border-b-transparent ${
                pathMatchRoute("/") && "text-olive-green border-b-olive-green"
              }`}
              title="Home"
              onClick={() => navigate("/")}
            >
              <FaHome className="text-olive-green hover:text-golden-yellow active:text-dark-olive transition-colors duration-150" />
            </li>
            <li
              className={`relative cursor-pointer py-3 text-xl sm:text-2xl border-b-[3px] border-b-transparent ${
                pathMatchRoute("/offers") && "text-olive-green border-b-olive-green"
              }`}
              title="Donations"
              onClick={() => navigate("/offers")}
            >
              <FaHandHoldingHeart className="text-olive-green hover:text-golden-yellow active:text-dark-olive transition-colors duration-150" />
            </li>
            <li
              className={`relative cursor-pointer py-3 text-xl sm:text-2xl border-b-[3px] border-b-transparent ${
                pathMatchRoute("/chats") && "text-olive-green border-b-olive-green"
              }`}
              title="Chats"
              onClick={() => (user ? navigate("/chats") : navigate("/sign-in"))}
            >
              <span className="relative">
                <FaComments className="text-olive-green hover:text-golden-yellow active:text-dark-olive transition-colors duration-150" />
                {hasUnreadMessages && RedDot}
              </span>
            </li>
            <li
              className={`relative cursor-pointer py-3 text-xl sm:text-2xl border-b-[3px] border-b-transparent ${
                pathMatchRoute("/notifications") && "text-olive-green border-b-olive-green"
              }`}
              title="Notifications"
              onClick={() =>
                user ? navigate("/notifications") : navigate("/sign-in")
              }
            >
              <span className="relative">
                <FaBell className="text-olive-green hover:text-golden-yellow active:text-dark-olive transition-colors duration-150" />
                {hasUnseenNotifications && RedDot}
              </span>
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-dark-olive border-b-[3px] border-b-transparent flex items-center gap-2 ${
                (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                "text-olive-green border-b-olive-green"
              }`}
              onClick={() => navigate("/profile")}
              title="Profile"
            >
              <img
                src={user?.photoURL || "/placeholder.jpg"}
                alt="avatar"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
              />
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}


