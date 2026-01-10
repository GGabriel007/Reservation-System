import { useEffect, useState } from "react";
import { Hero } from "../../components/pages/homePage/index";
import styles from "./styles.module.css";

/**
 * Home Component
 * Serves as the landing page and performs an initial connectivity check
 * with the backend API to ensure the service is reachable.
 */
export default function Home() {
  const [serverStatus, setServerStatus] = useState<string>(
    "Checking connection..."
  );
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Environment-based API selection
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  /**
   * Backend Health Check
   * Pings the specific health endpoint of the API
   */
  useEffect(() => {
    // Change 'baseUrl' to '`${baseUrl}/api/health`'
    fetch(`${baseUrl}/api/health`, {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((data) => {
        setServerStatus(data); // This will now show "Online and Connected!"
        setIsConnected(true);
      })
      .catch((error) => {
        console.error("Connectivity check failed:", error);
        setServerStatus("Server is currently unreachable.");
        setIsConnected(false);
      });
    console.log(serverStatus);
    console.log(isConnected);
  }, [baseUrl]);

  return (
    <main className={styles.mainPage}>
      <Hero></Hero>
      <section className={styles["bg-beige"]}>
        <div className={styles["inner-grid"]}>
          <h2>Your new home with Lioré </h2>
          <p>
            Welcome to Lioré. We deliver the best hotel in town. ranging from
            the suit to the garden house suit and local loves it.
          </p>
        </div>
      </section>
      <section className={styles["stay-with-us"]} id="stay-with-us">
        <div className={styles["inner-grid"]}>
          <div className="layout-grid">
            <div className={styles["col-left"]}>
              <h2>Stay with us</h2>
              <p>
                Whether you're here for work or play, our fabulous suites and
                rooms provide the perfect backdrop for an unforgettable stay
              </p>
              <button className="btn-secondary">Book a Room</button>
            </div>
            <img
              src="homepage-stay-with-us.jpg"
              alt=""
              className={styles["col-right"]}
            />
          </div>
        </div>
      </section>
      <section className={styles["bg-beige"]}>
        <div className={styles["inner-grid"]}>
          <h2 className={styles.quote}>
            “Where there is history, there are always stories.”
          </h2>
        </div>
      </section>
      <section className={styles["dine"]} id="dine">
        <div className={styles["inner-grid"]}>
          <div className="layout-grid">
            <div className={styles["col-left"]}>
              <h2>Delicious Dining</h2>
              <p>
                Embark on an exquisite culinary adventure where refined flavors,
                artful presentation, and inspired craftsmanship come together to
                create an unforgettable dining experience.
              </p>
              <button className="btn-secondary">Discover</button>
              <img src="/dine1.jpg" alt="" />
            </div>
            <div className={styles["col-right"]}>
              <img src="/dine2.jpg" alt="" />
              <h2>From the Source</h2>
              <p>
                More than a restaurant: it is the beating heart of our hotel and
                the city that surrounds it. A place to share happy memories and
                delicious delights. 
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
