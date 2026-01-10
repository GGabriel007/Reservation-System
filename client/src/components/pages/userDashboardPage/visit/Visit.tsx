interface VisitProps {
  /** Define which Past or Future visit */
  timeline: string;
  userData: {
    /** Define the reservation number list */
    reservationNumber: number[];
    /** The array of room this user has been in */
    roomList: string[];
  };
}
export default function Visit({ timeline }: VisitProps) {
  return (
    <section>
      <h2>{timeline === "past" ? "Past Visit" : "Future Visit"}</h2>
      <div className="layout-grid"></div>
    </section>
  );
}
