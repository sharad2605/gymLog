import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const Layout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content (Sidebar width adjusted) */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">

        <Header />

        <main className="flex-1 p-4 md:p-6 mt-16 md:mt-0">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;
