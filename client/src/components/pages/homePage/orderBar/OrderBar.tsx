import { forwardRef, memo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  increaseRooms,
  descreaseRooms,
  increaseAdults,
  descreaseAdults,
  increaseChildren,
  descreaseChildren,
  increaseBeds,
  descreaseBeds,
  setStartDate,
  setEndDate,
  selectPreference,
} from "@/redux/features/preference/preferenceSlice";

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
  const { rooms, adults, children, beds, startDate, endDate } =
    useAppSelector(selectPreference);
  const dispatch = useAppDispatch();

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
          selected={startDate}
          onChange={(date: Date | null) => dispatch(setStartDate(date))}
          customInput={<CustomInputButton className={styles.startDate} />}
          className={styles["datepicker-container"]}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={endDate || new Date(2026, 12, 31)}
        />
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => dispatch(setEndDate(date))}
          customInput={<CustomInputButton2 className={styles.endDate} />}
          className={styles["datepicker-container"]}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || new Date()}
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
                onClick={() => dispatch(descreaseRooms())}
              />
              {rooms}
              <img
                className="roomPlus"
                src="/plus.svg"
                alt=""
                onClick={() => dispatch(increaseRooms())}
              />
            </p>
            <p>
              Adults
              <img
                className="adultMinus"
                src="/minus.svg"
                alt=""
                onClick={() => dispatch(descreaseAdults())}
              />
              {adults}
              <img
                className="adultPlus"
                src="/plus.svg"
                alt=""
                onClick={() => dispatch(increaseAdults())}
              />
            </p>
            <p>
              Children
              <img
                className="childMinus"
                src="/minus.svg"
                alt=""
                onClick={() => dispatch(descreaseChildren())}
              />
              {children}
              <img
                className="childPlus"
                src="/plus.svg"
                alt=""
                onClick={() => dispatch(increaseChildren())}
              />
            </p>
            <p>
              Bed
              <img
                className="bedminus"
                src="/minus.svg"
                alt=""
                onClick={() => dispatch(descreaseBeds())}
              />
              {beds}
              <img
                className="bedPlus"
                src="/plus.svg"
                alt=""
                onClick={() => dispatch(increaseBeds())}
              />
            </p>
          </div>
        </button>
        <NavLink to="/roomlisting" className={styles.book}>
          Book Now
        </NavLink>
      </div>
      ;
    </section>
  );
}
