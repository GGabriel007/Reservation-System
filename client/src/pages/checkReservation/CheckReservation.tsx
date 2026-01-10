import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles.module.css";

export default function CheckReservation() {
  const [reservationNumber, setReservationNumber] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // Added Email state
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  const baseUrl: string = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    // Convert inputs into Query Parameters for the GET request
    const params = new URLSearchParams({
      confirmationCode: reservationNumber,
      lastName: lastName,
      email: email
    });

    try {
      const response = await fetch(`${baseUrl}/reservations/lookup?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const reservationData = await response.json();
        // Navigate to your "foundReservation" page and pass the data via state
        navigate("/found-reservation", { state: { reservation: reservationData } });
      } else {
        const errorData = await response.json().catch(() => ({ message: "Reservation not found" }));
        setErrorMessage(errorData.message || "Could not find a reservation with those details.");
      }
    } catch (error) {
      console.error("Lookup error:", error);
      setErrorMessage("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.checkReservationPage}>
      <div className={styles["inner-grid"]}>
        <h1>Welcome to Lioré</h1>
        <p>Thank you for booking your stay with us</p>
        <div className="layout-grid">
          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2>
              Look up your stay <span>* required</span>
            </h2>

            <label className={styles.flex}>
              Confirmation Number *
              <input
                type="text"
                placeholder="e.g. 8220YOU"
                value={reservationNumber}
                onChange={(e) => setReservationNumber(e.target.value)}
                required
              />
            </label>

            <label className={styles.flex}>
              Last Name *
              <input
                type="text"
                placeholder="e.g. Smith"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>

            <label className={styles.flex}>
              Email Address *
              <input
                type="email"
                placeholder="e.g. guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? "Searching..." : "Find Reservation"}
            </button>

            <div className={styles.links}>
              <p>Have an account? <Link to="/login">Sign In</Link></p>
              <p>Want to join? <Link to="/signup">Sign Up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}