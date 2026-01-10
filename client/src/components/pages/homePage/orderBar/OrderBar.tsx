import { forwardRef, memo, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* Order Bar in Home Page, can be expand to be used elsewhere
 * Uses React Datepicker to display the date picker
 */
type CustomInputProps = {
  className?: string;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const CustomInputButton = memo(
  forwardRef<HTMLButtonElement, CustomInputProps>(
    ({ value, onClick, className }, ref) => (
      <button type="button" ref={ref} className={className} onClick={onClick}>
        {`Check In \n${value}`}
      </button>
    )
  )
);

CustomInputButton.displayName = "CustomInputButton";

const CustomInputButton2 = memo(
  forwardRef<HTMLButtonElement, CustomInputProps>(
    ({ value, onClick, className }, ref) => (
      <button type="button" ref={ref} className={className} onClick={onClick}>
        {`Check Out \n${value}`}
      </button>
    )
  )
);

CustomInputButton.displayName = "CustomInputButton2";

export default function OrderBar() {
  const [selectedDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [rooms, setRooms] = useState<number>(0);
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [bed, setBed] = useState<number>(0);

  const handleGuestButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const bubble = document.querySelector("[class*=bubble]") as HTMLElement;
    if (bubble) {
      const guest = document.querySelector("[class*=guest]") as HTMLElement;
      if (!bubble.contains(event.target as Node)) {
        bubble.classList.toggle("hidden");
        guest.classList.toggle("visible");
      }
    }
  };

  useEffect(() => {
    setTimeout(function () {
      const element = document.querySelector(
        "[class*=orderBar]"
      ) as HTMLInputElement;
      element.style.opacity = "1";
    }, 500);
  }, []);
  return (
    <section className={styles.orderBar}>
      <div className={styles["inner-grid"]}>
        <DatePicker
          selected={selectedDate}
          onChange={(date: any) => setStartDate(date)}
          customInput={<CustomInputButton className={styles.startDate} />}
          className={styles["datepicker-container"]}
          selectsStart
          startDate={selectedDate}
          endDate={endDate}
          maxDate={endDate || new Date(2026, 12, 31)}
        />
        <DatePicker
          selected={endDate}
          onChange={(date: any) => setEndDate(date)}
          customInput={<CustomInputButton2 className={styles.endDate} />}
          className={styles["datepicker-container"]}
          selectsEnd
          startDate={selectedDate}
          endDate={endDate}
          minDate={selectedDate || new Date()}
        />
        <button className={styles.guest} onClick={handleGuestButtonClick}>
          Guests
          <div className={`${styles.bubble} hidden`}>
            <div className={styles.bubbleHead}>Preference</div>
            <p>
              Room
              <img
                className="roomMinus"
                src="/minus.svg"
                alt=""
                onClick={() => setRooms(Math.max(rooms - 1, 0))}
              />
              {rooms}
              <img
                className="roomPlus"
                src="/plus.svg"
                alt=""
                onClick={() => setRooms(Math.min(rooms + 1, 3))}
              />
            </p>
            <p>
              Adults
              <img
                className="adultMinus"
                src="/minus.svg"
                alt=""
                onClick={() => setAdults(Math.max(rooms - 1, 0))}
              />
              {adults}
              <img
                className="adultPlus"
                src="/plus.svg"
                alt=""
                onClick={() => setAdults(Math.min(adults + 1, 4))}
              />
            </p>
            <p>
              Children
              <img
                className="childMinus"
                src="/minus.svg"
                alt=""
                onClick={() => setChildren(Math.max(rooms - 1, 0))}
              />
              {children}
              <img
                className="childPlus"
                src="/plus.svg"
                alt=""
                onClick={() => setChildren(Math.min(children + 1, 4))}
              />
            </p>
            <p>
              Bed
              <img
                className="bedminus"
                src="/minus.svg"
                alt=""
                onClick={() => setBed(Math.max(rooms - 1, 0))}
              />
              {bed}
              <img
                className="bedPlus"
                src="/plus.svg"
                alt=""
                onClick={() => setBed(Math.min(bed + 1, 2))}
              />
            </p>
          </div>
        </button>
        <NavLink to="/bookroom" className={styles.book}>
          Book Now
        </NavLink>
      </div>
      ;
    </section>
  );
}
