import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import type { User } from "@/redux/types/User";

export interface UserState {
  // Existing room selection state
  roomId: string;
  hotelId: string;
  roomName: string;
  basePrice: string;
  image: string;
  roomType: string;

  // NEW: Logged in user information
  userInfo: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  roomId: "",
  hotelId: "",
  roomName: "",
  basePrice: "",
  image: "",
  roomType: "",
  userInfo: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Existing reducer
    setRoom: (state, action) => {
      state.roomId = action.payload._id;
      state.hotelId = action.payload.hotelId;
      state.roomName = action.payload.roomName;
      state.basePrice = action.payload.basePrice;
      state.image = action.payload.image;
      state.roomType = action.payload.roomType;
    },
    // Reducer to handle Login
    setUser: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    // Reducer to handle Logout
    clearUser: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setRoom, setUser, clearUser } = userSlice.actions;

// Selectors
export const selectRoom = (state: RootState) => state.user;
export const selectUserInfo = (state: RootState) => state.user.userInfo;

export default userSlice.reducer;
