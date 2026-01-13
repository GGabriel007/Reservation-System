import { useRef, useEffect } from "react";
import styles from "./styles.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePickerRef from "react-datepicker";
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

export default function PreferenceBar() {
  const { rooms, adults, children, beds, startDate, endDate } =
    useAppSelector(selectPreference);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (startDate && endDate) {
      (
        document.querySelector(".react-datepicker-wrapper") as HTMLDivElement
      ).style.display = "block";
    }
  }, []);

  const datePickerRef = useRef<ReactDatePickerRef>(null);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    dispatch(setStartDate(start));
    dispatch(setEndDate(end));
  };

  const handleGuestButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const bubble = document.querySelector(`.${styles.bubble}`) as HTMLElement;
    if (bubble) {
      const guest = document.querySelector(`.${styles.guest}`) as HTMLElement;
      if (!bubble.contains(event.target as Node)) {
        bubble.classList.toggle("hidden");
        guest.classList.toggle("visible");
      }
    }
  };

  return (
    <section className={styles.preferenceBar}>
      <div className={styles["inner-grid"]}>
        <div className={styles.preference}>
          <h4>Destination</h4>
          <p>San Diego</p>
        </div>
        <div>
          <label className={styles.datePicker}>
            <h4
              onClick={() => {
                (
                  document.querySelector(
                    ".react-datepicker-wrapper"
                  ) as HTMLDivElement
                ).style.display = "block";
              }}
            >
              Check In/Check Out
            </h4>
            {/* DatePicker */}
            <DatePicker
              ref={datePickerRef}
              selected={startDate}
              onChange={handleChange}
              onClickOutside={() => {
                if (!startDate && !endDate)
                  (
                    document.querySelector(
                      ".react-datepicker-wrapper"
                    ) as HTMLDivElement
                  ).style.display = "none";
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
            />
          </label>
        </div>
        <div>
          <h4>
            <button className={styles.guest} onClick={handleGuestButtonClick}>
              Room, Guest & Bed
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
              <ul>
                <li>{`${rooms} Rooms`}</li>
                <li>{`${adults} Adults, ${children} Children`}</li>
                <li>{`${beds} Beds`}</li>
              </ul>
            </button>
          </h4>
        </div>
        <button className="btn-cancel">Update Preference</button>
      </div>
    </section>
  );
}
