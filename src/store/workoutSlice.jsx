import { createSlice } from "@reduxjs/toolkit";

const workoutSlice = createSlice({
  name: "workouts",
  initialState: {
    list: [],
  },

  reducers: {
    setWorkouts(state, action) {
      state.list = action.payload; // Firebase se full data aa jayega
    },

    addWorkout(state, action) {
      state.list.push(action.payload);
    },

    updateWorkout(state, action) {
      const index = state.list.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    deleteWorkout(state, action) {
      state.list = state.list.filter(w => w.id !== action.payload);
    }
  }
});

export const { setWorkouts, addWorkout, updateWorkout, deleteWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;
