import React from 'react';
import styles from "./styles.module.css";

interface ActionStatusModalProps {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const ActionStatusModal: React.FC<ActionStatusModalProps> = ({ isOpen, message, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles[type]}`}>
        <div className={styles.icon}>
          {type === 'success' ? '✓' : '✕'}
        </div>
        <h3>{type === 'success' ? 'Success!' : 'Error'}</h3>
        <p>{message}</p>
        <button onClick={onClose} className={styles.closeBtn}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default ActionStatusModal;