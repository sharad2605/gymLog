import React from "react";

const ViewHistory = ({ exercise, close }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={close}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">{exercise.name} History</h2>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Sets</th>
              <th className="border p-2">Reps</th>
              <th className="border p-2">Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            {exercise.logs
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((log, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{log.date}</td>
                  <td className="border p-2">{log.sets}</td>
                  <td className="border p-2">{log.reps}</td>
                  <td className="border p-2">{log.weight}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={close}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewHistory;
