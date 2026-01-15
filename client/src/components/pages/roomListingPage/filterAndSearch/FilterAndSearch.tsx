import { useState } from "react";
import styles from "./styles.module.css";

type SortOption = "name" | "price";
type SortMethod = "ASC" | "DESC";

type FilterAndSearchProps = {
  sortedOption: SortOption;
  sortedMethod: SortMethod;
  setSortedOption: (value: SortOption) => void;
  setSortedMethod: (value: SortMethod) => void;
  search: string;
  setSearch: (value: string) => void;
  filters: string[];
  setFilters: (value: string[]) => void;
  amenities: string[];
};

export default function FilterAndSearch({
  sortedOption,
  sortedMethod,
  setSortedOption,
  setSortedMethod,
  search,
  setSearch,
  filters,
  setFilters,
  amenities,
}: FilterAndSearchProps) {
  // Single handler for combined option
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [option, method] = e.target.value.split("-") as [
      SortOption,
      SortMethod
    ];
    setSortedOption(option);
    setSortedMethod(method);
  };

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (checked) {
      // If checked, add the value to the array
      setSelectedItems([...selectedItems, value]);
      setFilters([...filters, value]);
    } else {
      // If unchecked, remove the value from the array
      setSelectedItems(selectedItems.filter((item) => item !== value));
      setFilters(filters.filter((item) => item !== value));
    }
  };

  const handleAmenities = () => {
    const amenitiesList = document.querySelector(`.${styles.amenityOptions}`);
    amenitiesList?.classList.toggle("hidden");
  };

  return (
    <section className={styles.roomListingFilter}>
      {/* COMBINED SORT */}
      <label>
        Sort Rooms:
        <select
          value={`${sortedOption}-${sortedMethod}`}
          onChange={handleSortChange}
        >
          <option value="name-ASC">Name ASC ↑</option>
          <option value="name-DESC">Name DESC ↓</option>
          <option value="price-ASC">Price ASC ↑</option>
          <option value="price-DESC">Price DESC ↓</option>
        </select>
      </label>

      {/* SEARCH */}
      <label>
        Search
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rooms..."
        />
      </label>

      {Array.isArray(amenities) && amenities.length > 0 && (
        <div className={styles.amenities} onClick={handleAmenities}>
          <p>Amenity Filters:</p>
          <div className={`hidden ${styles.amenityOptions}`}>
            {amenities.map((amenity) => {
              return (
                <label>
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={selectedItems.includes(amenity)}
                    onChange={handleCheckboxChange}
                  />
                  {amenity}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
