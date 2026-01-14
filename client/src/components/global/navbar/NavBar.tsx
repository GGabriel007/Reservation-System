import { NavLink, useLocation, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  /**
   * Dynamic Styling Helper
   * React Router's NavLink provides an 'isActive' boolean.
   * This function ensures the user knows exactly which page they are currently viewing.
   */
  // const linkClass = ({ isActive }: { isActive: boolean }) =>
  //   isActive ? styles.active : "";

  // Define specific View States
  const isStaffLogin = currentPath === "/staffLogin";
  const isStaffDashboard = currentPath.startsWith("/admin") || currentPath.startsWith("/manager");
  
  // Environment Setup for Logout
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  /**
   * Global Logout Handler
   * Now uncommented and fully functional.
   */
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/auth/logout`, {
        method: "POST", 
        credentials: "include", 
      });

      // Smart Redirect
      const redirectPath = isStaffDashboard ? "/staffLogin" : "/login";
      navigate(redirectPath);
      
    } catch (error) {
      console.error("Logout request failed:", error);
      navigate("/login");
    }
  };

  return (
    <header>
      <nav>
        <div className={styles["inner-grid"]}>
          {/* Brand Identity */}
          <NavLink to={isStaffDashboard ? "/admin" : "/"}>
            <img src="/liore.svg" alt="Liore Spa & Resort" />
          </NavLink>

          {/* Navigation Links */}
          <div className={styles.navlinks}>
            
            {/* SCENARIO A: STAFF LOGIN PAGE (Clean Slate) */}
            {isStaffLogin ? (
               // Render nothing here, just the logo on the left
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

                {currentPath !== "/login" && (
                  <NavLink to="/login" className="btn-transparent">
                    Sign In
                  </NavLink>
                )}

                {(currentPath === "/" || currentPath === "/check-reservation") && (
                  <NavLink to="/roomlisting" className="btn-secondary">
                    Book Now
                  </NavLink>
                )}

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