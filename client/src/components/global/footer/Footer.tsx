import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";

export default function Footer() {
  return (
    <footer>
      <div className="inner-grid">
        <section className="layout-grid">
          <div className={styles.span1}>
            <h2>CONTACT</h2>
            <address>345 Skillstorm St. Outerspace</address>
            <p>+1 111-720-2500</p>
          </div>
          <div className={styles.span2}>
            <h2>INFORMATION</h2>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/careers">Careers</NavLink>
            <NavLink to="/adminPanel">Partners Login</NavLink>
          </div>
          <div className={styles.span3}>
            <h2>Stay In Touch</h2>
            <p>Be the first to know by subscribing to our newsletter</p>
            <form>
              <input type="email" placeholder="E-Mail Address" />
              <button className="btn-secondary">Sign Up</button>
            </form>
          </div>
        </section>

        <p className={styles.copyright}>© 2025 Lioré All Rights Reserved</p>
      </div>
    </footer>
  );
}
