import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
import { selectUserInfo } from "@/redux/features/user/userSlice";
import styles from "./styles.module.css";
import toast, { Toaster } from "react-hot-toast";
import ActionStatusModal from "@/components/global/toast/actionsStatusModal/ActionStatusModal";
import ConfirmDeleteToast from "@/components/global/toast/confirmationDeleteToast/ConfirmationDeleteToast";
import RoomDetailsModal from "@/components/modals/roomDetailsModal/RoomDetailsModal";
import ReservationManager from "./ReservationManager";

interface Room {
  _id: string;
  roomName: string;
  roomType: string;
  basePrice: number;
  maxOccupancy: number;
  amenities: string[];
  description: string;
  availabilityStatus: string;
  images: string[];
}

const AMENITY_OPTIONS = ["Wifi", "AC", "Pool", "TV", "Parking", "Kitchen", "Gym", "Breakfast", "Ocean View", "Pet Friendly"];

export default function AdminPanel() {
  const navigate = useNavigate();
  const userInfo = useAppSelector(selectUserInfo);
  const assignedHotelId = userInfo?.assignedHotel;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [viewRoom, setViewRoom] = useState<Room | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [hotelName, setHotelName] = useState("Loading Hotel...");
  const [searchTerm, setSearchTerm] = useState("");

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: "",
    type: 'success' as 'success' | 'error'
  });

  const [roomData, setRoomData] = useState({
    roomName: "",
    roomType: "Single",
    basePrice: 0,
    maxOccupancy: 2,
    amenities: [] as string[],
    description: "",
    availabilityStatus: "available",
    images: [] as string[]
  });

  const baseUrl = import.meta.env.PROD 
  ? "http://liore.us-east-1.elasticbeanstalk.com" 
  : "http://localhost:8080";

  useEffect(() => {
    if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'manager')) {
      navigate("/staffLogin");
    }
  }, [userInfo, navigate]);

  // FIX 1: ADDED CREDENTIALS: "INCLUDE"
  useEffect(() => {
    const fetchHotelName = async () => {
      if (assignedHotelId) {
        try {
          const res = await fetch(`${baseUrl}/hotels/${assignedHotelId}`, {
            credentials: "include" // <--- CRITICAL FIX
          });
          if (res.ok) {
            const data = await res.json();
            setHotelName(data.name);
          } else {
            setHotelName("Unknown Hotel");
          }
        } catch (err) {
          setHotelName("Hotel Info Unavailable");
        }
      }
    };
    fetchHotelName();
  }, [assignedHotelId, baseUrl]);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setModalConfig({ isOpen: true, message, type });
  };

  const fetchRooms = async () => {
    if (!assignedHotelId) {
      setLoading(false);
      return;
    }

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

  useEffect(() => {
    if (assignedHotelId) {
      fetchRooms();
    }
  }, [assignedHotelId]);

  const toggleAmenity = (amenity: string) => {
    setRoomData((prev) => {
      const current = prev.amenities || [];
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${baseUrl}/rooms/${selectedRoomId}` : `${baseUrl}/rooms`;

    const formData = new FormData();
    formData.append("roomName", roomData.roomName);
    formData.append("roomType", roomData.roomType);
    formData.append("basePrice", roomData.basePrice.toString());
    formData.append("maxOccupancy", roomData.maxOccupancy.toString());
    formData.append("description", roomData.description);
    formData.append("hotel", assignedHotelId || "");
    formData.append("availabilityStatus", roomData.availabilityStatus);

    roomData.amenities.forEach((amenity) => {
      formData.append("amenities", amenity);
    });

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    if (roomData.images && roomData.images.length > 0) {
      roomData.images.forEach((imgUrl) => {
        formData.append("existingImages", imgUrl);
      });
    }

    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
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
    setRoomData({
      ...roomData,
      basePrice: Number(roomData.basePrice.toFixed(2))
    });
  };

  const executeDelete = async () => {
    if (!roomToDelete) return;
    try {
      const res = await fetch(`${baseUrl}/rooms/${roomToDelete}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        showFeedback("The room has been removed from your active inventory.", 'success');
        fetchRooms();
      } else {
        showFeedback("Could not delete the room. Please try again.", 'error');
      }
    } catch (err) {
      showFeedback("Network error: Could not reach server.", 'error');
    } finally {
      setRoomToDelete(null);
    }
  };

  const handleDelete = (id: string) => {
    setRoomToDelete(id);
  };

  const handleEditClick = (room: Room) => {
    setIsEditing(true);
    setSelectedRoomId(room._id);
    setRoomData({
      roomName: room.roomName,
      roomType: room.roomType,
      basePrice: room.basePrice,
      maxOccupancy: room.maxOccupancy,
      amenities: Array.isArray(room.amenities)
        ? room.amenities
        : (typeof room.amenities === 'string' ? (room.amenities as string).split(",") : []),
      description: room.description || "",
      availabilityStatus: room.availabilityStatus,
      images: room.images || [],
    });
    setImageFiles([]); 
    const existingImages = room.images || [];
    const fullPaths = existingImages.map(img => img.startsWith("http") ? img : `${baseUrl}${img}`);
    setImagePreviews(fullPaths);
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedRoomId(null);
    setRoomData({
      roomName: "",
      roomType: "Single",
      basePrice: 0,
      maxOccupancy: 2,
      amenities: [],
      description: "",
      availabilityStatus: "available",
      images: [],
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  if (loading) return <div className={styles.loading}>Accessing Management Suite...</div>;

  const filteredRooms = rooms.filter((room) =>
    room.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <hr className="my-8" />
    <main className={styles.adminPanelPage}>
      <Toaster />
      <header className={styles.headerArea}>
        <div className={styles.headerTitle}>
          <h1>Manager Dashboard <span className={styles.goldText}>Lioré</span></h1>
          <p className={styles.statsText}>
            Operating as: <strong>{userInfo?.firstName}</strong> | Hotel: <strong>{hotelName}</strong>
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Inventory</span>
            <span className={styles.statValue}>{rooms.length}</span>
          </div>
        </div>
      </header>

      <div className={styles.contentLayout}>
        <aside className={styles.formSidebar}>
          <section className={styles.adminSection}>
            <div className={styles.sectionHeader}>
              {isEditing ? "Modify Room" : "New Room"}
            </div>
            <form onSubmit={handleSubmit} className={styles.compactForm}>
              {/* IMAGE UPLOAD SECTION */}
              <div className={styles.formGroup}>
                <label>Room Gallery (Max 5)</label>
                <div
                  style={{
                    border: '2px dashed #cfaa5f',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#fafafa',
                    marginBottom: '10px'
                  }}
                  onClick={() => document.getElementById('roomImagesInput')?.click()}
                >
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>Click to add photos</p>
                  <input
                    type="file"
                    id="roomImagesInput"
                    hidden
                    multiple 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                {imagePreviews.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {imagePreviews.map((src, index) => (
                      <div key={index} style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                          src={src}
                          alt="Preview"
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute', top: -5, right: -5,
                            background: 'red', color: 'white', border: 'none',
                            borderRadius: '50%', width: '18px', height: '18px',
                            cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Room Name</label>
                <input type="text" value={roomData.roomName} required onChange={(e) => setRoomData({ ...roomData, roomName: e.target.value })} />
              </div>

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
                <label>Current Status</label>
                <select
                  value={roomData.availabilityStatus}
                  onChange={(e) => setRoomData({ ...roomData, availabilityStatus: e.target.value })}
                  style={{
                    borderLeft: `5px solid ${roomData.availabilityStatus === 'available' ? '#4CAF50' :
                      roomData.availabilityStatus === 'occupied' ? '#F44336' :
                        roomData.availabilityStatus === 'maintenance' ? '#cc7a00' : '#887a00'
                      }`
                  }}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="pending">Cleaning/Pending</option>
                </select>

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
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "5px" }}>
                  {AMENITY_OPTIONS.map((amenity) => {
                    const isSelected = roomData.amenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "15px",
                          border: isSelected ? "1px solid #cfaa5f" : "1px solid #ddd",
                          backgroundColor: isSelected ? "#f9f3e5" : "#fff",
                          color: isSelected ? "#000" : "#666",
                          fontSize: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {amenity} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>

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

        <section className={styles.tableMainContent}>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <span>Room Inventory Database</span>
              <input
                type="text"
                placeholder="Search room name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "0.9rem",
                  marginLeft: "auto",     
                  marginRight: "15px",    
                  width: "200px"
                }}
              />
              <span className={styles.refreshHint}>Live Updates Enabled</span>
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
                {filteredRooms.map((room) => (
                  <tr key={room._id} className={styles.userRow}>
                    <td
                      onClick={() => setViewRoom(room)}
                      style={{ cursor: "pointer", color: "#c5a059", textDecoration: "underline" }}
                      title="Click to view details"
                    >
                      <strong>{room.roomName}</strong>
                    </td>
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

          {/* FIX 2: MOVED RESERVATION MANAGER HERE */}
          {/* By putting it inside this section, it gets a valid width from the parent container */}
          {assignedHotelId && (
             <div style={{ marginTop: '30px', minHeight: '400px' }}>
                <ReservationManager hotelId={assignedHotelId} />
             </div>
          )}

        </section>
      </div>

      <ActionStatusModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      <ConfirmDeleteToast
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        onConfirm={executeDelete}
      />

      <RoomDetailsModal
        room={viewRoom}
        onClose={() => setViewRoom(null)}
      />
    </main>
  </div>
  );
}