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
};

export default function FilterAndSearch({
  sortedOption,
  sortedMethod,
  setSortedOption,
  setSortedMethod,
  search,
  setSearch,
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
    </section>
  );
}
