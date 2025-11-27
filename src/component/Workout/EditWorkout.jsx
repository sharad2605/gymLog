import React from "react";

const EditWorkout = ({ editData, setEditData, handleUpdate, cancelEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-2xl font-bold text-center mb-5">✏️ Edit Workout</h3>

        {/* Muscle Group */}
        <select
          className="w-full mb-3 p-2 border rounded-lg"
          value={editData.muscleGroup}
          onChange={(e) =>
            setEditData({ ...editData, muscleGroup: e.target.value })
          }
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

        {/* Exercise */}
        <input
          type="text"
          placeholder="Exercise"
          className="w-full mb-3 p-2 border rounded-lg"
          value={editData.exercise}
          onChange={(e) =>
            setEditData({ ...editData, exercise: e.target.value })
          }
        />

        {/* Sets / Reps / Weight */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <input
            type="number"
            placeholder="Sets"
            className="p-2 border rounded-lg"
            value={editData.sets}
            onChange={(e) =>
              setEditData({ ...editData, sets: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Reps"
            className="p-2 border rounded-lg"
            value={editData.reps}
            onChange={(e) =>
              setEditData({ ...editData, reps: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            className="p-2 border rounded-lg"
            value={editData.weight}
            onChange={(e) =>
              setEditData({ ...editData, weight: e.target.value })
            }
          />
        </div>

        {/* Date */}
        <input
          type="date"
          className="w-full mb-5 p-2 border rounded-lg"
          value={editData.date}
          onChange={(e) =>
            setEditData({ ...editData, date: e.target.value })
          }
        />

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="bg-green-600 text-white px-5 py-2 rounded-xl"
            onClick={handleUpdate}
          >
            ✅ Update
          </button>
          <button
            className="bg-gray-400 text-white px-5 py-2 rounded-xl"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkout;
