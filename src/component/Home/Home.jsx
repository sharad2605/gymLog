import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { useSelector } from "react-redux";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="landing-bg relative flex justify-center items-center min-h-screen text-white px-4">
      {/* Overlay */}
      <div className="overlay absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="landing-content text-center z-10 max-w-xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-snug">
          Track. Improve. <span className="text-yellow-400">Transform</span>.
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl">
          Your personal workout tracker made simple.
        </p>

        <Link to={isLoggedIn ? "/dashboard" : "/login"}>
          <button className="mt-6 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
