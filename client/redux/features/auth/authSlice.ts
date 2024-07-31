import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state) => {
      state.isLoggedIn = true;
    },
    userLoggedOut: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { userLoggedIn, userLoggedOut } =
  authSlice.actions;

export default authSlice.reducer;
