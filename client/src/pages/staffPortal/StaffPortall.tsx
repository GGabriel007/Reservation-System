import { useNavigate } from "react-router-dom";
import styles from "./staffStyles.module.css";

export default function StaffPortal() {
  const navigate = useNavigate();

  // This data would come from your AuthContext or Redux store after login
  const user = {
    name: "Alex Rivera",
    role: "admin", // or 'manager'
    assignedHotelId: "6961bedfd52cfab927969b83",
    assignedHotelName: "Lioré Paris"
  };

  return (
    <main className={styles.staffLoginPage}>
      <div className={styles.loginContainer} style={{ maxWidth: '600px' }}>
        <header className={styles.branding}>
          <h1>Lioré <span className={styles.goldText}>Portal</span></h1>
          <p>Welcome back, {user.name}</p>
        </header>

        <div className={styles.portalGrid}>
          {/* OPTION 1: Management (Available to both) */}
          <section className={styles.portalCard}>
            <h3>Property Operations</h3>
            <p>Manage rooms, pricing, and live occupancy for specific locations.</p>
            
            {user.role === 'admin' ? (
              <div className={styles.adminSelector}>
                <select className={styles.hotelDropdown}>
                  <option>Select a Hotel to Manage...</option>
                  <option value="1">Lioré Paris</option>
                  <option value="2">Lioré New York</option>
                </select>
                <button className={styles.loginBtn} onClick={() => navigate("/manager-dashboard")}>
                  Open Manager View
                </button>
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={() => navigate("/manager-dashboard")}>
                Manage {user.assignedHotelName}
              </button>
            )}
          </section>

          {/* OPTION 2: Global Admin (Only for Admin) */}
          {user.role === 'admin' && (
            <section className={`${styles.portalCard} ${styles.adminCard}`}>
              <h3>Executive Oversight</h3>
              <p>View global revenue, transaction history, and manage staff roles.</p>
              <button className={styles.secondaryBtn} onClick={() => navigate("/admin-global")}>
                Open Global Dashboard
              </button>
            </section>
          )}
        </div>

        <footer className={styles.footer}>
          <button onClick={() => navigate("/staff/login")} className={styles.guestLink}>
            Secure Sign Out
          </button>
        </footer>
      </div>
    </main>
  );
}