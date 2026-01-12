import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the TS type for the counter slice's state
export interface preferenceState {
  value: number;
  status: "idle" | "loading" | "failed";
}

// Define the initial value for the slice state
const initialState: preferenceState = {
  value: 0,
  status: "idle",
};

export const preferenceSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Export the generated action creators for use in components
export const { increment, incrementByAmount } = preferenceSlice.actions;

// Export the slice reducer for use in the store configuration
export default preferenceSlice.reducer;
