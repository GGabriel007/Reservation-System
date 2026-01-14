import styles from "./styles.module.css";
import { Link } from "react-router-dom";
/**
 * Plain Text Page Component
 * use for any plain text pages like thank you page
 */
export default function ThankYou() {
  return (
    <main className={styles.mainPage}>
      <div className={styles["inner-grid"]}>
        <h1>Thank You for Booking With Us</h1>
        <Link to="/roomlisting">Return to Room Listings</Link>
      </div>
    </main>
  );
}
