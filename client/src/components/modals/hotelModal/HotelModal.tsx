import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function HotelModal({ isOpen, onClose, onSave, initialData }: HotelModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. UPDATE STATE TO INCLUDE PHONE & EMAIL
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    address: initialData?.address || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    phone: initialData?.phone || "", 
    email: initialData?.email || "", 
    description: initialData?.description || "",
  });

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || "",
        address: initialData?.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "USA",
        },
        phone: initialData?.phone || "",
        email: initialData?.email || "",
        description: initialData?.description || "",
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

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
            </div>
          </div>

          {/* --- 2. NEW CONTACT INFO SECTION --- */}
          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input 
                type="text" 
                className={styles.input}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input 
                type="email" 
                className={styles.input}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="contact@hotel.com"
              />
            </div>
          </div>
          {/* ----------------------------------- */}

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