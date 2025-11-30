import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWorkouts, deleteWorkout, updateWorkout } from "../../store/workoutSlice";
import EditWorkout from "./EditWorkout";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const WorkoutList = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.workouts.list);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  // ✔ Fetch workouts
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const res = await fetch(firebaseUrl);
        const data = await res.json();

        const email = localStorage.getItem("email");
        const sanitized = email?.replace(/\./g, ",");

        const arr = Object.entries(data || {})
          .filter(([id, w]) => w.user === sanitized)
          .map(([id, w]) => ({ id, ...w }));

        dispatch(setWorkouts(arr));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  // ✔ Search filter
  const filtered = workouts.filter((w) =>
    w.exercise.toLowerCase().includes(search.toLowerCase()) ||
    w.date.includes(search) ||
    w.sets.toString().includes(search) ||
    w.reps.toString().includes(search) ||
    w.weight.toString().includes(search)
  );

  // ✔ Pagination
  const last = currentPage * perPage;
  const first = last - perPage;
  const current = filtered.slice(first, last);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(filtered.length / perPage)) {
      setCurrentPage(page);
    }
  };

  // ✔ Delete (after confirmation)
  const finalDelete = async (id) => {
    await fetch(
      `https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout/${id}.json`,
      { method: "DELETE" }
    );

    dispatch(deleteWorkout(id));
    toast.success("Workout deleted!");
    setConfirmDelete(null);
  };

  // ✔ Open Edit Modal
  const handleEdit = (w) => {
    setEditId(w.id);
    setEditData(w);
  };

  // ✔ Update
  const handleUpdate = async () => {
    await fetch(
      `https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout/${editId}.json`,
      { method: "PATCH", body: JSON.stringify(editData) }
    );

    dispatch(updateWorkout({ id: editId, ...editData }));
    toast.success("Updated successfully!");
    setEditId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 mt-10">📈 Workout Progress</h2>

      {/* Search */}
      <div className="flex justify-between mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workouts..."
          className="p-3 pl-10 w-full max-w-sm rounded-xl border border-gray-800 shadow"
        />

        <button
          onClick={() => navigate("/workouts/add")}
          className="bg-green-600 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition-all"
        >
          Add Workout
        </button>
      </div>

      {/* Workout Table */}
      {filtered.length ? (
       <div className="w-full overflow-hidden rounded-xl border shadow-sm">

  {/* DESKTOP TABLE */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full border-collapse">
      <thead className="bg-gray-900 text-white">
        <tr>
          <th className="p-3 border text-left">Exercise</th>
          <th className="p-3 border text-left">Muscle</th>
          <th className="p-3 border text-left">Sets × Reps</th>
          <th className="p-3 border text-left">Weight</th>
          <th className="p-3 border text-left">Date</th>
          <th className="p-3 border text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {current.map((w) => (
          <tr key={w.id} className="hover:bg-gray-100 border-b odd:bg-gray-50">
            <td className="p-3 border">{w.exercise}</td>
            <td className="p-3 border">{w.muscleGroup}</td>
            <td className="p-3 border">{w.sets} × {w.reps}</td>
            <td className="p-3 border">{w.weight} kg</td>
            <td className="p-3 border">{w.date}</td>
            <td className="p-3 border">
              <div className="flex gap-2">
                <button
                  className="bg-yellow-400 px-3 py-1 rounded text-black"
                  onClick={() => handleEdit(w)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 px-3 py-1 rounded text-white"
                  onClick={() => setConfirmDelete(w.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
{filtered.length > perPage && (
  <Pagination
    total={filtered.length}
    perPage={perPage}
    currentPage={currentPage}
    onPageChange={handlePageChange}
  />
)}

  {/* MOBILE CARD VIEW */}
  <div className="md:hidden space-y-4 p-2">
    {current.map((w) => (
      <div key={w.id} className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{w.exercise}</h3>
          <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded">
            {w.muscleGroup}
          </span>
        </div>

        <div className="mt-2 text-gray-700">
          <p><b>Sets × Reps:</b> {w.sets} × {w.reps}</p>
          <p><b>Weight:</b> {w.weight} kg</p>
          <p className="text-gray-500 text-sm">{w.date}</p>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            className="w-full bg-yellow-400 px-3 py-2 rounded text-black"
            onClick={() => handleEdit(w)}
          >
            Edit
          </button>
          <button
            className="w-full bg-red-500 px-3 py-2 rounded text-white"
            onClick={() => setConfirmDelete(w.id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">No workouts found 😔</p>
      )}

      {/* Edit Modal */}
      {editId && (
        <EditWorkout
          editData={editData}
          setEditData={setEditData}
          handleUpdate={handleUpdate}
          cancelEdit={() => setEditId(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">This workout will be permanently deleted.</p>

            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-5 py-2 rounded-lg"
                onClick={() => finalDelete(confirmDelete)}
              >
                Yes, Delete
              </button>

              <button
                className="bg-gray-400 text-white px-5 py-2 rounded-lg"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkoutList;
