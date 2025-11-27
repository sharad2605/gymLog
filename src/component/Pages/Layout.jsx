// src/components/Pages/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ✅ isMobile state added

  // Detect mobile size
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar receives open, setter, and isMobile */}
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen} 
        isMobile={isMobile} // Pass isMobile
      />

      <div className="flex-1 flex flex-col ml-0 md:ml-60 transition-all duration-300">
        {/* Header receives setter, current state, and isMobile */}
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          isMobile={isMobile} // Pass isMobile
        />

        <main className="flex-1 p-4 md:p-2 mt-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;