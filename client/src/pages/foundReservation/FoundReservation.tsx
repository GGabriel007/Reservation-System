import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useCancelReservationMutation } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";
// Import your custom notification component
import ConfirmDeleteToast from "@/components/global/toast/confirmationDeleteToast/ConfirmationDeleteToast";

export default function FoundReservation() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. State for the custom confirmation modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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
    reservation.guestFirstName || reservation.guestLastName
      ? `${reservation.guestFirstName || ""} ${
          reservation.guestLastName || ""
        }`.trim()
      : reservation.userId && typeof reservation.userId === "object"
      ? `${reservation.userId.firstName} ${reservation.userId.lastName}`
      : "Guest";

  const checkInDate = new Date(reservation.checkIn);
  const checkOutDate = new Date(reservation.checkOut);
  const nights = Math.max(
    1,
    Math.ceil(
      Math.abs(checkOutDate.getTime() - checkInDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  // 2. Step 1: Just open the modal
  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  // 3. Step 2: The actual logic (runs only when confirmed in modal)
  const executeCancel = async () => {
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

      const last4 = reservation.paymentInfo?.lastFour || "xxxx";
      toast.success(
        `Reservation cancelled. A refund will be complete in 3 business days to the card ending in ${last4}.`,
        {
          duration: 5000,
        }
      );
      setIsCancelModalOpen(false); // Close modal
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel reservation");
      setIsCancelModalOpen(false); // Close modal on error too
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
            <p>
              {reservation.hotelId?.name || "Hotel Name"} <br />
              <span style={{ fontSize: "0.9em", color: "#666" }}>
                {reservation.hotelId?.address
                  ? `${reservation.hotelId.address.city}, ${reservation.hotelId.address.country}`
                  : reservation.hotelId?.location || "No location found"}
              </span>
            </p>
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
              <h3>{reservation.roomId?.roomName || "Luxury Room"}</h3>
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
                <span>{reservation.roomId?.roomType || "Standard Room"}</span>
              </div>
              <div className={styles.priceItem}>
                <strong>Price:</strong>
                <span>
                  ${reservation.roomPrice || reservation.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className={styles.priceDetailsText}>
                <p>
                  {nights} {nights === 1 ? "Night" : "Nights"} stay
                </p>
                <p>
                  Taxes and fees: $
                  {(Number(reservation.tax) || 0) +
                    (Number(reservation.fees) || 0)}
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
          <Link to="/" className={styles.backLink}>
            <span>&larr;</span> Back
          </Link>

          {/* 4. Update Button to trigger Modal */}
          <button
            onClick={handleCancelClick}
            className={styles.cancelBtn}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Cancel Reservation"}
          </button>
        </div>
      </div>

      {/* 5. Render the Modal */}
      <ConfirmDeleteToast
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={executeCancel}
        title="Cancel Reservation?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
      />
    </main>
  );
}
