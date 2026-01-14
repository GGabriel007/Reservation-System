import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ActionStatusModal from "@/components/global/toast/actionsStatusModal/ActionStatusModal";
import ConfirmDeleteToast from "@/components/global/toast/confirmationDeleteToast/ConfirmationDeleteToast";

// Interface for Hotel Data
interface Hotel {
  _id: string;
  name: string;
}

interface Reservation {
  _id: string;
  confirmationCode: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: "confirmed" | "cancelled" | "checked_in" | "completed" | "pending";
  
  // Handle populated Hotel data
  hotelId: {
    name: string;
    _id: string;
  } | string; 

  userId?: {
    firstName: string;
    lastName: string;
    email: string;
  };

  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
}

export default function ReservationManager() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]); // 1. Store list of hotels
  const [loading, setLoading] = useState(true);
  
  // 2. State for the selected Hotel Tab ("all" or specific ID)
  const [selectedHotelId, setSelectedHotelId] = useState<string>("all");

  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "cancelled" | "pending">("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: "",
    type: 'success' as 'success' | 'error'
  });

  const baseUrl = import.meta.env.PROD 
    ? "http://liore.us-east-1.elasticbeanstalk.com" 
    : "http://localhost:8080";

  // 3. Fetch Hotels for the tabs
  const fetchHotels = async () => {
    try {
      const res = await fetch(`${baseUrl}/hotels`);
      if (res.ok) {
        const data = await res.json();
        setHotels(data);
      }
    } catch (error) {
      console.error("Error fetching hotels", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${baseUrl}/reservations/all`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (error) {
      console.error("Error fetching reservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels(); // Load hotels
    fetchReservations(); // Load reservations
  }, []);

  const initiateCancel = (id: string) => {
    setReservationToCancel(id);
  };

  const executeCancel = async () => {
    if (!reservationToCancel) return;

    const targetReservation = reservations.find(r => r._id === reservationToCancel);
    
    if (!targetReservation) {
      setModalConfig({ isOpen: true, message: "Error: Reservation data missing.", type: 'error' });
      return;
    }

    const targetEmail = targetReservation.guestEmail || 
      (typeof targetReservation.userId === 'object' ? targetReservation.userId?.email : "") || 
      "";

    try {
      const res = await fetch(`${baseUrl}/reservations/${reservationToCancel}/cancel`, {
        method: "PATCH", 
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          confirmationCode: targetReservation.confirmationCode,
          email: targetEmail
        })
      });

      if (res.ok) {
        setReservations(prev => prev.map(r => 
          r._id === reservationToCancel ? { ...r, status: "cancelled" } : r
        ));
        setModalConfig({ isOpen: true, message: "Reservation cancelled.", type: 'success' });
      } else {
        const errData = await res.json(); 
        throw new Error(errData.message || "Failed");
      }
    } catch (error: any) {
      console.error("Cancel Error:", error);
      setModalConfig({ isOpen: true, message: error.message || "Could not cancel.", type: 'error' });
    } finally {
      setReservationToCancel(null);
    }
  };

  // 4. Updated Filtering Logic: Includes Hotel Selection
  const filteredReservations = reservations.filter(res => {
    // A. Filter by Hotel Tab
    let matchesHotel = true;
    if (selectedHotelId !== "all") {
      // Safely check ID whether populated object or string
      const resHotelId = typeof res.hotelId === 'object' && res.hotelId !== null 
        ? res.hotelId._id 
        : res.hotelId;
      
      matchesHotel = resHotelId === selectedHotelId;
    }

    // B. Filter by Status Tab
    const matchesStatus = filterStatus === "all" || res.status === filterStatus;

    // C. Filter by Search Term
    const firstName = res.userId?.firstName || res.guestFirstName || "";
    const lastName = res.userId?.lastName || res.guestLastName || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    
    const hotelName = typeof res.hotelId === 'object' && res.hotelId !== null 
      ? res.hotelId.name 
      : "Unknown Property";

    const matchesSearch = 
      res.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase()) ||
      hotelName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesHotel && matchesStatus && matchesSearch;
  });

  if (loading) return <div className={styles.loading}>Loading Global Reservations...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Global Reservations</h2>
          <p className={styles.subtitle}>Monitor and manage bookings across all properties.</p>
        </div>
        <div className={styles.stats}>
          {reservations.length} Total Bookings
        </div>
      </div>

      <div className={styles.controls}>
  
  {/* ROW 1: Hotel Navigation Tabs (The "Sub-header") */}
  <div className={styles.hotelTabsContainer}>
    <button 
      className={`${styles.hotelTab} ${selectedHotelId === "all" ? styles.activeHotelTab : ""}`}
      onClick={() => setSelectedHotelId("all")}
    >
      All Properties
    </button>
    
    {hotels.map(hotel => (
      <button
        key={hotel._id}
        className={`${styles.hotelTab} ${selectedHotelId === hotel._id ? styles.activeHotelTab : ""}`}
        onClick={() => setSelectedHotelId(hotel._id)}
      >
        {hotel.name}
      </button>
    ))}
  </div>

  {/* ROW 2: Status Filters & Search */}
  <div className={styles.filterRow}>
    <div className={styles.filterTabs}>
      {['all', 'confirmed', 'pending', 'cancelled'].map(status => (
        <button
          key={status}
          className={`${styles.filterBtn} ${filterStatus === status ? styles.activeFilter : ''}`}
          onClick={() => setFilterStatus(status as any)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
    
    <input 
      type="text" 
      placeholder="Search ID, Guest, or Hotel..." 
      className={styles.searchBar}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

</div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Hotel</th>
              <th>Guest</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr><td colSpan={7} className={styles.emptyState}>No reservations found.</td></tr>
            ) : (
              filteredReservations.map((res) => {
                const firstName = res.userId?.firstName || res.guestFirstName || "Unknown";
                const lastName = res.userId?.lastName || res.guestLastName || "";
                const hotelName = typeof res.hotelId === 'object' ? res.hotelId?.name : "Unknown Property";

                return (
                  <tr key={res._id} className={res.status === 'cancelled' ? styles.dimmedRow : ''}>
                    <td className={styles.mono}>{res.confirmationCode || "N/A"}</td>
                    <td>{hotelName}</td>
                    <td>{firstName} {lastName}</td>
                    <td>
                      {res.checkIn ? new Date(res.checkIn).toLocaleDateString() : "TBD"} 
                      {' - '} 
                      {res.checkOut ? new Date(res.checkOut).toLocaleDateString() : "TBD"}
                    </td>
                    <td>
                      ${(res.totalAmount || 0).toLocaleString()}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[res.status]}`}>
                        {res.status}
                      </span>
                    </td>
                    <td>
                      {(res.status === 'confirmed' || res.status === 'pending') && (
                        <button 
                          onClick={() => initiateCancel(res._id)}
                          className={styles.cancelBtn}
                          title="Cancel Reservation"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteToast 
        isOpen={!!reservationToCancel}
        onClose={() => setReservationToCancel(null)}
        onConfirm={executeCancel}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation? This action cannot be undone."
      />

      <ActionStatusModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
}