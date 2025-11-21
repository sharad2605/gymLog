import React, { useState ,useEffect} from "react";
import { Button } from "react-bootstrap"; 
import { useNavigate } from "react-router-dom";
import {login,logout} from "../../store/authSlice"; 
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header/Header";

const Authform = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
   const isLoggedIn = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  
  const reset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  

  const handleAuth = async (e) => {
  e.preventDefault();

  if (!isLogin && password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const API_KEY = import.meta.env.VITE_API_KEY;
  const url = isLogin
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    // -------------------------
    // SIGNUP FLOW
    // -------------------------
    if (!isLogin) {
      const sanitizedEmail = email.replace(/\./g, ",");

      await fetch(
        `https://gymlog-46d79-default-rtdb.firebaseio.com/users/${sanitizedEmail}.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "user" }),
        }
      );

      alert("Account created successfully! Now login to continue.");
      reset();
      return; // STOP HERE
    }

    // -------------------------
    // LOGIN FLOW
    // -------------------------
    dispatch(login({ token: data.idToken, email: data.email }));

    localStorage.setItem("token", data.idToken);
    localStorage.setItem("email", data.email);
    localStorage.setItem("isLoggedIn", "true");
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour
    localStorage.setItem("expirationTime", expirationTime);
   
    navigate("/home");
    reset();
  } catch (error) {
    alert(error.message);
  }
};


  return (
    <>
    <Header />
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center">{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" variant="primary" className="w-100">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <br />
        {/* {isLogin && (
          <button className="btn btn-link text-danger" onClick={() => navigate("/forget-password")}>
            Forget Password?
          </button>
        )} */}

        <p className="text-center mt-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="btn btn-link" onClick={() => setIsLogin((prev) => !prev)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
    </>
  );
};

export default Authform;
