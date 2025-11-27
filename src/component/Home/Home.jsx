import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Header from "../Header/Header";
import { useSelector } from "react-redux";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <Header />

      <div className="landing-bg relative flex justify-center items-center h-screen text-white">
        <div className="overlay"></div>

        <div className="landing-content text-center z-10">
          <h1 className="text-4xl font-bold">
            Track. Improve. <span className="text-yellow-400">Transform</span>.
          </h1>
          <p className="mt-3 text-lg">
            Your personal workout tracker made simple.
          </p>

          <Link to={isLoggedIn ? "/dashboard" : "/login"}>
            <button
              className="mt-5 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all"
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
