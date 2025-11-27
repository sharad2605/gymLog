import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setWorkouts, deleteWorkout, updateWorkout } from "../../store/workoutSlice";
import EditWorkout from "./EditWorkout";
import Pagination from "./Pagination";

const WorkoutList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workouts = useSelector((state) => state.workouts.list);

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    date: "",
    muscleGroup: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const [loading, setLoading] = useState(true);

  const firebaseUrl = "https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout.json";

  // 🔹 Fetch workouts
  useEffect(() => {
    const loadWorkouts = async () => {
      const res = await fetch(firebaseUrl);
      const data = await res.json();

      const email = localStorage.getItem("email");
      const sanitizedEmail = email?.replace(/\./g, ",");

      const arr = Object.entries(data || {})
        .filter(([id, w]) => w.user === sanitizedEmail)
        .map(([id, w]) => ({ id, ...w }));

      dispatch(setWorkouts(arr));
      setLoading(false);
    };
    loadWorkouts();
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  // 🔹 Filter workouts
  const filtered = workouts.filter((w) =>
    w.exercise.toLowerCase().includes(search.toLowerCase()) ||
    w.date.includes(search) ||
    w.sets.toString().includes(search) ||
    w.reps.toString().includes(search) ||
    w.weight.toString().includes(search)
  );

  // 🔹 Pagination
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  const currentWorkouts = filtered.slice(firstIndex, lastIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(filtered.length / perPage)) return;
    setCurrentPage(page);
  };

  // 🔹 Delete workout
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout?")) return;
    await fetch(`https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout/${id}.json`, { method: "DELETE" });
    dispatch(deleteWorkout(id));
  };

  // 🔹 Edit workout
  const handleEdit = (w) => {
    setEditId(w.id);
    setEditData(w);
  };

  const handleUpdate = async () => {
    await fetch(`https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout/${editId}.json`, {
      method: "PATCH",
      body: JSON.stringify(editData),
    });
    dispatch(updateWorkout({ id: editId, ...editData }));
    setEditId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 mt-10">📈 Workout Progress</h2>

      {/* Search */}
      <div className="flex justify-end mb-8">
        <div className="relative w-full max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workouts..."
            className="p-3 pl-10 w-full rounded-xl border border-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Workouts Table */}
      {filtered.length ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-3 text-left border border-gray-600">Exercise</th>
                <th className="p-3 text-left border border-gray-600">Muscle Group</th>
                <th className="p-3 text-left border border-gray-600">Sets x Reps</th>
                <th className="p-3 text-left border border-gray-600">Weight</th>
                <th className="p-3 text-left border border-gray-600">Date</th>
                <th className="p-3 text-left border border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentWorkouts.map((w) => (
                <tr key={w.id} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="p-3 border border-gray-400">{w.exercise}</td>
                  <td className="p-3 border border-gray-400">{w.muscleGroup}</td>
                  <td className="p-3 border border-gray-400">{w.sets} x {w.reps}</td>
                  <td className="p-3 border border-gray-400">{w.weight} kg</td>
                  <td className="p-3 border border-gray-400">{w.date}</td>
                  <td className="p-3 border border-gray-400 flex gap-2">
                    <button
                      className="bg-yellow-400 px-3 py-1 rounded-xl text-white hover:bg-yellow-500 hover:scale-105 transition"
                      onClick={() => handleEdit(w)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 px-3 py-1 rounded-xl text-white hover:bg-red-600 hover:scale-105 transition"
                      onClick={() => handleDelete(w.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {filtered.length >= perPage && (
            <div className="mt-6">
              <Pagination
                total={filtered.length}
                perPage={perPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">No workouts found 😔</p>
      )}

      {/* EditWorkout Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <EditWorkout
              editData={editData}
              setEditData={setEditData}
              handleUpdate={handleUpdate}
              cancelEdit={() => setEditId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
