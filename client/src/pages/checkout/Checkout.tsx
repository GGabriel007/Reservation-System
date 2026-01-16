import { useEffect, useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectReservation } from "@/redux/features/reservation/reservationSlice";
import { setReservation } from "@/redux/features/reservation/reservationSlice";
import { selectRoom } from "@/redux/features/user/userSlice";
import { selectPreference } from "@/redux/features/preference/preferenceSlice";
import { usePostRerservationMutation } from "@/redux/features/api/apiSlice";
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

  const validateForm = () => {
    let newErrors = {};
    if (!reservation.firstName) {
      (
        document.querySelector('input[name="firstName"]') as HTMLInputElement
      )?.focus();
      return toast.error("First Name is required");
    }
    if (!reservation.lastName) {
      (
        document.querySelector('input[name="firstName"]') as HTMLInputElement
      )?.focus();
      return toast.error("Last Name is required");
    }
    if (!reservation.phone) {
      (
        document.querySelector('input[name="phone"]') as HTMLInputElement
      )?.focus();
      return toast.error("Phone Number is required");
    }
    if (!reservation.email) {
      (
        document.querySelector('input[name="email"]') as HTMLInputElement
      )?.focus();
      return toast.error("Email is required");
    }
    if (!reservation.email.includes("@")) {
      (
        document.querySelector('input[name="email"]') as HTMLInputElement
      )?.focus();
      return toast.error("Email is invalid");
    }
    if (!reservation.city) {
      (
        document.querySelector('input[name="city"]') as HTMLInputElement
      )?.focus();
      return toast.error("City is required");
    }
    if (!reservation.zipCode) {
      (
        document.querySelector('input[name="zipCode"]') as HTMLInputElement
      )?.focus();
      return toast.error("Zip Code is required");
    }
    if (
      !reservation.cardNumber ||
      !reservation.expiry ||
      !reservation.cvv ||
      !reservation.nameOnCard
    ) {
      (
        document.querySelector('input[name="cardNumber"]') as HTMLInputElement
      )?.focus();
      return toast.error("Card Information is required");
    }
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleConfirmBooking = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      const data = usePostRerservationMutation({});
      toast.success("Booking Confirmed!");
      navigate("/booking/confirmation");
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
            <img src={room.image || "/burmont-suit.jpg"} alt={room.roomName} />
          </div>
        </section>

        <form
          onSubmit={handleConfirmBooking}
          className={styles.mainGrid}
          id="confirmBookingForm"
        >
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
                  value={reservation.firstName || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name *"
                  value={reservation.lastName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputRow}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={reservation.phone || ""}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
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
                <option value="USA">United States</option>
                <option value="CAN">Canada</option>
              </select>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={reservation.city || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code *"
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
                value={reservation.cardNumber || ""}
                onChange={handleChange}
              />
              <div className={styles.inputRow}>
                <input
                  type="text"
                  name="expiry"
                  placeholder="Expiration Date (MM/YY) *"
                  value={reservation.expiry || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV *"
                  value={reservation.cvv || ""}
                  onChange={handleChange}
                />
              </div>
              <input
                type="text"
                name="nameOnCard"
                placeholder="Name on Card *"
                className={styles.fullWidthInput}
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
            className="btn-primary btn-medium"
            form="confirmBookingForm"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </main>
  );
}
