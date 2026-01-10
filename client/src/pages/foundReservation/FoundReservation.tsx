import { useLocation, Link } from "react-router-dom";
import styles from "./styles.module.css";
/**
 * Found Reservation Page Component
 * what the users see when they entered their reservation
 */
export default function FoundReservation() {
  const location = useLocation();
  
  // We extract the 'reservation' object from the navigation state
  const { reservation } = location.state || {};

  // Handle case where user navigates here directly or refreshes the page
  if (!reservation) {
    return (
      <main className={styles.mainPage}>
        <div className="inner-grid">
          <div className={styles.errorContainer}>
            <h2>No Reservation Data Found</h2>
            <p>Please return to the lookup page and try again.</p>
            <Link to="/check-reservation" className={styles.backLink}>Go Back</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainPage}>
      <div className="inner-grid">
        <div className={styles.header}>
          <h1>Your Stay at Lioré</h1>
          <p>We are looking forward to hosting you.</p>
        </div>

        <div className="layout-grid">
          <section className={styles.detailsCard}>
            <div className={styles.statusBadge} data-status={reservation.status}>
              {reservation.status.toUpperCase()}
            </div>

            <div className={styles.infoRow}>
              <span>Confirmation Number:</span>
              <strong>{reservation.confirmationCode}</strong>
            </div>

            <hr />

            <div className={styles.dateGrid}>
              <div>
                <p className={styles.label}>Check-In</p>
                <p className={styles.value}>{new Date(reservation.checkIn).toLocaleDateString()}</p>
              </div>
              <div>
                <p className={styles.label}>Check-Out</p>
                <p className={styles.value}>{new Date(reservation.checkOut).toLocaleDateString()}</p>
              </div>
            </div>

            <div className={styles.infoRow}>
              <span>Guest:</span>
              <strong>{reservation.userId?.firstName} {reservation.userId?.lastName}</strong>
            </div>

            <div className={styles.infoRow}>
              <span>Total Paid:</span>
              <strong className={styles.price}>${reservation.totalAmount}</strong>
            </div>
            
            <div className={styles.actions}>
               <Link to="/" className={styles.homeBtn}>Return Home</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
