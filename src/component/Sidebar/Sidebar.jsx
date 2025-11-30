// src/components/Sidebar/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BrainCircuit, LogOut } from "lucide-react"; // LogOut icon import kiya
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import toast from "react-hot-toast";

const Sidebar = ({ open, setOpen, isMobile }) => {
  // isMobile ko props se receive kiya
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const userEmail = useSelector((state) => state.auth.userEmail);


  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Workouts", path: "/workouts" },
    { name: "History", path: "/history" },
    { name: "AI Fitness Coach", path: "/ai-fitness"  },
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    // Sidebar close kar do
    if (typeof setOpen === 'function') setOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("expirationTime");
  };

  return (
    <>
      {/* Desktop sidebar (remains the same) */}
      <div className="hidden md:flex fixed top-16 left-0 h-[calc(100%-64px)] w-64 bg-slate-900 text-white shadow-xl z-40 p-5 flex-col gap-4">
        {/* Links */}
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-2 rounded-lg hover:bg-yellow-500 transition ${location.pathname.startsWith(link.path) ? "bg-yellow-400 text-black font-semibold" : ""}`}
          >
            {link.icon} {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile overlay + slide-in */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 md:hidden z-30" onClick={() => setOpen(false)} />
          <div className="fixed top-16 left-0 h-[calc(100%-64px)] w-64 bg-slate-900 text-white shadow-xl z-50 p-5 flex flex-col justify-between md:hidden transition-transform">
            
            {/* Top Section: Links */}
            <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-2 rounded-lg hover:bg-yellow-500 transition ${location.pathname.startsWith(link.path) ? "bg-yellow-400 text-black font-semibold" : ""}`}
                  >
                    {link.icon} {link.name}
                  </Link>
                ))}
            </div>

            {/* ✅ Bottom Section: User Info and Logout (Footer) */}
            {isLoggedIn && isMobile && (
              <div className="border-t border-gray-700 pt-4 mt-auto">
                <p className="text-sm text-gray-400 mb-2 truncate" title={userEmail}>
                  {userEmail}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;