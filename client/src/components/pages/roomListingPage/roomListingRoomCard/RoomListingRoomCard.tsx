import styles from "./styles.module.css";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setRoom } from "@/redux/features/user/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { selectPreference } from "@/redux/features/preference/preferenceSlice";
import type { Room } from "@/redux/types/Room";

interface RoomListingRoomCardProps {
  room: Room;
}

/**
 * Room Card page that exist in the booking room page
 * @param room: Room interface
 * @returns RoomCard component
 */
export default function RoomListingRoomCard({ room }: RoomListingRoomCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const preference = useAppSelector(selectPreference);

  const handleOnBookRoomClick = () => {
    dispatch(
      setRoom({
        _id: room._id,
        hotelId: room.hotel,
        roomName: room.roomName,
        basePrice: room.basePrice,
        image: room.images[0],
        roomType: room.roomType,
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
        <img
          src={
            room.images.length > 0
              ? `${import.meta.env.PROD ? "http://liore.us-east-1.elasticbeanstalk.com" : "http://localhost:8080"}/uploads/${room.images[0]}`
              : "/placeholder.png"
          }
          alt={room.roomName}
        />
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
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
            <p><strong>Type:</strong> {room.roomType}</p>
            <p><strong>Guests:</strong> {room.maxOccupancy} {room.maxOccupancy > 1 ? "Guests" : "Guest"}</p>
            <p><strong>Status:</strong> {room.availabilityStatus}</p>
          </div>
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
          <img
            src={
              room.images.length > 0
                ? `${import.meta.env.PROD ? "http://liore.us-east-1.elasticbeanstalk.com" : "http://localhost:8080"}/uploads/${room.images[0]}`
                : "/placeholder.png"
            }
            alt={room.roomName}
          />
          <div className={styles.modalDetails}>
            <h2>{room.roomName}</h2>
            <p>{room.description}</p>
            <div style={{ margin: "1rem 0" }}>
              <p><strong>Type:</strong> {room.roomType}</p>
              <p><strong>Guests:</strong> {room.maxOccupancy} {room.maxOccupancy > 1 ? "Guests" : "Guest"}</p>
              <p><strong>Status:</strong> {room.availabilityStatus}</p>
            </div>
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
