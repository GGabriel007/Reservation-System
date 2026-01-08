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
  }, [baseUrl]);

  return (
    <main className={styles.mainPage}>
      <div className="inner-grid">
        <Hero></Hero>
        <h1>Home Page</h1>

        {/* Backend Status Badge (Helpful for Developers & Users) */}
        <div>
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected === true
                ? "bg-green-500 animate-pulse"
                : isConnected === false
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          ></span>
          <span>
            The backend says :D <span>{serverStatus}</span>
          </span>
        </div>
      </div>
    </main>
  );
}
