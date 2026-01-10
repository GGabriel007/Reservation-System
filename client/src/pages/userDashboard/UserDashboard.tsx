import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Visit } from "../../components/pages/userDashboardPage/index";

/**
 * User Interface
 * Matches the structure of the User document returned by the backend.
 * We use _id to align with MongoDB's unique identifier.
 */
interface User {
  _id: string;
  email: string;
  role?: string;
  firstName?: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Environment-based API selection
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  /**
   * Identity Check
   * Runs on component mount to verify if the user has an active session.
   * If the backend returns 401 (Unauthorized), the user is kicked to the login page.
   */
  useEffect(() => {
    let isMounted = true; // Guard to prevent state updates if component unmounts

    const checkSession = async () => {
      try {
        const res = await fetch(`${baseUrl}/auth/need`, {
          credentials: "include",
        });

        if (res.status === 401) {
          if (isMounted) navigate("/login");
          return;
        }

        const data = await res.json();
        if (isMounted) {
          setUser(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) navigate("/login");
      }
    };

    checkSession();
    return () => {
      isMounted = false;
    };
  }, [navigate, baseUrl]);

  /**
   * Session Termination
   * Communicates with the backend to destroy the session and clear local user state.
   */
  const handleLogout = async () => {
    try {
      // FIX: Removed the starting slash from "/auth/logout" to prevent "//"
      await fetch(`${baseUrl}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Prevent flashing of dashboard content before authentication check completes
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 animate-pulse">Verifying session...</p>
      </div>
    );
  }

  const userData = {
    reservationNumber: [123, 144],
    roomList: ["one", "two"],
  };

  const roomData = {
    roomName: "Fairmont Resort",
    reservationNumber: "A1002933843",
    checkIn: "12/18/2025",
    checkOut: "12/19/2025",
    room: 1,
    adults: 1,
    children: 2,
    beds: 1,
    specialRequest: "",
  };

  return (
    <main className={styles.userDashboard}>
      <section className="inner-grid">
        <div className={styles.flex}>
          <h2>Welcome back to Lioré, {user?.firstName}</h2>
          <button className="btn-secondary btn-medium">Vew Profile</button>
        </div>
        <section className={styles.current}>
          <h2>Current Visit</h2>
          <section className={styles.currentDisplay}>
            <img src="/burmont-suit.jpg" alt="" />
            <div className={styles.userData}>
              <h3>{roomData.roomName}</h3>
              <div className={styles.userDataDetail}>
                <div>
                  <h4>reservation number:</h4>
                  <p>{roomData.reservationNumber}</p>
                </div>
                <div>
                  <h4>check in:</h4>
                  <p>{roomData.checkIn}</p>
                </div>
                <div>
                  <h4>check out:</h4>
                  <p>{roomData.checkOut}</p>
                </div>
              </div>
              <div className={styles.userPreference}>
                <h4>Preference: </h4>
                <p>{roomData.room} room</p>
                <p>
                  {roomData.adults} adult, {roomData.children} Children
                </p>
                <p>{roomData.beds} beds</p>
                {roomData.specialRequest && <p>{roomData.specialRequest}</p>}
              </div>
            </div>
          </section>
        </section>
        <Visit timeline="past" userData={userData}></Visit>
        <Visit timeline="future" userData={userData}></Visit>
      </section>
    </main>
  );
}
