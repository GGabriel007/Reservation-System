export type Reservation = {
  userId: number;
  roomId: number;
  // hotelId: number;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  //   status: {
  //     type: String,
  //     enum: ["pending", "confirmed", "cancelled", "failed"],
  //     default: "pending",
  //   },
  confirmationCode: string;
};
