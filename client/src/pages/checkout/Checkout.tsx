import { useEffect, useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectReservation } from "@/redux/features/reservation/reservationSlice";
import { setReservation } from "@/redux/features/reservation/reservationSlice";
import { selectRoom } from "@/redux/features/user/userSlice";
import { selectPreference } from "@/redux/features/preference/preferenceSlice";
import styles from "./styles.module.css";
import toast from "react-hot-toast";
import Breadcrumbs from "@/components/global/breadcumbs/Breadcumbs";

export default function Checkout() {
  const reservation = useAppSelector(selectReservation);
  const room = useAppSelector(selectRoom);
  const preference = useAppSelector(selectPreference);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [agreedToPolicies, setAgreedToPolicies] = useState(true);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(true);
  const [difference, setDifference] = useState<number>(0);

  useEffect(() => {
    function dateDiffInDays(a: Date, b: Date) {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;

      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    if (!preference.startDate || !preference.endDate) {
      setDifference(0);
      return;
    }

    const a = new Date(preference.startDate);
    const b = new Date(preference.endDate);

    setDifference(dateDiffInDays(a, b));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    dispatch(setReservation({ [name]: val }));
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation check for required checkboxes
    if (!agreedToPolicies || !agreedToPrivacy) {
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
          ...reservation,

          // Technical identifiers
          roomId: room.roomId,
          hotelId: "6961b840d52cfab927969b75",

          // These should eventually come from location.state or context
          checkIn: preference.startDate,
          checkOut: preference.endDate,

          // Financials: We send these, but the Service will verify the math on the backend
          roomPrice: room?.basePrice || 0,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Booking Confirmed!");

        // Navigate to the success page with the full reservation data
        navigate("/foundreservation", { state: { reservation: result } });
      } else {
        toast.dismiss(loadingToast);
        toast.error(
          result.message || "Booking failed. Please check your details."
        );
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Checkout error:", err);
      toast.error("A network error occurred. Please try again.");
    }
  };

  // if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <main className={styles.checkoutPage}>
      <div className="inner-grid">
        <Breadcrumbs />
        <section className={styles.header}>
          <div className={styles.titleArea}>
            <h1>Check Out</h1>
            <NavLink
              to="/login"
              className="btn-secondary btn-medium btn-light-bs"
            >
              Sign In
            </NavLink>
          </div>
          <div className={styles.headerImage}>
            <img src={room.image} alt="Room View" />
          </div>
        </section>

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
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name *"
                  required
                  value={reservation.firstName || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name *"
                  required
                  value={reservation.lastName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputRow}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  required
                  value={reservation.phone || ""}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  required
                  value={reservation.email || ""}
                  onChange={handleChange}
                />
              </div>

              <h3 className={styles.subSectionTitle}>Address</h3>
              <select
                name="country"
                className={styles.fullWidthInput}
                value={reservation.country || ""}
                onChange={handleChange}
              >
                <option value="USA">Country</option>
                <option value="CAN">Canada</option>
              </select>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  required
                  value={reservation.city || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code *"
                  required
                  value={reservation.zipCode || ""}
                  onChange={handleChange}
                />
              </div>

              <h3 className={styles.subSectionTitle}>Payment</h3>
              <p className={styles.secureNote}>
                We use secure transmission and encrypted storage to protect your
                personal information.
              </p>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number *"
                className={styles.fullWidthInput}
                required
                value={reservation.cardNumber || ""}
                onChange={handleChange}
              />
              <div className={styles.inputRow}>
                <input
                  type="text"
                  name="expiry"
                  placeholder="Expiration Date (MM/YY) *"
                  required
                  value={reservation.expiry || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV *"
                  required
                  value={reservation.cvv || ""}
                  onChange={handleChange}
                />
              </div>
              <input
                type="text"
                name="nameOnCard"
                placeholder="Name on Card *"
                className={styles.fullWidthInput}
                required
                value={reservation.nameOnCard || ""}
                onChange={handleChange}
              />
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
                <p>
                  <strong>Guarantee Policy</strong>
                </p>
                <p>A valid credit card is required as guarantee.</p>
                <p>
                  <strong>Cancel Policy</strong>
                </p>
                <p>
                  Cancel 2 days prior to arrival to avoid a penalty charge of 1
                  night.
                </p>
              </div>
            </div>

            {/* BOX 3: ACKNOWLEDGMENT */}
            <div className={styles.borderedBox}>
              <h3 className={styles.acknowledgmentTitle}>Acknowledgment</h3>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    name="newsletter"
                    className={styles.customCheckbox}
                    onChange={handleChange}
                  />
                  <span className={styles.labelText}>
                    Yes, I would like to receive newsletters, and special offers
                    by email.
                  </span>
                </label>

                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    name="agreedToPrivacy"
                    className={styles.customCheckbox}
                    required
                    checked={agreedToPrivacy}
                    onChange={() => {
                      setAgreedToPrivacy((prev) => !prev);
                    }}
                  />
                  <span className={styles.labelText}>
                    * I agree with the{" "}
                    <Link to="/privacy" className={styles.policyLink}>
                      Privacy Terms
                    </Link>
                    .
                  </span>
                </label>

                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    name="agreedToPolicies"
                    className={styles.customCheckbox}
                    required
                    checked={agreedToPolicies}
                    onChange={() => {
                      setAgreedToPolicies((prev) => !prev);
                    }}
                  />
                  <span className={styles.labelText}>
                    * I agree with the Booking Policies
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRICE DETAILS */}
          <aside className={styles.summaryColumn}>
            <div className={styles.priceDetailsBox}>
              <h3>Price Details</h3>
              <div className={styles.innerPriceSummary}>
                <div>
                  <h4>Room:</h4>
                  <p>{room.roomName}</p>
                </div>
                <div>
                  <h4>Price:</h4>
                  <p>{room.basePrice && `$${room.basePrice}`}</p>
                </div>
                <div className={styles.stayDetails}>
                  <h4>Details</h4>
                  <p>
                    {preference.startDate !== null &&
                      new Date(preference.startDate).toLocaleDateString()}{" "}
                    -{" "}
                    {preference.endDate &&
                      new Date(preference.endDate).toLocaleDateString()}
                  </p>

                  <p>{`${difference} Night${
                    difference > 1 ? "s" : ""
                  } stay`}</p>
                  {preference.adults > 0 && (
                    <p>{`${preference.adults} Adult${
                      preference.adults > 1 ? "s" : ""
                    }`}</p>
                  )}
                  {preference.children > 0 && (
                    <p>{`${preference.children} ${
                      preference.children > 1 ? "Children" : "Child"
                    }`}</p>
                  )}
                  {preference.beds > 0 && (
                    <p>{`${preference.beds} Bed${
                      preference.beds > 1 ? "s" : ""
                    }`}</p>
                  )}
                </div>

                <Link to="/roomlisting">Edit</Link>
              </div>
              <div className={styles.finalTotalTable}>
                <div>
                  Room Price: <span>{`$${room.basePrice}`}</span>
                </div>
                <div>
                  Tax:{" "}
                  <span>
                    {room.basePrice
                      ? `$${(Number(room.basePrice) * 0.075).toFixed(2)}`
                      : "$0.00"}
                  </span>
                </div>
                <div>
                  Fees: <span>$100</span>
                </div>
                <hr />
                <div className={styles.grandTotal}>
                  Total:{" "}
                  <span>{`$${(
                    Number(room.basePrice) +
                    Number(room.basePrice) * 0.075 +
                    100
                  ).toFixed(2)}`}</span>
                </div>
              </div>
            </div>
          </aside>
        </form>

        <div className={styles.footerActions}>
          <Link to="/roomlisting" className={styles.backLink}>
            ← Back
          </Link>
          <button
            type="submit"
            onClick={handleConfirmBooking}
            className="btn-primary btn-medium"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </main>
  );
}
