// src/components/Header/Header.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { Menu, X, LogOut, User } from "lucide-react"; // LogOut aur User icon import kiya
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";

// isMobile prop Layout.jsx se aayega
const Header = ({ sidebarOpen = false, setSidebarOpen = null, isMobile }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const userEmail = useSelector((state) => state.auth.userEmail);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("expirationTime");
  };

  const onLoginPage = location.pathname === "/login";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white shadow-lg z-50 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile toggle button */}
        {typeof setSidebarOpen === "function" && (
          <button
            className="md:hidden p-2 bg-gray-800 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        {/* Logo clickable to Home */}
        <Link to="/" className="flex items-center gap-2">
          {/* Assuming logo.png is in public/images/ */}
          <img src="/images/logo.png" alt="GymLog Logo" className="h-8 w-8" /> 
          <h1 className="text-2xl font-bold text-yellow-400 cursor-pointer">GymLog</h1>
        </Link>
      </div>

      {/* RENDER BLOCK: Login / Logout */}
      {isLoggedIn ? (
        // ✅ Desktop View: Show Email and Logout button with updated design
        !isMobile ? (
          <div className="flex items-center gap-4">
            {/* Email Icon aur Text */}
            <span className="font-semibold hidden sm:flex items-center gap-2 text-gray-300">
                <User size={18} className="text-yellow-400" />
                {userEmail}
            </span>
            
            {/* LOGOUT Button (New Red Design) */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        ) : null // Mobile view mein Logout Sidebar mein hai
      ) : (
        // Logged Out: Show Login button (Original Yellow Design)
        !onLoginPage && (
          <div>
            <Link
              to="/login"
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              <span className="hidden sm:inline">Login</span>
              <User size={18} className="sm:hidden inline" />
            </Link>
          </div>
        )
      )}
    </header>
  );
};

export default Header;