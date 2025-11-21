import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    idToken: "",
    userEmail: "",
  },
  reducers: {
    login(state, action) {
      const { token, email } = action.payload;
      state.isAuthenticated = true;
      state.idToken = token;
      state.userEmail = email;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.idToken = "";
      state.userEmail = "";
    },
    setIdToken(state, action) {
      state.idToken = action.payload;
    },
    setUserEmail(state, action) {
      state.userEmail = action.payload;
    },
  },
});

export const { login, logout, setIdToken, setUserEmail } = authSlice.actions;

export default authSlice.reducer;
