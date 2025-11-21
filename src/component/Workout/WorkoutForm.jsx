  import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addWorkout } from "../../store/workoutSlice";

  const WorkoutForm = () => {
    const [exercise, setExercise] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const workouts = useSelector(state => state.workouts.list);
    const dispatch = useDispatch();


    

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!exercise || !sets || !reps || !weight || !date || !muscleGroup) {
    setError("⚠️ Please fill in all fields before submitting!");
    return;
  }

  if (sets <= 0 || reps <= 0 || weight <= 0) {
    setError("⚠️ Sets, Reps and Weight must be greater than 0!");
    return;
  }

  setError("");

  const userEmail = localStorage.getItem("email");
  const sanitizedEmail = userEmail.replace(/\./g, ",");

  const url = "https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout.json";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: sanitizedEmail,
        muscleGroup,
        exercise,
        sets,
        reps,
        weight,
        date
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Success:", data);

    dispatch(addWorkout({
      id: data.name,
      user: sanitizedEmail,
      muscleGroup,
      exercise,
      sets,
      reps,
      weight,
      date
    }));

    alert("Workout added successfully!");
  } catch (error) {
    console.error("🔥 Error:", error);
  }

  setExercise("");
  setSets("");
  setReps("");
  setWeight("");
  setDate("");
  setMuscleGroup("");
};

    

    return (
      <>
  <h2 className="text-center mt-5 pt-4" >🏋️ Add Workout</h2>

      <form className="mt-4" onSubmit={handleSubmit} >
        <div className="container mt-5 pt-5 p-4 border bg-light rounded shadow-sm">
          {/* 🔹 Error Message Display */}
          {error && (
            <p className="text-danger text-center fw-bold mb-3">{error}</p>
          )}

          <div className="mb-3">
            <label>Choose Muscle Group</label>
            <select className="form-select" 
            value={muscleGroup} 
            onChange={(e) => setMuscleGroup(e.target.value)}>
              <option value="">Select Muscle Group</option>
              <option value="Full Body">Full Body</option>
              <option value="Chest">Chest</option>
              <option value="Shoulder">Shoulder</option>
              <option value="Back">Back</option>
              <option value="Legs">Legs</option>
              <option value="Arms">Arms</option>
              <option value="Core">Core</option>
            </select>
            
          </div>

          <div className="mb-3">
            <label>Exercise Name</label>
            <input
              type="text"
              className="form-control"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Sets</label>
            <input
              type="number"
              className="form-control"
              max={5}
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Reps</label>
            <input
              type="number"
              className="form-control"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Weight (kg)</label>
            <input
              type="number"
              className="form-control"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>


          <div className="text-center">
            <button type="submit" className="btn btn-primary px-5">
              Add Workout
            </button>
          </div>
        </div>
      </form>
      </>
    );
  };

  export default WorkoutForm;
