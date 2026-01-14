import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import HotelModal from "@/components/modals/hotelModal/HotelModal";
import ActionStatusModal from "@/components/global/toast/actionsStatusModal/ActionStatusModal";
import ConfirmDeleteToast from "@/components/global/toast/confirmationDeleteToast/ConfirmationDeleteToast";
import HotelDetailsModal from "@/components/modals/hotelDetailsModal/HotelDetailsModal";

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

  // State for Viewing Details
  const [viewHotel, setViewHotel] = useState<Hotel | null>(null);

  // Toast Notification State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: "",
    type: 'success' as 'success' | 'error'
  });

  // Delete Confirmation State
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);

  const baseUrl = import.meta.env.PROD 
    ? "http://liore.us-east-1.elasticbeanstalk.com/admin" 
    : "http://localhost:8080/admin";

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setModalConfig({ isOpen: true, message, type });
  };

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
        const action = editingHotel ? "updated" : "created";
        showFeedback(`Hotel "${hotelData.name}" was successfully ${action}!`, 'success');
        setIsModalOpen(false);
        setEditingHotel(null);
        fetchHotels();
      } else {
        const err = await res.json();
        showFeedback(err.message || "Failed to save hotel", 'error');
      }
    } catch (error) {
      showFeedback("A network error occurred while saving.", 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setHotelToDelete(id);
  };

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
      setHotelToDelete(null);
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
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Property Directory</h2>
          <p className={styles.subtitle}>Manage all hotel locations and details.</p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          + Add New Hotel
        </button>
      </div>

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
                <th>Description</th>
                <th className={styles.actionsCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id}>
                  {/* Name (Clickable) */}
                  <td 
                    onClick={() => setViewHotel(hotel)}
                    className={styles.nameCell}
                    title="Click to view details"
                  >
                    {hotel.name}
                  </td>
                  
                  {/* Location */}
                  <td>
                    {hotel.address.city}, {hotel.address.state}
                  </td>
                  
                  {/* Description (Truncated) */}
                  <td className={styles.descCell}>
                    {hotel.description ? (
                      hotel.description.length > 50 
                        ? hotel.description.substring(0, 50) + "..." 
                        : hotel.description
                    ) : (
                      <span className={styles.noDesc}>No description</span>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className={styles.actionsCell}>
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

      {/* MODALS */}
      <HotelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHotel}
        initialData={editingHotel}
      />

      <HotelDetailsModal
        hotel={viewHotel}
        onClose={() => setViewHotel(null)}
      />

      <ActionStatusModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      <ConfirmDeleteToast
        isOpen={!!hotelToDelete}
        onClose={() => setHotelToDelete(null)}
        onConfirm={executeDelete}
      />
    </div>
  );
}