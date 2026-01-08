import styles from "./styles.module.css";
/**
 * Plain Text Page Component
 * use for any plain text pages like thank you page
 */
export default function PlainText() {
  return (
    <main className={styles.mainPage}>
      <div className="inner-grid">
        <div className="layout-grid"></div>
      </div>
    </main>
  );
}
