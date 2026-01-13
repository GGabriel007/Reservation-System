import styles from "./styles.module.css";

// --- ADD THIS SECTION ---
interface ConfirmDeleteToastProps {
  isOpen: boolean;       
  onClose: () => void;   
  onConfirm: () => void; 
}
// ------------------------

export default function ConfirmDeleteToast({ isOpen, onClose, onConfirm }: ConfirmDeleteToastProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.container}>
        <h3 className={styles.title}>Delete Room?</h3>
        <p className={styles.message}>
          This action cannot be undone and will remove the room from inventory.
        </p>
        
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