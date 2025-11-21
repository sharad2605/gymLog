import React from "react";

const WorkoutTable = ({ workouts, onEdit, onDelete }) => {
  return (
    <table className="table table-bordered text-center shadow-sm">
      <thead className="table-dark">
        <tr>
          <th>Date</th>
          <th>Muscle Group</th>
          <th>Exercise</th>
          <th>Sets</th>
          <th>Reps</th>
          <th>Weight (kg)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {workouts.map((w) => (
          <tr key={w.id}>
            <td>{w.date}</td>
            <td>{w.muscleGroup}</td>
            <td>{w.exercise}</td>
            <td>{w.sets}</td>
            <td>{w.reps}</td>
            <td>{w.weight}</td>
            <td>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => onEdit(w)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(w.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkoutTable;
