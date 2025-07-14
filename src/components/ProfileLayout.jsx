import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaList, FaBell, FaSignOutAlt, FaComments } from "react-icons/fa";
import { getAuth } from "firebase/auth";

export default function ProfileLayout() {
  const auth = getAuth();
  const navigate = useNavigate();

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  const baseLinkClass =
    "flex items-center gap-3 p-3 rounded-lg transition-colors";
  const activeLinkClass = "bg-olive-green text-white";
  const inactiveLinkClass = "hover:bg-golden-yellow/50 text-dark-olive";

  return (
    <div className="flex w-full p-4 gap-6">
      <aside className="w-1/4">
        <nav className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${baseLinkClass} ${
                  isActive ? activeLinkClass : inactiveLinkClass
                }`
              }
            >
              <FaHome className="mr-3" />
              Profile
            </NavLink>
            <NavLink
              to="/create-listing"
              className={({ isActive }) =>
                `${baseLinkClass} ${
                  isActive ? activeLinkClass : inactiveLinkClass
                }`
              }
            >
              <FaPlus className="mr-3" />
              Post a Donation
            </NavLink>
            <NavLink
              to="/View-listing"
              className={({ isActive }) =>
                `${baseLinkClass} ${
                  isActive ? activeLinkClass : inactiveLinkClass
                }`
              }
            >
              <FaList className="mr-3" />
              View My Donations
            </NavLink>
            <NavLink
              to="/chats"
              className={({ isActive }) =>
                `${baseLinkClass} ${
                  isActive ? activeLinkClass : inactiveLinkClass
                }`
              }
            >
              <FaComments className="mr-3" />
              Chats
            </NavLink>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `${baseLinkClass} ${
                  isActive ? activeLinkClass : inactiveLinkClass
                }`
              }
            >
              <FaBell className="mr-3" />
              Notifications
            </NavLink>
          </div>
          <div>
            <button
              onClick={onLogout}
              className={`${baseLinkClass} ${inactiveLinkClass} w-full mt-6`}
            >
              <FaSignOutAlt className="mr-3" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>
      <main className="w-3/4">
        <Outlet />
      </main>
    </div>
  );
}
