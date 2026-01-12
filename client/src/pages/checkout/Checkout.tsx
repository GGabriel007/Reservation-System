import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./styles.module.css";
import toast from "react-hot-toast";

interface RoomDetails {
  _id: string;
  roomType: string;
  basePrice: number;
  hotelId: {
    _id: string;
    name: string;
    location: string;
  };
}

export default function Checkout() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "USA",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
    newsletter: false,
    agreedToPrivacy: false,
    agreedToPolicies: false,
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:8080/rooms/${roomId}`);
        const data = await response.json();
        setRoom(data);
      } catch (err) {
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };
    if (roomId) fetchRoom();
  }, [roomId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation check for required checkboxes
    if (!formData.agreedToPolicies || !formData.agreedToPrivacy) {
      return toast.error("Please agree to the policies and privacy terms.");
    }

    // 2. Start booking process
    const loadingToast = toast.loading("Processing your reservation...");

    try {
      const response = await fetch("http://localhost:8080/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Spread all form fields (firstName, lastName, phone, email, address, etc.)
          ...formData, 
          
          // Technical identifiers
          roomId: roomId,
          hotelId: room?.hotelId._id,
        
          // These should eventually come from location.state or context
          checkIn: "2026-01-19",
          checkOut: "2026-01-21",
          
          // Financials: We send these, but the Service will verify the math on the backend
          roomPrice: room?.basePrice || 0,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Booking Confirmed!");
        
        // Navigate to the success page with the full reservation data
        navigate("/found-reservation", { state: { reservation: result } });
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.message || "Booking failed. Please check your details.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Checkout error:", err);
      toast.error("A network error occurred. Please try again.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <main className={styles.checkoutPage}>
      <div className="inner-grid">
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <h1>Check Out</h1>
            <button className={styles.signInBtn}>Sign In</button>
          </div>
          <div className={styles.headerImage}>
            <img src="/hotel-pool.jpg" alt="Room View" />
          </div>
        </header>

        <form onSubmit={handleConfirmBooking} className={styles.mainGrid}>
          {/* LEFT COLUMN */}
          <div className={styles.formColumn}>

            {/* BOX 1: GUEST INFORMATION */}
            <div className={styles.borderedBox}>
              <div className={styles.boxHeader}>
                <h3>Guest Information</h3>
                <span className={styles.requiredLabel}>* Required</span>
              </div>

              <div className={styles.inputRow}>
                <input type="text" name="firstName" placeholder="First name *" required onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last name *" required onChange={handleChange} />
              </div>
              <div className={styles.inputRow}>
                <input type="tel" name="phone" placeholder="Phone Number *" required onChange={handleChange} />
                <input type="email" name="email" placeholder="Email Address *" required onChange={handleChange} />
              </div>

              <h3 className={styles.subSectionTitle}>Address</h3>
              <select name="country" className={styles.fullWidthInput} onChange={handleChange}>
                <option value="USA">Country</option>
                <option value="CAN">Canada</option>
              </select>
              <div className={styles.inputRow}>
                <input type="text" name="city" placeholder="City *" required onChange={handleChange} />
                <input type="text" name="zipCode" placeholder="Zip Code *" required onChange={handleChange} />
              </div>

              <h3 className={styles.subSectionTitle}>Payment</h3>
              <p className={styles.secureNote}>We use secure transmission and encrypted storage to protect your personal information.</p>
              <input type="text" name="cardNumber" placeholder="Card Number *" className={styles.fullWidthInput} required onChange={handleChange} />
              <div className={styles.inputRow}>
                <input type="text" name="expiry" placeholder="Expiration Date (MM/YY) *" required onChange={handleChange} />
                <input type="text" name="cvv" placeholder="CVV *" required onChange={handleChange} />
              </div>
              <input type="text" name="nameOnCard" placeholder="Name on Card *" className={styles.fullWidthInput} required onChange={handleChange} />
            </div>

            {/* BOX 2: POLICIES */}
            <div className={styles.borderedBox}>
              <h3>Policies</h3>
              <div className={styles.policyGrid}>
                <div className={styles.policyItem}>
                  <strong>Check-in</strong>
                  <p>after 3:00 PM</p>
                </div>
                <div className={styles.policyItem}>
                  <strong>Check-out</strong>
                  <p>before 11:00 AM</p>
                </div>
              </div>
              <div className={styles.policyText}>
                <p><strong>Guarantee Policy</strong></p>
                <p>A valid credit card is required as guarantee.</p>
                <p><strong>Cancel Policy</strong></p>
                <p>Cancel 2 days prior to arrival to avoid a penalty charge of 1 night.</p>
              </div>
            </div>

            {/* BOX 3: ACKNOWLEDGMENT */}
            <div className={styles.borderedBox}>
              <h3 className={styles.acknowledgmentTitle}>Acknowledgment</h3>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkLabel}>
                  <input type="checkbox" name="newsletter" className={styles.customCheckbox} onChange={handleChange} />
                  <span className={styles.labelText}>Yes, I would like to receive newsletters, and special offers by email.</span>
                </label>

                <label className={styles.checkLabel}>
                  <input type="checkbox" name="agreedToPrivacy" className={styles.customCheckbox} required onChange={handleChange} />
                  <span className={styles.labelText}>* I agree with the <Link to="/privacy" className={styles.policyLink}>Privacy Terms</Link>.</span>
                </label>

                <label className={styles.checkLabel}>
                  <input type="checkbox" name="agreedToPolicies" className={styles.customCheckbox} required onChange={handleChange} />
                  <span className={styles.labelText}>* I agree with the Booking Policies</span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRICE DETAILS */}
          <aside className={styles.summaryColumn}>
            <div className={styles.priceDetailsBox}>
              <h3>Price Details</h3>
              <div className={styles.innerPriceSummary}>
                <p><strong>Room:</strong><br />Double Room</p>
                <p><strong>Price:</strong><br />$650</p>
                <div className={styles.stayDetails}>
                  <p><strong>Details</strong></p>
                  <p>2 Nights stay</p>
                  <p>Taxes and fees</p>
                  <p>CHF 7.00</p>
                  <p>Mon, Jan 19, 2026 - Wed, Jan 21, 2026</p>
                  <p>1 Adult</p>
                </div>
              </div>
              <div className={styles.finalTotalTable}>
                <div>Room Price: <span>$650</span></div>
                <div>Tax: <span>$0</span></div>
                <div>Fees: <span>$0</span></div>
                <hr />
                <div className={styles.grandTotal}>Total: <span>$650</span></div>
              </div>
            </div>
          </aside>
        </form>

        <div className={styles.footerActions}>
          <Link to="/" className={styles.backLink}>← Back</Link>
          <button type="submit" onClick={handleConfirmBooking} className={styles.confirmBtn}>Confirm Booking</button>
        </div>
      </div>
    </main>
  );
}