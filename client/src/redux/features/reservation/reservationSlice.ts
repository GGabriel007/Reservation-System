import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

// Define the TS type for the prefererence slice's state
export interface ReservationState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
  checkIn: Date | null;
  checkOut: Date | null;
  totalAmount: number;
  confirmationCode: string;
  hotelName: string;
}
// Define the initial value for the slice state
const initialState: ReservationState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  country: "",
  city: "",
  zipCode: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  nameOnCard: "",
  checkIn: null,
  checkOut: null,
  totalAmount: 0,
  confirmationCode: Math.random().toString(36).substring(2, 9).toUpperCase(),
  hotelName: "",
};

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const preferenceSlice = createSlice({
  name: "reservation",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setReservation: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetReservation: () => initialState,
  },
});

// Export the generated action creators for use in components
export const { setReservation, resetReservation } = preferenceSlice.actions;

// preference state defined in store.ts
export const selectReservation = (state: RootState) => state.reservation;

// Export the slice reducer for use in the store configuration
export default preferenceSlice.reducer;
