import { useLocation, Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useCancelReservationMutation } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

export default function FoundReservation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { reservation } = location.state || {};
  const [cancelReservation, { isLoading }] = useCancelReservationMutation();

  if (!reservation) {
    return (
      <main className={styles.mainPage}>
        <div className="inner-grid">
          <div className={styles.errorContainer}>
            <h2>No Reservation Data Found</h2>
            <Link to="/checkreservation" className={styles.backLink}>
              Go Back
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // UPDATED LOGIC: Use the new guestFirstName field if available
  const guestDisplay =
    reservation.userId && typeof reservation.userId === "object"
      ? `${reservation.userId.firstName} ${reservation.userId.lastName}`
      : `${reservation.guestFirstName || ""} ${
          reservation.guestLastName || ""
        }`.trim();

  const checkInDate = new Date(reservation.checkIn);
  const checkOutDate = new Date(reservation.checkOut);
  const nights = Math.max(
    1,
    Math.ceil(
      Math.abs(checkOutDate.getTime() - checkInDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;
    try {
      await cancelReservation({
        id: reservation._id,
        confirmationCode: reservation.confirmationCode,
        email:
          reservation.guestEmail ||
          (typeof reservation.userId === "object"
            ? reservation.userId?.email
            : ""),
      }).unwrap();
      toast.success("Reservation cancelled successfully");
      navigate("/");
    } catch (err) {
      toast.error("Failed to cancel reservation");
    }
  };

  return (
    <main className={styles.mainPage}>
      <div className="inner-grid">
        <header className={styles.titleHeader}>
          <h1>Thank you, {guestDisplay}</h1>
          <p>
            <strong>Reservation Number:</strong> {reservation.confirmationCode}
          </p>
        </header>

        <div className={styles.topInfoGrid}>
          <div className={styles.outlineBox}>
            <span className={styles.iconLabel}>⚲ Destination</span>
            <p>{reservation.hotelId?.location || "No location found"}</p>
          </div>
          <div className={styles.outlineBox}>
            <span className={styles.iconLabel}>🗒 Check In/Check out</span>
            <p>
              {checkInDate.toLocaleDateString()} &rarr;{" "}
              {checkOutDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className={styles.mainContentGrid}>
          <section className={styles.roomSection}>
            <div className={styles.roomHeader}>Room</div>
            <div className={styles.roomBody}>
              <h3>{reservation.hotelId?.name || "Fairmont Resort"}</h3>
              <ul className={styles.detailsList}>
                <li>
                  <span>Adults</span> <strong>{reservation.adults || 1}</strong>
                </li>
                <li>
                  <span>Children</span>{" "}
                  <strong>{reservation.children || 0}</strong>
                </li>
                <li>
                  <span>Bed Preference</span>{" "}
                  <strong>{reservation.bedPreference || "Standard"}</strong>
                </li>
                <li>
                  <span>Special Requests</span>{" "}
                  <strong>{reservation.specialRequests ? "+" : "None"}</strong>
                </li>
              </ul>
              {/* Optional: Show the actual request if it exists */}
              {reservation.specialRequests && (
                <p className={styles.requestDetail}>
                  {reservation.specialRequests}
                </p>
              )}
            </div>
          </section>

          <section className={styles.priceSection}>
            <h2>Price Details</h2>
            <div className={styles.priceSummaryBox}>
              <div className={styles.priceItem}>
                <strong>Room:</strong>
                <span>{reservation.roomId?.type || "Standard Room"}</span>
              </div>
              <div className={styles.priceItem}>
                <strong>Price:</strong>
                <span>${reservation.roomPrice || reservation.totalAmount}</span>
              </div>
              <div className={styles.priceDetailsText}>
                <p>
                  {nights} {nights === 1 ? "Night" : "Nights"} stay
                </p>
                {/* Fixed NaN issue: added || 0 to tax and fees */}
                <p>
                  Taxes and fees: $
                  {(reservation.tax || 0) + (reservation.fees || 0)}
                </p>
              </div>
            </div>

            <div className={styles.finalTotalTable}>
              <div>
                Room Price:{" "}
                <span>${reservation.roomPrice || reservation.totalAmount}</span>
              </div>
              <div>
                Tax: <span>${reservation.tax || 0}</span>
              </div>
              <div>
                Fees: <span>${reservation.fees || 0}</span>
              </div>
              <hr />
              <div className={styles.grandTotal}>
                Total: <span>${reservation.totalAmount}</span>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.footerdivActions}>
          <Link to="/checkreservation" className={styles.backLink}>
            <span>&larr;</span> Back
          </Link>
          <button
            onClick={handleCancel}
            className="btn-cancel btn-medium"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Cancel Reservation"}
          </button>
        </div>
      </div>
    </main>
  );
}
