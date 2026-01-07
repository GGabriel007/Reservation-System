import styles from "./styles.module.css";

export default function OrderBar() {
  return (
    <>
      <button className={styles.button}>Click me</button>
      <button className={`${styles.button} ${styles.active}`}>Active</button>
    </>
  );
}
