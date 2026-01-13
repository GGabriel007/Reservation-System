import styles from "./styles.module.css";
import { useGetRoomsQuery } from "@/redux/features/api/apiSlice";
import {
  RoomListingRoomCard,
  RoomListingCarousel,
  PreferenceBar,
  FilterAndSearch,
} from "@/components/pages/roomListingPage";
/**
 * Booking Room and Update Preference Page Component
 * use to update room booking or user preference, also use for adding addition rooms
 */

export default function RoomListing() {
  const { data: rooms } = useGetRoomsQuery();
  return (
    <main className={styles.bookRoomPage}>
      <PreferenceBar></PreferenceBar>
      <div className={styles["inner-grid"]}>
        <h2>Select A Room</h2>
        <FilterAndSearch></FilterAndSearch>
        <ul className={styles.roomList}>
          {rooms?.map((room) => {
            return (
              <li>
                <RoomListingCarousel></RoomListingCarousel>
                <RoomListingRoomCard room={room}></RoomListingRoomCard>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
