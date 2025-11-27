import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Add Workout", path: "/add" },
    { name: "Workout List", path: "/view" },
    { name: "History", path: "/history" },
    { name: "AI Fitness Coach", path: "/ai-fitness", icon: <BrainCircuit size={16} className="inline-block mb-1 mr-2" /> },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed top-16 left-0 h-[calc(100%-64px)] w-64 bg-slate-900 text-white shadow-xl z-40 p-5 flex-col gap-4">
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
          <div className="fixed top-16 left-0 h-[calc(100%-64px)] w-64 bg-slate-900 text-white shadow-xl z-50 p-5 flex flex-col gap-4 md:hidden transition-transform">
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
        </>
      )}
    </>
  );
};

export default Sidebar;
