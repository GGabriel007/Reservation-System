import styles from "./styles.module.css";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setRoom } from "@/redux/features/user/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { selectPreference } from "@/redux/features/preference/preferenceSlice";

interface Room {
  room: {
    _id: string;
    roomName: string;
    description: string;
    roomType: string;
    basePrice: number;
    maxOccupancy: number;
    amenities: string[];
    availabilityStatus: string;
    images: string[];
    hotel: string;
  };
}

/**
 * Room Card page that exist in the booking room page
 * @param room: Room interface
 * @returns RoomCard component
 */
export default function RoomListingRoomCard({ room }: Room) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const preference = useAppSelector(selectPreference);

  const handleOnBookRoomClick = () => {
    dispatch(
      setRoom({
        _id: room._id,
        roomName: room.roomName,
        basePrice: room.basePrice,
        image: room.images[0],
      })
    );
    console.log(room.images[0]);
    if (!preference.startDate || !preference.endDate) {
      return toast.error("Please enter the Check in and Check Out date");
    }
    navigate("/roomlisting/checkout");
  };
  const handleOnModalClick = () => {
    const modal = document.querySelector(`#D${room._id}`) as HTMLDialogElement;
    if (modal.showModal) {
      modal.showModal();
      (document.querySelector("body") as HTMLBodyElement).style.overflow =
        "hidden";
    }

    window.addEventListener("click", (e: PointerEvent) => {
      const element = e.target as HTMLElement;
      if (e && element.classList.contains("js-dialog")) {
        modal.close();
      }
    });

    document.querySelectorAll("dialog").forEach((element) => {
      element.addEventListener("close", () => {
        (document.querySelector("body") as HTMLBodyElement).style.overflow =
          "visible";
      });
    });
  };
  return (
    <>
      <article className={styles.roomCard}>
        <img src={room.images[0]} />
        <div className={styles.roomAmenities}>
          <ul>
            {room.amenities.map((amenity) => {
              return <li>{amenity}</li>;
            })}
          </ul>
          <p
            className={`js-dialog-toggle ${styles.roomDetailsToggle}`}
            onClick={handleOnModalClick}
          >
            Room Details
          </p>
        </div>

        <div className={styles.roomamenities}>
          <h3>{room.roomName}</h3>
          <p>{room.description}</p>
        </div>
        <div>
          <p className={styles.fee}>${room.basePrice} per night</p>
          <p className={styles.feeSmall}>Tax and Fee calculated at checkout</p>
          <button className="btn-primary" onClick={handleOnBookRoomClick}>
            Book Room
          </button>
        </div>
      </article>
      <dialog id={`D${room._id}`} className={`js-dialog ${styles.roomDetails}`}>
        <form method="dialog">
          <menu>
            <button className={styles.closeButton}>
              <picture>
                <img src="/close.png" alt="closing icon for the modal" />
              </picture>
            </button>
          </menu>
          <img src={room.images[0]} />
          <div className={styles.modalDetails}>
            <h2>{room.roomName}</h2>
            <p>{room.description}</p>
            <h3>Room Features Include:</h3>
            <ul>
              {room.amenities.map((amenity) => {
                return <li>{amenity}</li>;
              })}
            </ul>
          </div>
        </form>
      </dialog>
    </>
  );
}
