import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles.module.css";
// Import the lazy hook from your apiSlice
import { useLazyLookupReservationQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

export default function CheckReservation() {
  const [reservationNumber, setReservationNumber] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();

  // Initialize the RTK Query hook
  // "trigger" is the function we call, and the object gives us status info
  const [triggerLookup, { isLoading, isError, error }] =
    useLazyLookupReservationQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Trigger the lookup using the RTK hook
      const reservationData = await triggerLookup({
        confirmationCode: reservationNumber,
        lastName,
        email,
      }).unwrap(); // .unwrap() allows us to catch errors in the try/catch block

      // Success: Navigate and pass data
      navigate("/found-reservation", {
        state: { reservation: reservationData },
      });
    } catch (err: any) {
      // RTK Query errors are handled here automatically
      console.error("Lookup failed:", err);
    }
  };

  useEffect(() => {
    if (isError) {
      let msg = "Could not find a reservation with those details.";

      if (error && "status" in error) {
        // FetchBaseQueryError
        const data = error.data as { message?: string } | undefined;
        if (data?.message) msg = data.message;
      }

      toast.error(msg);
    }
  }, [isError, error]);

  return (
    <main className={styles.checkReservationPage}>
      <div className={styles["inner-grid"]}>
        <h1>Welcome to Lioré</h1>
        <p>Thank you for booking your stay with us</p>
        <div className="layout-grid">
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
              disabled={isLoading} // Use isLoading from the hook
              className="btn-primary btn-medium"
            >
              {isLoading ? "Searching..." : "Submit"}
            </button>

            <div className={styles.links}>
              <p>
                Have an account? <Link to="/login">Sign In</Link>
              </p>
              <p>
                Want to join? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
