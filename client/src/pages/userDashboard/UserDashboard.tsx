import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

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
  lastName?: string;
  phoneNumber?: string;
}

interface Reservation {
  _id: string;
  confirmationCode: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: string;
  roomId?: {
    roomName: string;
    roomType: string;
    images?: string[];
  };
  hotelId?: {
    name: string;
    address: string;
  };
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Environment-based API selection
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  /**
   * Data Fetching: Session & Reservations
   */
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // 1. Verify Session
        const sessionRes = await fetch(`${baseUrl}/auth/need`, {
          credentials: "include",
        });

        if (sessionRes.status === 401) {
          if (isMounted) navigate("/login");
          return;
        }

        const userData = await sessionRes.json();
        if (isMounted) setUser(userData);

        // 2. Fetch User Reservations
        const resRes = await fetch(`${baseUrl}/reservations/my-bookings`, {
          credentials: "include",
        });

        if (resRes.ok) {
          const resData = await resRes.json();
          if (isMounted) setReservations(resData);
        }
      } catch (err) {
        console.error("Dashboard data load failed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [navigate, baseUrl]);

  // Prevent flashing of dashboard content before authentication check completes
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <main className={styles.userDashboard}>
      <section className="inner-grid">
        <div className={styles.flex}>
          <h2>Welcome back to Lioré, {user?.firstName}</h2>
        </div>

        {/* User Profile Information Section */}
        <section className={styles.profileSection}>
          <h2>Profile Information</h2>
          <div className={styles.profileGrid}>
            <div className={styles.profileItem}>
              <h4>Email:</h4>
              <p>{user?.email || "Not provided"}</p>
            </div>
            <div className={styles.profileItem}>
              <h4>First Name:</h4>
              <p>{user?.firstName || "Not provided"}</p>
            </div>
            <div className={styles.profileItem}>
              <h4>Last Name:</h4>
              <p>{user?.lastName || "Not provided"}</p>
            </div>
            <div className={styles.profileItem}>
              <h4>Phone Number:</h4>
              <p>{user?.phoneNumber || "Not provided"}</p>
            </div>
          </div>
        </section>

        <section className={styles.current}>
          <h2>Your Reservations</h2>
          {reservations.length === 0 ? (
            <div style={{ padding: '2em', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', marginTop: '1em' }}>
              <p className="text-gray-500">You have no active reservations at this time.</p>
            </div>
          ) : (
            reservations.map((res) => (
              <section key={res._id} className={styles.currentDisplay} style={{ marginBottom: '2em' }}>
                <img
                  src={
                    res.roomId?.images && res.roomId.images.length > 0
                      ? `${baseUrl}/uploads/${res.roomId.images[0]}`
                      : "/placeholder.png"
                  }
                  alt={res.roomId?.roomName || "Room"}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
                <div className={styles.userData}>
                  <h3>{res.hotelId?.name || "Lioré Resort"} - {res.roomId?.roomName || "Standard Room"}</h3>
                  <div className={styles.userDataDetail}>
                    <div>
                      <h4>reservation number:</h4>
                      <p>{res.confirmationCode}</p>
                    </div>
                    <div>
                      <h4>check in:</h4>
                      <p>{formatDate(res.checkIn)}</p>
                    </div>
                    <div>
                      <h4>check out:</h4>
                      <p>{formatDate(res.checkOut)}</p>
                    </div>
                  </div>
                  <div className={styles.userPreference}>
                    <h4>Status: </h4>
                    <p style={{ textTransform: 'capitalize' }}>{res.status}</p>
                    <h4 style={{ marginTop: '10px' }}>Total Amount: </h4>
                    <p>${res.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </section>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
