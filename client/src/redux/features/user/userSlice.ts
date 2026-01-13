import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

// Define the TS type for the prefererence slice's state
export interface UserState {
  roomId: string;
  roomName: string;
  basePrice: string;
  image: string;
}

// Define the initial value for the slice state
const initialState: UserState = {
  roomId: "",
  roomName: "",
  basePrice: "",
  image: "",
};

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setRoom: (state, action) => {
      state.roomId = action.payload._id;
      state.roomName = action.payload.roomName;
      state.basePrice = action.payload.basePrice;
      state.image = action.payload.image;
    },
  },
});

// Export the generated action creators for use in components
export const { setRoom } = userSlice.actions;

// preference state defined in store.ts
export const selectRoom = (state: RootState) => state.user;

// Export the slice reducer for use in the store configuration
export default userSlice.reducer;
