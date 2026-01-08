import { NavLink } from "react-router-dom";
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

  /**
   * Dynamic Styling Helper
   * React Router's NavLink provides an 'isActive' boolean.
   * This function ensures the user knows exactly which page they are currently viewing.
   */
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? styles.active : "";

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
            <NavLink to="/stay" className={linkClass}>
              Stay
            </NavLink>

            <NavLink to="/dinning" className={linkClass}>
              Dinning
            </NavLink>

            <NavLink to="/login" className="btn-transparent">
              Sign In
            </NavLink>

            {/* Admin access (Visible logic can be added later based on user role) */}
            <NavLink to="/bookroom" className="btn-secondary">
              Book
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
