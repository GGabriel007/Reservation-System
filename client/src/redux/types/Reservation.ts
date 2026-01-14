export type Reservation = {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  emailAddress: string;
  country: string;
  city: string;
  zipCode: number;
  cardNumber: number;
  expirationDate: string;
  cvv: number;
  nameOnCard: string;
  checkIn: Date | null;
  checkOut: Date | null;
  totalAmount: number;
  confirmationCode: string;
};
