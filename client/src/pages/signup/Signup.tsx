import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles.module.css";

/**
 * Signup Page Component
 * Handles the registration of new local accounts.
 * On success, it redirects users to the Login page to establish their first session.
 */
export default function Signup() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  // Environment-based API selection
  const baseUrl: string = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  /**
   * Registration Handler
   * Sends user credentials to the /auth/register endpoint.
   * Note: The backend expects 'username' but we collect an email address.
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login upon successful account creation
        navigate("/login", { state: { signupSuccess: true } });
      } else {
        setErrorMessage(
          data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup network error:", error);
      setErrorMessage(
        "Unable to reach the server. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.signupPage}>
      <div className={styles["inner-grid"]}>
        <h1>Welcome to Lioré</h1>
        <h2>
          Sign Up<span>* required</span>
        </h2>
        <div className="layout-grid">
          {/* Success message from Signup page redirect */}
          {errorMessage && <p>{errorMessage}</p>}
          <form onSubmit={handleSignup}>
            <label className={styles.firstName}>
              First Name *
              <input
                type="text"
                placeholder="Frist Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label className={styles.lastName}>
              Last Name *
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
            <label className={styles.flex}>
              Phone Number *
              <input
                type="tel"
                placeholder="000-000-000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </label>
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
              {isSubmitting ? "Signing up..." : "Signup with Email"}
            </button>
          </form>
          <a className={styles.google} href={`${baseUrl}/auth/google/login`}>
            Signup with Google
          </a>
        </div>
        <p>
          Already a member? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
