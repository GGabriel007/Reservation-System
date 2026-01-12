import { useState, useEffect } from "react";
import styles from "./styles.module.css";

interface User {
  _id: string;
  email: string;
  role: string;
  loginMethod: string;
}

interface Hotel {
  _id: string;
  name: string;
}

export default function AdminPanel() {

  const handleDeleteUser = async (userId: string, userEmail: string) => {
  // Security check: Don't let the admin accidentally delete themselves!
  // (Assuming you have access to the current logged-in user's email)
  
  const confirmDelete = window.confirm(`Are you sure you want to permanently delete ${userEmail}?`);
  
  if (confirmDelete) {
    try {
      const response = await fetch(`${baseUrl}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Remove the user from local state so they "vanish" from the table
        setUsers(users.filter(user => user._id !== userId));
        alert("User removed from system.");
      } else {
        alert("Failed to delete user. They may have active reservations.");
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  }
};

  // --- STATE: Existing User Management ---
  const [users, setUsers] = useState<User[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]); // To populate the room-to-hotel dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- STATE: Promotion Tool ---
  const [promoEmail, setPromoEmail] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  // --- STATE: Hotel Creation ---
  const [hotelData, setHotelData] = useState({
    name: "",
    description: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // --- STATE: Room Creation ---
  const [roomData, setRoomData] = useState({
    roomName: "",
    roomType: "single",
    basePrice: 0,
    maxOccupancy: 2,
    hotel: "", // Selected Hotel ID
  });

  const baseUrl = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users
        const userRes = await fetch(`${baseUrl}/admin/users`, {
          method: "GET",
          credentials: "include",
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUsers(Array.isArray(userData) ? userData : userData.users);
        } else {
          setError("Unauthorized: You do not have Admin permissions yet.");
        }

        // Fetch existing hotels to link rooms to them
        const hotelRes = await fetch(`${baseUrl}/hotels`, { method: "GET" });
        if (hotelRes.ok) {
          const hotelData = await hotelRes.json();
          setHotels(hotelData);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  // --- HANDLERS ---

  // 1. Promote Self
  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMessage("Processing...");
    try {
      const response = await fetch(`${baseUrl}/admin/promote-self`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: promoEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setPromoMessage("SUCCESS! Now log out and log back in to refresh your role.");
      } else {
        setPromoMessage(data.message || "Promotion failed.");
      }
    } catch (err) {
      setPromoMessage("Connection error.");
    }
  };

  // 2. Create Hotel
  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/admin/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: hotelData.name,
          description: hotelData.description,
          address: {
            street: hotelData.street,
            city: hotelData.city,
            state: hotelData.state,
            zipCode: hotelData.zipCode,
          },
        }),
      });
      if (response.ok) {
        alert("Hotel Created Successfully!");
        window.location.reload(); // Refresh to see new hotel in dropdowns
      } else {
        alert("Failed to create hotel. Check console.");
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  };

  // 3. Create Room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/admin/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(roomData),
      });
      if (response.ok) alert("Room Created Successfully!");
      else alert("Failed to create room.");
    } catch (err) {
      alert("Error connecting to server.");
    }
  };

  if (loading) return <div className={styles.adminPanelPage}>Loading Admin Suite...</div>;

  return (
    <main className={styles.adminPanelPage}>
      <header className={styles.headerArea}>
        <h1>Lioré Administration</h1>
        <p className={styles.statsText}>Inventory & User Management</p>
      </header>

      {/* SECTION 1: SYSTEM BOOTSTRAP (Promotion) */}
      <section className={styles.adminSection}>
        <div className={styles.sectionHeader}>1. Role Promotion (Bootstrap)</div>
        <form onSubmit={handlePromote} className={styles.adminForm}>
          <input
            type="email"
            placeholder="Account email to promote"
            value={promoEmail}
            onChange={(e) => setPromoEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.promoteBtn}>Make Admin</button>
        </form>
        {promoMessage && <p className={styles.feedbackText}>{promoMessage}</p>}
      </section>

      {error ? (
        <div className={styles.unauthorizedError}>
          <h2>{error}</h2>
          <p>Please use the Promotion tool above, then log out and log back in.</p>
        </div>
      ) : (
        <>
          {/* SECTION 2: HOTEL CREATION */}
          <section className={styles.adminSection}>
            <div className={styles.sectionHeader}>2. Create New Hotel Property</div>
            <form onSubmit={handleCreateHotel} className={styles.adminFormGrid}>
              <input type="text" placeholder="Hotel Name" required
                onChange={(e) => setHotelData({ ...hotelData, name: e.target.value })} />
              <input type="text" placeholder="Street Address" required
                onChange={(e) => setHotelData({ ...hotelData, street: e.target.value })} />
              <input type="text" placeholder="City" required
                onChange={(e) => setHotelData({ ...hotelData, city: e.target.value })} />
              <input type="text" placeholder="State" required
                onChange={(e) => setHotelData({ ...hotelData, state: e.target.value })} />
              <input type="text" placeholder="Zip Code" required
                onChange={(e) => setHotelData({ ...hotelData, zipCode: e.target.value })} />
              <textarea placeholder="Property Description"
                onChange={(e) => setHotelData({ ...hotelData, description: e.target.value })} />
              <button type="submit" className={styles.createBtn}>Create Hotel</button>
            </form>
          </section>

          {/* SECTION 3: ROOM CREATION */}
          <section className={styles.adminSection}>
            <div className={styles.sectionHeader}>3. Add Rooms to Inventory</div>
            <form onSubmit={handleCreateRoom} className={styles.adminFormGrid}>
              <select required onChange={(e) => setRoomData({ ...roomData, hotel: e.target.value })}>
                <option value="">Select a Hotel</option>
                {hotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>
              <input type="text" placeholder="Room Name (e.g. 101)" required
                onChange={(e) => setRoomData({ ...roomData, roomName: e.target.value })} />
              <select onChange={(e) => setRoomData({ ...roomData, roomType: e.target.value })}>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
              <input type="number" placeholder="Price Per Night" required
                onChange={(e) => setRoomData({ ...roomData, basePrice: Number(e.target.value) })} />
              <input type="number" placeholder="Max Occupancy" required
                onChange={(e) => setRoomData({ ...roomData, maxOccupancy: Number(e.target.value) })} />
              <button type="submit" className={styles.createBtn}>Create Room</button>
            </form>
          </section>

          {/* SECTION 4: USER TABLE */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>User Management Database</div>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Internal ID</th>
                  <th>Email Address</th>
                  <th>System Role</th>
                  <th>Auth Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className={styles.userRow}>
                    <td className={styles.idCell}>{user._id.slice(-6)}...</td>
                    <td style={{ fontWeight: 500 }}>{user.email}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleAdmin : styles.roleGuest}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.loginMethod}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.email)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}