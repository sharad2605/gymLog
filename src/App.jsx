import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setWorkouts } from './store/workoutSlice.jsx';
import { login, logout } from './store/authSlice.jsx';
import AppRoutes from './component/Routes/Routes.jsx';

function App() {
  const dispatch = useDispatch();

 useEffect(() => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const expirationTime = localStorage.getItem("expirationTime");

  if (token && email) {
    dispatch(login({ token, email }));

    const remainingTime = expirationTime - new Date().getTime();
    if (remainingTime <= 0) {
      dispatch(logout());
      localStorage.clear();
    } else {
      setTimeout(() => {
        dispatch(logout());
        localStorage.clear();
        alert("Session expired!");
      }, remainingTime);
    }
  }
}, []);


  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
