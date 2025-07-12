import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Header() {
  const [pageState, setPageState] = useState("Sign in");
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setPageState("Profile");
        setUser(currentUser);
      } else {
        setPageState("Sign in");
        setUser(null);
      }
    });
  }, [auth]);
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }
  return (
    <div className="bg-cream border-b border-golden-yellow shadow-sm sticky top-0 z-40">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <button onClick={() => navigate("/")}>
            <h1 className="text-dark-olive font-bold text-2xl">FEEDJOY</h1>
          </button>
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-dark-olive border-b-[3px] border-b-transparent ${
                pathMatchRoute("/") && "text-olive-green border-b-olive-green"
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-dark-olive border-b-[3px] border-b-transparent ${
                pathMatchRoute("/offers") && "text-olive-green border-b-olive-green"
              }`}
              onClick={() => navigate("/offers")}
            >
              Donations
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-dark-olive border-b-[3px] border-b-transparent flex items-center gap-2 ${
                (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                "text-olive-green border-b-olive-green"
              }`}
              onClick={() => navigate("/profile")}
            >
              {user ? (
                <>
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{pageState}</span>
                </>
              ) : (
                pageState
              )}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}

