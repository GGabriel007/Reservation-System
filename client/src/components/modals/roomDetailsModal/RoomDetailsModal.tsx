import styles from "./styles.module.css";

// Reuse the Interface from your main file to ensure types match
interface Room {
    _id: string;
    roomName: string;
    roomType: string;
    basePrice: number;
    maxOccupancy: number;
    amenities: string[];
    description: string;
    availabilityStatus: string;
    images: string[]; // <--- CHANGED: Now an array of strings
}

interface RoomDetailsModalProps {
    room: Room | null;   // The room to display (null = closed)
    onClose: () => void; // Function to close the modal
}

export default function RoomDetailsModal({ room, onClose }: RoomDetailsModalProps) {
    if (!room) return null;

    // Determine the base URL for images
    const baseUrl = typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:8080" // Or whatever your backend port is
        : "";

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            {/* stopPropagation prevents clicking inside the modal from closing it */}
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className={styles.header}>
                    <h2>{room.roomName}</h2>
                    <button className={styles.closeIcon} onClick={onClose}>&times;</button>
                </div>

                {/* Scrollable Body */}
                <div className={styles.content}>

                    {/* --- UPDATED: MULTI-IMAGE GALLERY --- */}
                    {room.images && room.images.length > 0 ? (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                            gap: '10px', 
                            marginBottom: '20px' 
                        }}>
                            {room.images.map((img, idx) => {
                                // Construct full URL for each image
                                const src = img.startsWith("http") ? img : `${baseUrl}${img}`;
                                
                                return (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt={`${room.roomName} view ${idx + 1}`}
                                        className={styles.roomImage}
                                        style={{ 
                                            width: '100%', 
                                            height: '120px', 
                                            objectFit: 'cover', 
                                            borderRadius: '6px',
                                            border: '1px solid #eee'
                                        }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        // Placeholder if no images exist
                        <div className={styles.imagePlaceholder}>
                            <span>No Images Available</span>
                        </div>
                    )}
                    {/* ------------------------------------ */}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className={styles.section}>
                            <span className={styles.label}>Type</span>
                            <div className={styles.value}>{room.roomType}</div>
                        </div>
                        <div className={styles.section}>
                            <span className={styles.label}>Nightly Rate</span>
                            <div className={styles.value}>${room.basePrice.toFixed(2)}</div>
                        </div>
                        <div className={styles.section}>
                            <span className={styles.label}>Occupancy</span>
                            <div className={styles.value}>{room.maxOccupancy} Guests</div>
                        </div>
                        <div className={styles.section}>
                            <span className={styles.label}>Status</span>
                            <div className={styles.value} style={{ textTransform: 'capitalize' }}>
                                {room.availabilityStatus}
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <span className={styles.label}>Description</span>
                        <div className={styles.value}>
                            {room.description || "No description provided for this room."}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <span className={styles.label}>Amenities</span>
                        <div className={styles.tagContainer}>
                            {room.amenities && room.amenities.length > 0 ? (
                                room.amenities.map((item, index) => (
                                    <span key={index} className={styles.amenityTag}>
                                        {item}
                                    </span>
                                ))
                            ) : (
                                <span style={{ color: '#999', fontSize: '0.9rem' }}>No amenities listed.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button className={styles.closeBtn} onClick={onClose}>Close</button>
                </div>

            </div>
        </div>
    );
}