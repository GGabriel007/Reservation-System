import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { useAppDispatch } from "@/redux/store";
import { setUser, clearUser } from "@/redux/features/user/userSlice";
import { resetReservation } from "@/redux/features/reservation/reservationSlice";

/**
 * Navbar Component
 * Provides global navigation and handles session termination.
 * Uses NavLink to provide visual feedback for the current active route.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useAppDispatch();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Define View States
  const isStaffLogin = currentPath === "/staffLogin";
  // Checks for /admin, /adminPanel, /manager, etc.
  const isStaffDashboard = currentPath.startsWith("/admin") || currentPath.startsWith("/manager");

  // Environment Setup for Logout
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  // Check authentication status on mount and route changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${baseUrl}/auth/status`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const authStatus = data.isAuthenticated || false;
          setIsAuthenticated(authStatus);

          if (authStatus && data.user) {
            dispatch(setUser(data.user));
          } else {
            dispatch(clearUser());
            // Intentionally not resetting reservation here on initial load 
            // to avoid clearing data if user refreshes page while booking
          }
        } else {
          setIsAuthenticated(false);
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        dispatch(clearUser());
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [currentPath, baseUrl, dispatch]);

  /**
   * Global Logout Handler
   * Now uncommented and fully functional.
   */
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Reset authentication state
      setIsAuthenticated(false);
      dispatch(clearUser());
      dispatch(resetReservation());

      // Smart Redirect: Staff -> Staff Login, User -> Home, Guest -> Login
      const redirectPath = isStaffDashboard ? "/staffLogin" : "/";
      navigate(redirectPath);

    } catch (error) {
      console.error("Logout request failed:", error);
      setIsAuthenticated(false);
      dispatch(clearUser());
      dispatch(resetReservation());
      navigate("/");
    }
  };

  return (
    <header>
      <nav>
        <div className={styles["inner-grid"]}>
          {/* Brand Identity */}
          {isStaffDashboard ? (
            /* For Staff: Just an image, no link, and a default cursor */
            <div style={{ cursor: 'default' }}>
              <img src="/liore.svg" alt="Liore Spa & Resort" />
            </div>
          ) : (
            /* For Guests: Standard link to home */
            <NavLink to="/">
              <img src="/liore.svg" alt="Liore Spa & Resort" />
            </NavLink>
          )}

          {/* Navigation Links */}
          <div className={styles.navlinks}>

            {/* SCENARIO A: STAFF LOGIN PAGE (Clean Slate) */}
            {isStaffLogin ? (
              null
            ) : isStaffDashboard ? (

              /* SCENARIO B: STAFF DASHBOARD (Logout Only) */
              <>
                <span style={{ color: 'white', fontSize: '0.9em', marginRight: '10px' }}>
                  Staff Workspace
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                  style={{ cursor: 'pointer' }}
                >
                  Log Out
                </button>
              </>
            ) : (

              /* SCENARIO C: GUEST VIEW (Standard) */
              <>
                {currentPath === "/" && (
                  <>
                    <HashLink to="/#stay-with-us">Stay</HashLink>
                    <HashLink to="/#dine">Dining</HashLink>
                  </>
                )}

                {/* Show "Log Out" button if user is authenticated */}
                {!isLoading && isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="btn-secondary"
                    style={{ cursor: 'pointer' }}
                  >
                    Log Out
                  </button>
                ) : (
                  /* Hide "Sign Up" and "Log In" if on Login or Signup page, or if still loading */
                  !isLoading && currentPath !== "/login" && currentPath !== "/signup" && (
                    <>
                      <NavLink to="/signup" className="btn-transparent">
                        Sign Up
                      </NavLink>
                      <NavLink to="/login" className="btn-transparent">
                        Log In
                      </NavLink>
                    </>
                  )
                )}

                {/* Show "View Profile" button if user is authenticated and not on user page */}
                {!isLoading && isAuthenticated && currentPath !== "/user" && (
                  <NavLink to="/user" className="btn-secondary">
                    View Profile
                  </NavLink>
                )}

                {(currentPath === "/" || currentPath === "/check-reservation") && (
                  <NavLink to="/roomlisting" className="btn-secondary">
                    Book Now
                  </NavLink>
                )}

                {/* Hide "Check Reservation" if we are already there */}
                {currentPath !== "/" && currentPath !== "/check-reservation" && currentPath !== "/login" && (
                  <NavLink to="/check-reservation" className="btn-secondary">
                    Check Reservation
                  </NavLink>
                )}
              </>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
}