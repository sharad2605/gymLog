import { configureStore } from "@reduxjs/toolkit";
import workoutReducer from "./workoutSlice.jsx";
import authReducer  from "./authSlice.jsx";

const store = configureStore({
  reducer: {
    workouts: workoutReducer,
    auth: authReducer,
  },
});
export default store;