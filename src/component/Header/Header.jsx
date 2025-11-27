import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom"; // ✅ import useLocation

const Header = ({ sidebarOpen = false, setSidebarOpen = null }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const userEmail = useSelector((state) => state.auth.userEmail);
  const location = useLocation(); // ✅ get current route

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("expirationTime");
  };

  const showUserBlock = !isMobile || sidebarOpen;
  const onLoginPage = location.pathname === "/login"; // ✅ check if we are on login page

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white shadow-lg z-50 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile toggle button only if setter exists */}
        {typeof setSidebarOpen === "function" && (
          <button
            className="md:hidden p-2 bg-gray-800 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        {/* ✅ Logo clickable to Home */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="GymLog Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-yellow-400 cursor-pointer">GymLog</h1>
        </Link>
      </div>

      {/* Show user info if logged in */}
      {isLoggedIn && showUserBlock ? (
        <div className="flex items-center gap-4">
          <span className="font-semibold hidden sm:inline">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        // Show login button only if not on login page
        !onLoginPage && (
          <div>
            <Link
              to="/login"
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              Login
            </Link>
          </div>
        )
      )}
    </header>
  );
};

export default Header;
