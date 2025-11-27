import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { login } from "../../store/authSlice";

import AuthForm from "../Login/Authform";
import Layout from "../Pages/Layout";
import Dashboard from "../Pages/Dashboard";
import WorkoutForm from "../Workout/WorkoutForm";
import WorkoutList from "../Workout/WorkoutList";
import History from "../History/History";
import ViewHistory from "../History/ViewHistory";
import Home from "../Home/Home";
import AiFitness from "../AI/AiFitness";
import Header from "../Header/Header";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  // ⛔ FIX: Refresh pe Redux me user wapas le aao
  useEffect(() => {
    if (!isLoggedIn && token) {
      dispatch(login({ token, email }));
    }
  }, [isLoggedIn, token, email, dispatch]);

  // 🔒 Protected Route Logic
  const ProtectedRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  return (
   <>
      <Header />
    <Routes>
     
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      
      <Route
        path="/login"
        element={!token ? <AuthForm /> : <Navigate to="/dashboard" />}
      />

      {/* PROTECTED ROUTES */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<WorkoutForm />} />
        <Route path="/view" element={<WorkoutList />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:group" element={<ViewHistory />} />
        <Route path="/ai-fitness" element={<AiFitness />} />

      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
  );
};

export default AppRoutes;
