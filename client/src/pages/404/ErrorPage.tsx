// src/pages/ErrorPage.jsx
import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./style.module.css";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error); // Optional: log the error for debugging

  return (
    <div className={styles["inner-grid"]}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {/* You can customize this message based on the error status */}
      <Link to="/">Go back to the home page</Link>
    </div>
  );
}
