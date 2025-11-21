import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const userEmail = useSelector((state) => state.auth.userEmail);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  // HIDE LOGIN button on login page
  const onLoginPage = location.pathname === "/login";

  // SHOW Dashboard button on all protected routes
  const onProtected =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/add") ||
    location.pathname.startsWith("/view") ||
    location.pathname.startsWith("/check") ||
    location.pathname.startsWith("/progress");

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-warning fs-3">
          🏋️ GymLog
        </Navbar.Brand>

        {/* RIGHT SIDE BUTTONS */}
        {!isLoggedIn ? (
          !onLoginPage && (
            <Button variant="outline-light" as={Link} to="/login">
              Login
            </Button>
          )
        ) : (
          <div className="d-flex align-items-center">
            {/* SHOW USER EMAIL ON ALL PROTECTED ROUTES */}
            {onProtected && <span className="text-white me-3 fw-bold">{userEmail}</span>}

            {/* GO TO DASHBOARD BUTTON ON PROTECTED PAGES */}
           {isLoggedIn && location.pathname !== "/dashboard" && (
                <Button
                  variant="warning"
                  className="me-3"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              )}

            {/* LOGOUT */}
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
