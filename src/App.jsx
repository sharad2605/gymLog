import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setWorkouts } from "./store/workoutSlice";
import { login, logout } from "./store/authSlice";
import AppRoutes from "./component/Routes/Routes";
import {Toaster} from "react-hot-toast";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const expirationTimeStr = localStorage.getItem("expirationTime");

    if (token && email) {
      // parse expiration
      const expirationTime = expirationTimeStr ? parseInt(expirationTimeStr, 10) : null;
      dispatch(login({ token, email }));

      if (expirationTime) {
        const remaining = expirationTime - Date.now();
        if (remaining <= 0) {
          dispatch(logout());
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("expirationTime");
        } else {
          setTimeout(() => {
            dispatch(logout());
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("expirationTime");
            toast.error("Session expired!");
          }, remaining);
        }
      }

      // Load workouts — fetch whole addworkout and filter by sanitized email
      (async () => {
        try {
          const res = await fetch("https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout.json");
          const data = await res.json();
          const sanitized = email.replace(/\./g, ",");
          const arr = Object.entries(data || {})
            .filter(([id, w]) => w.user === sanitized)
            .map(([id, w]) => ({ id, ...w }));
          dispatch(setWorkouts(arr));
        } catch (err) {
          console.error("Error loading workouts:", err);
        }
      })();
    }
  }, [dispatch]);

  return (
    <Router>
      <AppRoutes />
       <Toaster position="top-center" />
    </Router>
  );
}

export default App;
