import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles.module.css";
/**
 * Check for Reservation Page Component
 * for users to check reservation using their reservation number
 */
export default function CheckReservation() {
  const [reservationNumber, setReservationNumber] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  // Environment-based API selection
  const baseUrl: string = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/reservation`, {
        method: "GET",
        credentials: "include", // Required to receive and store the 'sid' session cooki
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationNumber, lastName }),
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
    <main className={styles.checkReservationPage}>
      <div className={styles["inner-grid"]}>
        <h1>Welcome to Lioré</h1>
        <p>Thank you for booking your stay with us </p>
        <div className="layout-grid">
          {errorMessage && <p>{errorMessage}</p>}

          {/* Success message from Signup page redirect */}
          <form onSubmit={handleSubmit}>
            <h2>
              Enter your reservation number<span>* required</span>
            </h2>
            <label className={styles.flex}>
              Reservation Number *
              <input
                type="text"
                placeholder="1FSDIE239"
                value={reservationNumber}
                onChange={(e) => setReservationNumber(e.target.value)}
                required
              />
            </label>

            <label className={styles.flex}>
              Last Name *
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
              {isSubmitting
                ? "Looking for reservation..."
                : "Look for reservation"}
            </button>
            <p>
              Have an account with us? <Link to="/login">Sign In</Link>
            </p>
            <p>
              Want to join as a member? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
