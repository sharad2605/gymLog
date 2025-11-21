import React from "react";
import { Button, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";
import Header from "../Header/Header";
import { useSelector } from "react-redux";

const Home = () => {
  const isLoggedIn = useSelector((state)=> state.auth.isAuthenticated)
 
  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <div className="landing-bg">
        <div className="overlay"></div>

        <div className="landing-content text-center">
          <h1>
            Track. Improve. <span>Transform</span>.
          </h1>
          <p>Your personal workout tracker made simple.</p>

          <Link to={isLoggedIn ? "/dashboard" : "/login"}>
            <Button variant="warning" className="btn-lg mt-3">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
