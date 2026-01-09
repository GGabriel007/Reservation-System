import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styles from "./styles.module.css";

/**
 * Login Page Component
 * Provides two authentication paths:
 * Local: Submits credentials via JSON Fetch request to establish a session.
 * Google OAuth: Redirects the browser to the Google authorization server.
 */
export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check if user was redirected here after a successful signup
  const signupSuccess = location.state?.signupSuccess;

  // Environment-based API selection
  const baseUrl: string = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  /**
   * Local Login Handler
   * Sends email/password to the backend and expects a session cookie in return.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/auth/local/login`, {
        method: "POST",
        credentials: "include", // Required to receive and store the 'sid' session cooki
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate("/user");
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Invalid credentials" }));
        setErrorMessage(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login network error:", error);
      setErrorMessage("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles["inner-grid"]}>
        <h1>Welcome to Lioré</h1>
        <h2>
          Log In<span>* required</span>
        </h2>
        <div className="layout-grid">
          {/* Success message from Signup page redirect */}
          {signupSuccess && <p>Account created successfully! Please log in.</p>}
          {errorMessage && <p>{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <label className={styles.flex}>
              Email Address *
              <input
                type="email"
                placeholder="name@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <label className={styles.flex}>
              Password *
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary btn-medium
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
            >
              {isSubmitting ? "Logging in..." : "Login with Email"}
            </button>
          </form>
          <a className={styles.google} href={`${baseUrl}/auth/google/login`}>
            Login with Google
          </a>
        </div>
        <p>
          Not yet a member? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
