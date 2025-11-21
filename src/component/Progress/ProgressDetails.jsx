import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import './ProgressDetails.css';

const ProgressDetails = () => {
  const { group } = useParams();
  const allworkout = useSelector(state => state.workouts.list);

  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // Filter exercises of this muscle group
  const exercises = allworkout.filter(w => w.muscleGroup === group);

  // Unique exercises
  const uniqueExercises = [...new Set(exercises.map(e => e.exercise))];

  const getPR = (exerciseName) => {
    const logs = exercises.filter(e => e.exercise === exerciseName);
    return Math.max(...logs.map(l => l.weight || 0));
  };

  const openHistory = (exerciseName) => {
    const logs = exercises
      .filter(e => e.exercise === exerciseName)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setHistoryData(logs);
    setShowHistory(true);
  };

  return (
    <div className="exercise-wrapper pt-20 mt-5">
      <h2>{group} Workouts</h2>

      <div className="exercise-grid">
        {uniqueExercises.map((ex, i) => (
          <div
            key={i}
            className="exercise-card"
            onClick={() => openHistory(ex)}
          >
            <h3>{ex}</h3>
            <p className="pr">🔥 PR: {getPR(ex)} kg</p>
            <p className="view-history">Click to see history →</p>
          </div>
        ))}
      </div>

      {/* HISTORY MODAL */}
      {/* HISTORY MODAL */}
{showHistory && (
  <div className="modal-overlay" onClick={() => setShowHistory(false)}>
    <div className="history-modal" onClick={(e) => e.stopPropagation()}>
      
      <h3 className="modal-title mb-3">
        {historyData[0]?.exercise} — History
      </h3>

      <div className="table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Weight (kg)</th>
            </tr>
          </thead>

          <tbody>
            {historyData.map((h, i) => (
              <tr key={i}>
                <td>{h.date}</td>
                <td>{h.sets}</td>
                <td>{h.reps}</td>
                <td>{h.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="close-btn" onClick={() => setShowHistory(false)}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ProgressDetails;
