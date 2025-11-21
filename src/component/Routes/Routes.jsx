import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AuthForm from "../Login/Authform";
import Layout from "../Pages/Layout";
import Dashboard from "../Pages/Dashboard";
import WorkoutForm from "../Workout/WorkoutForm";
import WorkoutList from "../Workout/WorkoutList";
import CheckProgress from "../Progress/CheckProgress";
import ProgressDetails from "../Progress/ProgressDetails";
import Home from "../Home/Home";

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>

      {/* Public Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <AuthForm />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={isLoggedIn ? <Layout /> : <Navigate to="/login" />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<WorkoutForm />} />
        <Route path="/view" element={<WorkoutList />} />
        <Route path="/check" element={<CheckProgress />} />
        <Route path="/progress/:group" element={<ProgressDetails />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
