import { NavLink, useNavigate } from "react-router-dom";

/**
 * Navbar Component
 * Provides global navigation and handles session termination.
 * Uses NavLink to provide visual feedback for the current active route.
 */
export default function Navbar() {
  const navigate = useNavigate();

  // Environment-based API selection for logout endpoint
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:5050"
    : "http://ec2-54-210-167-76.compute-1.amazonaws.com:5050";

  /**
   * Global Logout Handler
   * Notifies the server to destroy the session and clear the 'sid' cookie.
   * On success, it redirects the user to the login screen.
   */
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); 

    try {
      const response = await fetch(`${baseUrl}/auth/logout`, {
        method: "GET", 
        credentials: "include", // Essential to send the session cookie for identification
      });

      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };

  /**
   * Dynamic Styling Helper
   * React Router's NavLink provides an 'isActive' boolean.
   * This function ensures the user knows exactly which page they are currently viewing.
   */
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    isActive 
      ? "text-blue-400 font-bold border-b-2 border-blue-400 pb-1" 
      : "text-gray-300 hover:text-white transition-all duration-200";

  return (
    <header className="w-full bg-gray-900 text-white shadow-xl">
      <nav className="flex items-center justify-between max-w-7xl mx-auto p-4 px-6">
        
        {/* Brand Identity */}
        <NavLink to="/" className="text-2xl font-black tracking-tighter text-white">
          LIORE
        </NavLink>
        
        {/* Navigation Links */}
        <div className="flex gap-8 items-center">
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>

          <NavLink to="/signup" className={linkClass}>
            Join
          </NavLink>

          <NavLink to="/user" className={linkClass}>
            Dashboard
          </NavLink>

          {/* Admin access (Visible logic can be added later based on user role) */}
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>

          {/* Admin access (Visible logic can be added later based on user role) */}
          <NavLink to="/adminPanel" className={linkClass}>
            Admin Panel
          </NavLink>

          {/* Logout Action */}
          <button 
            onClick={handleLogout} 
            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}