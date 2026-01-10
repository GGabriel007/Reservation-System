import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.css";
/**
 * Checkout Page Component
 *
 */
interface RoomDetails {
  _id: string;
  roomName: string;
  roomType: string;
  basePrice: number;
  hotel: {
    name: string;
    address: {
      city: string;
      state: string;
    };
  };
}

export default function Checkout() {
  const { roomId } = useParams(); // Assumes route is /checkout/:roomId
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [reservationResult, setReservationResult] = useState<any>(null);

  // Fetch Room Info to display what they are booking
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:8080/rooms/${roomId}`);
        const data = await response.json();
        setRoom(data);
      } catch (err) {
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };
    if (roomId) fetchRoom();
  }, [roomId]);

  // Function to actually create the booking
  const handleConfirmBooking = async () => {
    try {
      const response = await fetch("http://localhost:8080/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: roomId,
          checkIn: "2026-06-01",  // Hardcoded for testing display
          checkOut: "2036-06-25", // Hardcoded for testing display
        }),
        credentials: "include", // Sends your 'sid' session cookie
      });

      const result = await response.json();
      setReservationResult(result);
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  if (loading) return <div className={styles.status}>Loading Room Details...</div>;

  return (
    <main className={styles.mainPage}>
      <div className={styles.checkoutContainer}>
        <h1>Confirm Your Stay</h1>
        
        {room && (
          <section className={styles.summaryCard}>
            <h2>{room.hotel.name}</h2>
            <p className={styles.roomName}>{room.roomName} ({room.roomType})</p>
            <p> {room.hotel.address.city}, {room.hotel.address.state}</p>
            <hr />
            <div className={styles.priceRow}>
              <span>Price per night:</span>
              <strong>${room.basePrice}</strong>
            </div>
            <button className={styles.confirmBtn} onClick={handleConfirmBooking}>
              Confirm & Pay
            </button>
          </section>
        )}

        {/* 3. Display the result from the backend after clicking confirm */}
        {reservationResult && (
          <div className={styles.resultBox}>
            <h3>Backend Response:</h3>
            <pre>{JSON.stringify(reservationResult, null, 2)}</pre>
            {reservationResult._id && (
              <p className={styles.success}> Booking Successful! ID: {reservationResult._id}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
