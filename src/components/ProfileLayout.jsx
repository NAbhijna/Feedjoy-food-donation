import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaPlus, FaList, FaBell, FaSignOutAlt, FaComments, FaBars, FaTimes } from "react-icons/fa";
import { auth, db } from "../firebase"; // Import auth from firebase.js
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ChatList from "../pages/ChatList"; // Import ChatList for sidebar

export default function ProfileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [hasUnreadChats, setHasUnreadChats] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    // Restructure query to avoid needing a composite index
    const q = query(
      collection(db, "notifications"),
      where("toUserId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const hasUnread = snapshot.docs.some((doc) => !doc.data().read);
      setHasUnreadNotifications(hasUnread);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Remove the 'unread' array-contains filter to avoid Firestore error
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      // Check for unread in client-side
      const hasUnread = snapshot.docs.some(
        (doc) => Array.isArray(doc.data().unread) && doc.data().unread.includes(user.uid)
      );
      setHasUnreadChats(hasUnread);
    });
    return () => unsub();
  }, [user]);

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  const baseLinkClass =
    "flex items-center gap-3 p-3 rounded-lg transition-colors";
  const activeLinkClass = "bg-olive-green text-white";
  const inactiveLinkClass = "hover:bg-golden-yellow/50 text-dark-olive";

  const RedDot = (
    <span className="relative ml-1">
      <span className="w-3 h-3 bg-red-600 rounded-full flex items-center justify-center absolute -top-1 -right-2">
        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
      </span>
    </span>
  );

  // Sidebar content as a component for reuse
  const SidebarNav = (
    <nav className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
          onClick={() => setSidebarOpen(false)}
        >
          <FaHome className="mr-3" />
          Profile
        </NavLink>
        <NavLink
          to="/create-listing"
          className={({ isActive }) =>
            `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
          onClick={() => setSidebarOpen(false)}
        >
          <FaPlus className="mr-3" />
          Post a Donation
        </NavLink>
        <NavLink
          to="/View-listing"
          className={({ isActive }) =>
            `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
          onClick={() => setSidebarOpen(false)}
        >
          <FaList className="mr-3" />
          View My Donations
        </NavLink>
        <NavLink
          to="/chats"
          className={({ isActive }) =>
            `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
          onClick={() => setSidebarOpen(false)}
        >
          <span className="relative flex items-center">
            <FaComments className="mr-3" />
            {hasUnreadChats && RedDot}
          </span>
          Chats
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
          onClick={() => setSidebarOpen(false)}
        >
          <span className="relative flex items-center">
            <FaBell className="mr-3" />
            {hasUnreadNotifications && RedDot}
          </span>
          Notifications
        </NavLink>
      </div>
      <div>
        <button
          onClick={() => {
            setSidebarOpen(false);
            onLogout();
          }}
          className={`${baseLinkClass} ${inactiveLinkClass} w-full mt-6`}
        >
          <FaSignOutAlt className="mr-3" />
          Sign Out
        </button>
      </div>
    </nav>
  );

  // Detect if we are on a single chat page
  const isChatPage = /^\/chat\/[^/]+$/.test(location.pathname);

  return (
    <div className="max-w-screen-2xl mx-auto flex w-full min-h-[calc(100vh-68px)] px-6 sm:px-10 lg:px-12 py-4 gap-6">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-20 right-4 z-50 bg-olive-green text-white p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 flex-shrink-0 bg-cream border-2 border-golden-yellow rounded-2xl p-4 sticky top-[84px] h-[calc(100vh-116px)] overflow-y-auto">
        {isChatPage ? (
          // Show chat list in sidebar when inside a chat
          <div>
            <h2 className="text-xl font-bold text-dark-olive mb-4">My Chats</h2>
            <ChatList sidebarMode />
          </div>
        ) : (
          SidebarNav
        )}
      </aside>

      {/* Sidebar drawer for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex">
          <div className="w-64 bg-cream h-full p-6 shadow-lg relative animate-slide-in-left border-r-2 border-golden-yellow">
            <button
              className="absolute top-4 right-4 text-dark-olive"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <FaTimes size={24} />
            </button>
            {isChatPage ? (
              <div>
                <h2 className="text-xl font-bold text-dark-olive mb-4">My Chats</h2>
                <ChatList sidebarMode onChatClick={() => setSidebarOpen(false)} />
              </div>
            ) : (
              SidebarNav
            )}
          </div>
          <div
            className="flex-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation overlay"
          />
        </div>
      )}

      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
