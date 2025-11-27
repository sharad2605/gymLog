import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  idToken: localStorage.getItem("token") || "",
  userEmail: localStorage.getItem("email") || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, email } = action.payload;
      state.isAuthenticated = true;
      state.idToken = token;
      state.userEmail = email;

      // Save in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
    },

    logout(state) {
      state.isAuthenticated = false;
      state.idToken = "";
      state.userEmail = "";

      localStorage.removeItem("token");
      localStorage.removeItem("email");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
