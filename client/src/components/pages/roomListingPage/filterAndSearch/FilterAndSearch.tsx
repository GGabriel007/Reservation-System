import styles from "./styles.module.css";

export default function FilterAndSearch() {
  return (
    <section className={styles.roomListingFilter}>
      <div>
        <label>Sort By: </label>
        <select>
          <option value="">Alphabetical ASC</option>
          <option value="">Alphabetical DESC</option>
        </select>
      </div>
      <div>
        <label>Filters: </label>
        <select>
          <option value="">Alphabetical ASC</option>
          <option value="">Alphabetical DESC</option>
        </select>
      </div>
      <div>
        <label>
          Search
          <input type="text" />
        </label>
      </div>
    </section>
  );
}
