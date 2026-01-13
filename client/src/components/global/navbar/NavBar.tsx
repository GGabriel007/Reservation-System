import { NavLink, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import styles from "./styles.module.css";

/**
 * Navbar Component
 * Provides global navigation and handles session termination.
 * Uses NavLink to provide visual feedback for the current active route.
 */
export default function Navbar() {
  // const navigate = useNavigate();

  // Environment-based API selection for logout endpoint
  // const baseUrl = import.meta.env.DEV
  //   ? "http://localhost:8080"
  //   : "http://liore.us-east-1.elasticbeanstalk.com";

  /**
   * Global Logout Handler
   * Notifies the server to destroy the session and clear the 'sid' cookie.
   * On success, it redirects the user to the login screen.
   */
  // const handleLogout = async (e: React.MouseEvent) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch(`${baseUrl}/auth/logout`, {
  //       method: "GET",
  //       credentials: "include", // Essential to send the session cookie for identification
  //     });

  //     if (response.ok) {
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.error("Logout request failed:", error);
  //   }
  // };

  const location = useLocation();
  const currentPath = location.pathname;
  /**
   * Dynamic Styling Helper
   * React Router's NavLink provides an 'isActive' boolean.
   * This function ensures the user knows exactly which page they are currently viewing.
   */
  // const linkClass = ({ isActive }: { isActive: boolean }) =>
  //   isActive ? styles.active : "";

  return (
    <header>
      <nav>
        <div className={styles["inner-grid"]}>
          {/* Brand Identity */}
          <NavLink to="/">
            <img src="/liore.svg" alt="" />
          </NavLink>

          {/* Navigation Links */}
          <div className={styles.navlinks}>
            {currentPath === "/" && (
              <>
                <HashLink to="/#stay-with-us">Stay</HashLink>

                <HashLink to="/#dine">Dinning</HashLink>
              </>
            )}

            <NavLink to="/login" className="btn-transparent">
              Sign In
            </NavLink>

            {(currentPath === "/" || currentPath === "/check-reservation") && (
              <NavLink to="/roomlisting" className="btn-secondary">
                Book Now
              </NavLink>
            )}

            {currentPath !== "/" && currentPath !== "/check-reservation" && (
              <NavLink to="/check-reservation" className="btn-secondary">
                Check Reservation
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
