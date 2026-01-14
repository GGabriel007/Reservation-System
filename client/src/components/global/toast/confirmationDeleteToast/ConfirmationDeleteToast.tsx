import styles from "./styles.module.css";

interface ConfirmDeleteToastProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  // --- NEW OPTIONAL PROPS ---
  title?: string;
  message?: string;
}

export default function ConfirmDeleteToast({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Item?", // Default fallback
  message = "This action cannot be undone." // Default fallback
}: ConfirmDeleteToastProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.container}>
        {/* Use the dynamic title */}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.deleteBtn}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}