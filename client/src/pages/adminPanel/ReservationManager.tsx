import { useEffect, useState } from "react";
import styles from "./styles.module.css";

// 1. UPDATE INTERFACE to match your DB Schema fields
interface Reservation {
  _id: string;
  confirmationCode: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;

  // CHANGED: 'user' -> 'userId'
  userId?: {
    firstName: string;
    lastName: string;
    email: string;
  };

  // CHANGED: 'room' -> 'roomId'
  roomId: {
    roomName: string;
    roomType: string;
  };

  // Guest fallbacks
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
}

const ReservationManager = ({ hotelId }: { hotelId: string }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const baseUrl = import.meta.env.PROD
    ? "http://liore.us-east-1.elasticbeanstalk.com"
    : "http://localhost:8080";

  useEffect(() => {
    if (!hotelId) return;

    const fetchReservations = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/reservations/${hotelId}`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setReservations(data);
        }
      } catch (err) {
        console.error("Failed to fetch reservations", err);
      }
    };

    fetchReservations();
  }, [hotelId, baseUrl]);

  const filteredReservations = reservations.filter((res) => {
    // 2. UPDATE ACCESSORS: Use .userId instead of .user
    const firstName = res.guestFirstName || res.userId?.firstName || "";
    const lastName = res.guestLastName || res.userId?.lastName || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();

    // 3. UPDATE ACCESSOR: Use .roomId instead of .room
    const roomName = res.roomId?.roomName || "";

    const matchesSearch =
      res.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase()) ||
      roomName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || res.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": return styles.available;
      case "pending": return styles.pending;
      case "checked-in": return styles.available;
      case "cancelled": return styles.occupied;
      case "failed": return styles.occupied;
      default: return styles.maintenance;
    }
  };

  return (
    <div className={`${styles.adminSection} mt-6`}>
      <div className={styles.headerArea}>
        <h2 className="text-xl font-bold text-gray-800">Reservation Search</h2>
      </div>

      <div className={styles.formRow} style={{ marginBottom: "20px", gridTemplateColumns: "2fr 1fr" }}>
        <input
          type="text"
          placeholder="Search by Guest Name, Room, or Ref Code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Ref #</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => {
              // 4. UPDATE ACCESSORS in the Render Loop
              const firstName = res.guestFirstName || res.userId?.firstName || "Unknown";
              const lastName = res.guestLastName || res.userId?.lastName || "";
              const email = res.userId?.email || res.guestEmail || "";
              const roomName = res.roomId?.roomName || "N/A";

              return (
                <tr key={res._id}>
                  <td className="font-mono text-gray-600 font-bold">
                    {res.confirmationCode}
                  </td>
                  <td>
                    <div className="font-medium text-gray-900">{firstName} {lastName}</div>
                    <div className="text-xs text-gray-500">{email}</div>
                  </td>
                  <td>{roomName}</td>
                  <td>{new Date(res.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(res.checkOut).toLocaleDateString()}</td>
                  {/* Convert cents to dollars if needed, assuming totalAmount is in cents or direct dollars */}
                  <td>${res.totalAmount}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(res.status)}`}>
                      {res.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}

            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "#888" }}>
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationManager;