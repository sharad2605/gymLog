// ProgressHistory.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import './History.css'; // Tailwind/Custom CSS
import { useDispatch } from "react-redux";
import { setWorkouts } from "../../store/workoutSlice";


// Example icons (replace with SVG or image URLs)
// const muscleIcons = {
//   Chest:  "/images/chest.png",
//   Back: "https://cdn-icons-png.flaticon.com/512/1234/back.png",
//   Legs: "https://cdn-icons-png.flaticon.com/512/1234/legs.png",
//   Arms: "https://cdn-icons-png.flaticon.com/512/1234/arms.png",
//   Shoulders: "https://cdn-icons-png.flaticon.com/512/1234/shoulders.png",
//   Core: "https://cdn-icons-png.flaticon.com/512/1234/core.png",
//   FullBody: "https://cdn-icons-png.flaticon.com/512/1234/fullbody.png",
// };

const History = () => {
  const allworkout = useSelector(state => state.workouts.list);
  const uniqueGroups = [...new Set(allworkout.map(w => w.muscleGroup))];

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const handleGroupClick = (group) => {
    const exercises = allworkout.filter(w => w.muscleGroup === group);
    setHistoryData(exercises.sort((a,b) => new Date(b.date) - new Date(a.date)));
    setSelectedGroup(group);
    setShowHistory(true);
  };

  const getPR = (group) => {
    const logs = allworkout.filter(w => w.muscleGroup === group);
    return Math.max(...logs.map(l => l.weight || 0));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">Your Muscle Progress</h2>

      {/* Muscle Group Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {uniqueGroups.map((group, i) => (
          <div
            key={i}
            className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center transition"
            onClick={() => handleGroupClick(group)}
          >
            {/* <div className="text-6xl mb-4">{muscleIcons[group] || "💪"}</div> */}
            <h3 className="text-xl font-semibold mb-2">{group}</h3>
            <p className="text-gray-500 font-medium">🔥 PR: {getPR(group)} kg</p>
          </div>
        ))}
      </div>

      {/* HISTORY MODAL */}
      {showHistory && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 overflow-y-auto pt-24"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">{selectedGroup} — History</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border border-gray-300">Date</th>
                    <th className="p-3 border border-gray-300">Exercise</th>
                    <th className="p-3 border border-gray-300">Sets</th>
                    <th className="p-3 border border-gray-300">Reps</th>
                    <th className="p-3 border border-gray-300">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300">{h.date}</td>
                      <td className="p-2 border border-gray-300">{h.exercise}</td>
                      <td className="p-2 border border-gray-300">{h.sets}</td>
                      <td className="p-2 border border-gray-300">{h.reps}</td>
                      <td className="p-2 border border-gray-300">{h.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowHistory(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
