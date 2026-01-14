import { useState, useEffect } from "react";
import styles from "./styles.module.css"; 

interface HotelData {
  _id?: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  description: string;
  // images removed
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HotelData) => Promise<void>;
  initialData?: HotelData | null;
}

export default function HotelModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState<HotelData>({
    name: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "USA" },
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data if editing
  useEffect(() => {
    if (initialData) {
      // We strip out images if they happen to exist in the DB, just in case
      const { images, ...cleanData } = initialData as any;
      setFormData(cleanData);
    } else {
      // Reset for "Add New"
      setFormData({
        name: "",
        address: { street: "", city: "", state: "", zipCode: "", country: "USA" },
        description: ""
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save hotel", error);
      alert("Error saving hotel. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {initialData ? "Edit Hotel" : "Register New Hotel"}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Row 1: Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Hotel Name</label>
            <input 
              type="text" 
              required
              className={styles.input}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Grand Plaza Hotel"
            />
          </div>

          {/* Row 2: Address (Grid) */}
          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Street Address</label>
              <input 
                type="text" required
                className={styles.input}
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, street: e.target.value}
                })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <input 
                type="text" required
                className={styles.input}
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, city: e.target.value}
                })}
              />
            </div>
          </div>

          <div className={styles.gridThree}>
             <div className={styles.formGroup}>
              <label className={styles.label}>State</label>
              <input 
                type="text" required
                className={styles.input}
                value={formData.address.state}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, state: e.target.value}
                })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Zip Code</label>
              <input 
                type="text" required
                className={styles.input}
                value={formData.address.zipCode}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, zipCode: e.target.value}
                })}
              />
            </div>
             <div className={styles.formGroup}>
              <label className={styles.label}>Country</label>
              <input 
                type="text" disabled value="USA"
                className={`${styles.input} ${styles.inputDisabled}`}
              />
            </div>
          </div>

          {/* Row 3: Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea 
              rows={4}
              className={styles.textarea}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of the property..."
            />
          </div>

          {/* Actions */}
          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.saveBtn}
            >
              {isSubmitting ? "Saving..." : "Save Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}