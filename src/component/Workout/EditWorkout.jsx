import React from "react";

const EditWorkout = ({ editData, setEditData, handleUpdate, cancelEdit }) => {
  return (
    <div className="card p-4 mt-4 shadow-sm">
      <h4 className="text-center mb-3">✏️ Edit Workout</h4>
      <select
        className="form-select mb-2"
        value={editData.muscleGroup}
        onChange={(e) => setEditData({ ...editData, muscleGroup: e.target.value })}
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
      
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Exercise"
        value={editData.exercise}
        onChange={(e) => setEditData({ ...editData, exercise: e.target.value })}
      />
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Sets"
        value={editData.sets}
        onChange={(e) => setEditData({ ...editData, sets: e.target.value })}
      />
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Reps"
        value={editData.reps}
        onChange={(e) => setEditData({ ...editData, reps: e.target.value })}
      />
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Weight (kg)"
        value={editData.weight}
        onChange={(e) => setEditData({ ...editData, weight: e.target.value })}
      />
      <input
        type="date"
        className="form-control mb-3"
        value={editData.date}
        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
      />
      <div className="text-center">
        <button className="btn btn-success me-2" onClick={handleUpdate}>
          ✅ Update
        </button>
        <button className="btn btn-secondary" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditWorkout;
