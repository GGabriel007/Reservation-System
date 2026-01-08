import styles from "./styles.module.css";
/**
 * Room Listing Page Component
 * Serves as the page for user to browse all room listings
 * need to also take care of room availability
 */
export default function RoomListing() {
  return (
    <main className={styles.mainPage}>
      <div className="inner-grid">
        <div className="layout-grid"></div>
      </div>
    </main>
  );
}
