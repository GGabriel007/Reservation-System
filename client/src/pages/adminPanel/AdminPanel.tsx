import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import toast from "react-hot-toast";
import ActionStatusModal from "@/components/global/toast/actionsStatusModal/ActionStatusModal";

interface Room {
  _id: string;
  roomName: string;
  roomType: string;
  basePrice: number;
  maxOccupancy: number;
  amenities: string[];
  description: string;
  availabilityStatus: string;
}

export default function AdminPanel() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: "",
    type: 'success' as 'success' | 'error'
  });

  const assignedHotelId = "6961bedfd52cfab927969b83";

  const [roomData, setRoomData] = useState({
    roomName: "",
    roomType: "Single",
    basePrice: 0,
    maxOccupancy: 2,
    amenities: "",
    description: "",
  });

  const baseUrl = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "";

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setModalConfig({ isOpen: true, message, type });
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${baseUrl}/rooms/hotel/${assignedHotelId}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${baseUrl}/rooms/${selectedRoomId}` : `${baseUrl}/rooms`;

    const payload = {
      ...roomData,
      hotel: assignedHotelId,
      amenities: roomData.amenities.split(",").map(a => a.trim()).filter(a => a !== "")
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // --- MODAL LOGIC GOES INSIDE HERE ---
        const action = isEditing ? "updated" : "created";
        showFeedback(`Room "${roomData.roomName}" was successfully ${action}!`, 'success');
        resetForm();
        fetchRooms();
      } else {
        const errorData = await response.json();
        showFeedback(errorData.message || "Failed to save room", 'error');
      }
    } catch (err) {
      showFeedback("A network error occurred", 'error');
    }
  };

  const handlePriceBlur = () => {
    // Ensures that when they stop typing, it's rounded to 2 decimal places
    setRoomData({
      ...roomData,
      basePrice: Number(roomData.basePrice.toFixed(2))
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this room?")) return;

    try {
      const res = await fetch(`${baseUrl}/rooms/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        // --- MODAL LOGIC GOES INSIDE HERE ---
        showFeedback("The room has been removed from your active inventory.", 'success');
        fetchRooms();
      } else {
        showFeedback("Could not delete the room. Please try again.", 'error');
      }
    } catch (err) {
      showFeedback("Network error: Could not reach server.", 'error');
    }
  };

  const handleEditClick = (room: Room) => {
    setIsEditing(true);
    setSelectedRoomId(room._id);
    setRoomData({
      roomName: room.roomName,
      roomType: room.roomType,
      basePrice: room.basePrice,
      maxOccupancy: room.maxOccupancy,
      amenities: room.amenities.join(", "),
      description: room.description || "",
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedRoomId(null);
    setRoomData({ roomName: "", roomType: "Single", basePrice: 0, maxOccupancy: 2, amenities: "", description: "" });
  };

  if (loading) return <div className={styles.loading}>Accessing Admin Suite...</div>;

  return (
    <main className={styles.adminPanelPage}>
      <header className={styles.headerArea}>
        <div className={styles.headerTitle}>
          <h1>Lioré Admin Panel</h1>
          <p className={styles.statsText}>Property Inventory Management</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Rooms</span>
            <span className={styles.statValue}>{rooms.length}</span>
          </div>
        </div>
      </header>

      <div className={styles.contentLayout}>
        {/* LEFT SIDE: Side-bar Form */}
        <aside className={styles.formSidebar}>
          <section className={styles.adminSection}>
            <div className={styles.sectionHeader}>
              {isEditing ? "Modify Room" : "New Room"}
            </div>
            <form onSubmit={handleSubmit} className={styles.compactForm}>
              <div className={styles.formGroup}>
                <label>Room Name</label>
                <input type="text" value={roomData.roomName} required onChange={(e) => setRoomData({ ...roomData, roomName: e.target.value })} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select value={roomData.roomType} onChange={(e) => setRoomData({ ...roomData, roomType: e.target.value })}>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Max Guests</label>
                  <input type="number" className={styles.noArrows} value={roomData.maxOccupancy === 0 ? "" : roomData.maxOccupancy} required onChange={(e) => setRoomData({ ...roomData, maxOccupancy: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Nightly Rate ($)</label>
                <input type="number" step="0.01" className={styles.noArrows} value={roomData.basePrice === 0 ? "" : roomData.basePrice} onBlur={handlePriceBlur} required placeholder="0.00" onChange={(e) => setRoomData({ ...roomData, basePrice: parseFloat(e.target.value) || 0 })} />
              </div>

              <div className={styles.formGroup}>
                <label>Amenities</label>
                <input type="text" placeholder="Wifi, AC, Pool..." value={roomData.amenities} onChange={(e) => setRoomData({ ...roomData, amenities: e.target.value })} />
              </div>

              {/* Wrap the description in a fullWidth class to make it look cleaner */}
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Description</label>
                <textarea
                  value={roomData.description}
                  onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                  placeholder="Describe the room features..."
                />
              </div>

              <div className={styles.formActionsVertical}>
                <button type="submit" className={styles.createBtn}>{isEditing ? "Update Room" : "Add Room"}</button>
                {isEditing && <button type="button" onClick={resetForm} className={styles.cancelBtn}>Cancel</button>}
              </div>
            </form>
          </section>
        </aside>

        {/* RIGHT SIDE: Main Inventory Table */}
        <section className={styles.tableMainContent}>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <span>Room Inventory Database</span>
              <span className={styles.refreshHint}>Real-time Inventory</span>
            </div>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Room Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id} className={styles.userRow}>
                    <td><strong>{room.roomName}</strong></td>
                    <td>{room.roomType}</td>
                    <td>${room.basePrice.toFixed(2)}</td>
                    <td><span className={`${styles.statusBadge} ${styles[room.availabilityStatus]}`}>{room.availabilityStatus}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleEditClick(room)} className={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDelete(room._id)} className={styles.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ActionStatusModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </main>
  );
}