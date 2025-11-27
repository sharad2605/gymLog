import { createSlice } from "@reduxjs/toolkit";

const storedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];

const workoutSlice = createSlice({
  name: "workouts",
  initialState: {
    list: storedWorkouts,
  },

  reducers: {
    setWorkouts(state, action) {
      state.list = action.payload;
      localStorage.setItem("workouts", JSON.stringify(action.payload));
    },

    addWorkout(state, action) {
      state.list.push(action.payload);
      localStorage.setItem("workouts", JSON.stringify(state.list));
    },

    updateWorkout(state, action) {
      const index = state.list.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      localStorage.setItem("workouts", JSON.stringify(state.list));
    },

    deleteWorkout(state, action) {
      state.list = state.list.filter(w => w.id !== action.payload);
      localStorage.setItem("workouts", JSON.stringify(state.list));
    }
  }
});

export const { setWorkouts, addWorkout, updateWorkout, deleteWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;
