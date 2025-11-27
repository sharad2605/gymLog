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
  const userId = localStorage.getItem("userId");

  if (token && email) {
    dispatch(login({ token, email }));

    // --- LOAD WORKOUT DATA ON REFRESH ---
    if (userId) {
      fetch(`https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout/${userId}.json`)
        .then(res => res.json())
        .then(data => {
          const arr = data ? Object.values(data) : [];
          dispatch(setWorkouts(arr));
        });
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
