import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/redux/store"; 
import { setUser } from "@/redux/features/user/userSlice"; 
import styles from "./styles.module.css";

/**
 * Staff Portal Login
 * Minimalist, corporate gateway for Administrators and Managers.
 * Exclusively uses Local Authentication.
 */
export default function StaffLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch(); 

  const baseUrl: string = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/auth/local/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const loggedInUser = data.user;

        // Verify if user has staff privileges
        if (loggedInUser.role === "admin" || loggedInUser.role === "manager") {
          
          // Dispatch the user data
          dispatch(setUser(loggedInUser));

          // Logic-based redirection
          if (loggedInUser.role === "manager") {
            navigate("/adminPanel"); 
          } else if (loggedInUser.role === "admin") {
            navigate("/admin/dashboard"); 
          }
        } else {
          setErrorMessage("Access Denied: This portal is for authorized staff only.");
        }
      } else {
        setErrorMessage(data.message || "Invalid corporate credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.staffLoginPage}>
      <div className={styles.loginContainer}>
        
        {/* Branding Header */}
        <header className={styles.branding}>
          <h1>Lioré <span className={styles.goldText}>Corporate</span></h1>
          <p>Global Property Management Systems</p>
        </header>

        {/* Login Section */}
        <section>
          <div className={styles.staffBadge}>Authorized Personnel Only</div>

          {errorMessage && <div className={styles.errorBanner}>{errorMessage}</div>}

          <form onSubmit={handleStaffLogin}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Corporate ID / Email</label>
              <input
                id="email"
                type="email"
                placeholder="staff@liore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Security Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.loginBtn}
            >
              {isSubmitting ? "Authenticating..." : "Access System"}
            </button>
          </form>
        </section>

        {/* Footer */}
        <div className={styles.footer}>
          <p>&copy; 2026 Lioré Hospitality Group. All systems monitored.</p>
          <Link to="/" className={styles.guestLink}>Return to Guest Site</Link>
        </div>
      </div>
    </main>
  );
}