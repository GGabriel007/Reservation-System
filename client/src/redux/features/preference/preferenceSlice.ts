import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

// Define the TS type for the prefererence slice's state
export interface PreferenceState {
  rooms: number;
  adults: number;
  children: number;
  beds: number;
  startDate: Date | null;
  endDate: Date | null;
}

// Define the initial value for the slice state
const initialState: PreferenceState = {
  rooms: 1,
  adults: 2,
  children: 0,
  beds: 0,
  startDate: null,
  endDate: null,
};

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const preferenceSlice = createSlice({
  name: "preference",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increaseRooms: (state) => {
      if (state.rooms < 3) state.rooms += 1;
    },
    descreaseRooms: (state) => {
      if (state.rooms > 1) state.rooms -= 1;
    },
    increaseAdults: (state) => {
      if (state.adults < 4) state.adults += 1;
    },
    descreaseAdults: (state) => {
      if (state.adults > 1) state.adults -= 1;
    },
    increaseChildren: (state) => {
      if (state.children < 4) state.children += 1;
    },
    descreaseChildren: (state) => {
      if (state.children > 0) state.children -= 1;
    },
    increaseBeds: (state) => {
      if (state.beds < 4) state.beds += 1;
    },
    descreaseBeds: (state) => {
      if (state.beds > 1) state.beds -= 1;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
  },
});

// Export the generated action creators for use in components
export const {
  increaseRooms,
  descreaseRooms,
  increaseAdults,
  descreaseAdults,
  increaseChildren,
  descreaseChildren,
  increaseBeds,
  descreaseBeds,
  setStartDate,
  setEndDate,
} = preferenceSlice.actions;

// preference state defined in store.ts
export const selectPreference = (state: RootState) => state.preference;

// Export the slice reducer for use in the store configuration
export default preferenceSlice.reducer;
