import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header/Header";

const Authform = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
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

      if (!isLogin) {
        alert("Account created. Now login.");
        reset();
        return;
      }

      dispatch(login({ token: data.idToken, email: data.email }));
      localStorage.setItem("token", data.idToken);
      localStorage.setItem("email", data.email);    
      navigate("/dashboard");
      reset();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Header />

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg p-6 rounded-xl w-80">

          <h2 className="text-2xl font-semibold text-center mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              className="text-blue-600 ml-1 underline"
              onClick={() => setIsLogin((prev) => !prev)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Authform;
