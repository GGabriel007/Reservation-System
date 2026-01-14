import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import HotelModal from "@/components/modals/hotelModal/HotelModal";
import ActionStatusModal from "@/components/global/toast/actionsStatusModal/ActionStatusModal";
import ConfirmDeleteToast from "@/components/global/toast/confirmationDeleteToast/ConfirmationDeleteToast";

interface Hotel {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  description: string;
  phone: string;
  email: string;
  createdAt: string;
}

export default function HotelManager() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  // --- TOAST NOTIFICATION STATE ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: "",
    type: 'success' as 'success' | 'error'
  });

  // --- DELETE CONFIRMATION STATE ---
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);

  const baseUrl = import.meta.env.PROD 
    ? "http://liore.us-east-1.elasticbeanstalk.com/admin" 
    : "http://localhost:8080/admin";

  // Helper to show Success/Error Toasts
  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setModalConfig({ isOpen: true, message, type });
  };

  // 1. Fetch Hotels
  const fetchHotels = async () => {
    try {
      const res = await fetch(`${baseUrl}/inventory`, {
        method: "GET", 
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setHotels(data);
      } else {
        console.error("Failed to fetch hotels");
      }
    } catch (error) {
      console.error("Error loading hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // 2. Handle Add/Edit Save
  const handleSaveHotel = async (hotelData: any) => {
    try {
      const method = editingHotel ? "PUT" : "POST";
      const url = editingHotel 
        ? `${baseUrl}/hotels/${editingHotel._id}`
        : `${baseUrl}/hotels`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(hotelData),
      });

      if (res.ok) {
        // SUCCESS FEEDBACK
        const action = editingHotel ? "updated" : "created";
        showFeedback(`Hotel "${hotelData.name}" was successfully ${action}!`, 'success');
        
        setIsModalOpen(false);
        setEditingHotel(null);
        fetchHotels(); // Refresh list
      } else {
        const err = await res.json();
        // ERROR FEEDBACK
        showFeedback(err.message || "Failed to save hotel", 'error');
      }
    } catch (error) {
      showFeedback("A network error occurred while saving.", 'error');
    }
  };

  // 3. Initiate Delete (Opens Confirmation Toast)
  const handleDeleteClick = (id: string) => {
    setHotelToDelete(id);
  };

  // 4. Execute Delete (Called when user clicks "Confirm" in Toast)
  const executeDelete = async () => {
    if (!hotelToDelete) return;

    try {
      const res = await fetch(`${baseUrl}/hotels/${hotelToDelete}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        showFeedback("Hotel has been removed from the directory.", 'success');
        fetchHotels();
      } else {
        showFeedback("Could not delete hotel. Please try again.", 'error');
      }
    } catch (error) {
      showFeedback("Network error: Could not reach server.", 'error');
    } finally {
      setHotelToDelete(null); // Close confirmation toast
    }
  };

  const openAddModal = () => {
    setEditingHotel(null);
    setIsModalOpen(true);
  };

  const openEditModal = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setIsModalOpen(true);
  };

  if (loading) return <div className={styles.loading}>Loading Directory...</div>;

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Property Directory</h2>
          <p className={styles.subtitle}>Manage all hotel locations and details.</p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          + Add New Hotel
        </button>
      </div>

      {/* Table Section */}
      <div className={styles.tableContainer}>
        {hotels.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hotels found. Click "Add New Hotel" to start.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>City / State</th>
                <th>Details</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td className={styles.nameCell}>
                    <strong>{hotel.name}</strong>
                  </td>
                  <td>
                    {hotel.address.city}, {hotel.address.state}
                  </td>
                  <td className={styles.descCell}>
                    {hotel.description ? (
                      hotel.description.substring(0, 50) + "..."
                    ) : (
                      <span style={{ color: "#999" }}>No description</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button 
                      onClick={() => openEditModal(hotel)} 
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(hotel._id)} 
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Hotel Form Modal */}
      <HotelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHotel}
        initialData={editingHotel}
      />

      {/* --- TOAST COMPONENTS --- */}
      
      {/* 1. Success/Error Feedback Modal */}
      <ActionStatusModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      {/* 2. Delete Confirmation Toast */}
      <ConfirmDeleteToast
        isOpen={!!hotelToDelete}
        onClose={() => setHotelToDelete(null)}
        onConfirm={executeDelete}
      />
    </div>
  );
}