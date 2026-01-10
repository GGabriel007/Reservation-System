import styles from "./styles.module.css";
/**
 * User Profile Page Component
 * use to display the user profile page
 */
export default function UserProfile() {
  return (
    <main className={styles.userProfile}>
      <div className="inner-grid">
        <div className="layout-grid">
          <h2>Welcome back to Lioré, Jessica</h2>
        </div>
      </div>
    </main>
  );
}
