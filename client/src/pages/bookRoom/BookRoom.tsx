import { useEffect, useState } from "react";
import styles from "./styles.module.css";

// Define the shape of our Hotel data based on your Backend response
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Hotel {
  _id: string;
  name: string;
  description: string;
  address: Address;
  images: string[];
}

export default function BookRoom() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // Change this URL if your backend port is different
        const response = await fetch("http://localhost:8080/hotels", {
          method: "GET",
          // CRITICAL: This allows the session cookie (sid) to be sent/received
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error("Failed to fetch hotels");
        }

        const data = await response.json();
        setHotels(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <div className={styles.statusMsg}>Loading amazing stays...</div>;
  if (error) return <div className={styles.errorMsg}>Error: {error}</div>;

  return (
    <main className={styles.mainPage}>
      <header className={styles.header}>
        <h1>Explore Our Destinations</h1>
        <p>Find the perfect tech-hub retreat for your next stay.</p>
      </header>

      <div className="inner-grid">
        <div className={styles.hotelGrid}>
          {hotels.map((hotel) => (
            <div key={hotel._id} className={styles.hotelCard}>
              <div className={styles.imagePlaceholder}>
                {hotel.images.length > 0 ? (
                  <img src={hotel.images[0]} alt={hotel.name} />
                ) : (
                  <div className={styles.noImage}> No Image Available</div>
                )}
              </div>
              
              <div className={styles.hotelInfo}>
                <h2 className={styles.hotelName}>{hotel.name}</h2>
                <p className={styles.location}>
                  hallo {hotel.address.city}, {hotel.address.state}
                </p>
                <p className={styles.description}>{hotel.description}</p>
                
                <button className={styles.viewRoomsBtn}>
                  View Available Rooms
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}