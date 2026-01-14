import styles from "./styles.module.css";

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

interface HotelDetailsModalProps {
  hotel: Hotel | null;
  onClose: () => void;
}

export default function HotelDetailsModal({ hotel, onClose }: HotelDetailsModalProps) {
  if (!hotel) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* stopPropagation prevents clicking inside the modal from closing it */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{hotel.name}</h2>
        </div>

        {/* Content Details */}
        <div className={styles.content}>
          
          <div className={styles.section}>
            <span className={styles.label}>Description</span>
            <p className={styles.value}>
              {hotel.description || "No description provided."}
            </p>
          </div>

          <div className={styles.gridRow}>
            <div className={styles.section}>
              <span className={styles.label}>Phone</span>
              <div className={styles.value}>{hotel.phone || "N/A"}</div>
            </div>
            <div className={styles.section}>
              <span className={styles.label}>Email</span>
              <div className={styles.value}>{hotel.email || "N/A"}</div>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>Address</span>
            <div className={styles.value}>
              {hotel.address.street}<br />
              {hotel.address.city}, {hotel.address.state} {hotel.address.zipCode}<br />
              {hotel.address.country}
            </div>
          </div>

          <div className={styles.idText}>
            Hotel ID: {hotel._id}
          </div>
        </div>

        {/* Footer / Close Button */}
        <div className={styles.footer}>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}