import { useEffect } from "react";
import styles from "./styles.module.css";
import { OrderBar } from "../index";

export default function Hero() {
  useEffect(() => {
    setTimeout(function () {
      const element = document.querySelector(
        "[class*=hero]"
      ) as HTMLInputElement;
      element.style.setProperty("--hero-opacity", "0.3");
    }, 500);

    setTimeout(function () {
      (
        document.querySelector(
          "[class*='hero'] [class*='inner-grid'] img"
        ) as HTMLInputElement
      ).style.opacity = "1.0";
    }, 1000);
  }, []);

  return (
    <section className={styles.hero}>
      <img src="/hero.jpg" alt="" />
      <div className={styles["inner-grid"]}>
        <img src="/liore-transparent-full.svg" alt=""></img>
      </div>
      <OrderBar></OrderBar>
    </section>
  );
}
