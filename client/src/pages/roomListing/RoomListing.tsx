import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { useGetRoomsQuery } from "@/redux/features/api/apiSlice";
import {
  RoomListingRoomCard,
  RoomListingCarousel,
  PreferenceBar,
  FilterAndSearch,
} from "@/components/pages/roomListingPage";
import Breadcrumbs from "@/components/global/breadcumbs/Breadcumbs";
/**
 * Booking Room and Update Preference Page Component
 * use to update room booking or user preference, also use for adding addition rooms
 */

export default function RoomListing() {
  const [sortedOption, setSortedOption] = useState<"name" | "price">("name");
  const [sortedMethod, setSortedMethod] = useState<"ASC" | "DESC">("ASC");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: rooms } = useGetRoomsQuery({
    option: sortedOption,
    method: sortedMethod,
    search: debouncedSearch || undefined,
  });
  return (
    <main className={styles.bookRoomPage}>
      <PreferenceBar></PreferenceBar>
      <div className={styles["inner-grid"]}>
        <Breadcrumbs />
        <h2>Select A Room</h2>
        <FilterAndSearch
          sortedOption={sortedOption}
          sortedMethod={sortedMethod}
          setSortedOption={setSortedOption}
          setSortedMethod={setSortedMethod}
          search={search}
          setSearch={setSearch}
        ></FilterAndSearch>
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
