import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addWorkout } from "../../store/workoutSlice";
import toast from "react-hot-toast";

const WorkoutForm = () => {
  const dispatch = useDispatch();
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!exercise || !sets || !reps || !weight || !date || !muscleGroup) {
      toast.error(" Please fill in all fields!");
      return;
    }
    if (Number(sets) <= 0 || Number(reps) <= 0 || Number(weight) <= 0) {
      toast.error(" Sets, Reps and Weight must be greater than 0!");
      return;
    }

    // Prepare data
    const userEmail = localStorage.getItem("email");
    const sanitizedEmail = userEmail?.replace(/\./g, ",");
    const payload = {
      user: sanitizedEmail,
      muscleGroup,
      exercise,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      date,
    };

    try {
      const res = await fetch(
        "https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout.json",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Network error!");

      const data = await res.json();

      // Dispatch to Redux
      dispatch(addWorkout({ id: data.name, ...payload }));

      toast.success("Workout added successfully!");

      // Reset form
      setExercise("");
      setSets("");
      setReps("");
      setWeight("");
      setDate("");
      setMuscleGroup("");
    } catch (err) {
      console.error("🔥 Error:", err);
      toast.error("Failed to add workout. Try again!");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">🏋️ Add Workout</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Muscle Group */}
        <div>
          <label className="block mb-1 font-medium">Muscle Group</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
          >
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

        {/* Exercise */}
        <div>
          <label className="block mb-1 font-medium">Exercise</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />
        </div>

        {/* Sets / Reps / Weight */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block mb-1 font-medium">Sets</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Reps</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Weight (kg)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Workout
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
