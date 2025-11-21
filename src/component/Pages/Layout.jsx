import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import Header from "../Header/Header";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.userEmail);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
