// src/components/Pages/Layout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar receives open & setter */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content area shifts on md screens (md:ml-64) */}
      <div className="flex-1 flex flex-col ml-0 md:ml-60 transition-all duration-300">
        {/* Header receives setter and current state so it can toggle */}
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
/>

        <main className="flex-1 p-4 md:p-2 mt-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
