import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setWorkouts, deleteWorkout, updateWorkout } from "../../store/workoutSlice";
import WorkoutTable from "./WorkoutTable";
import EditWorkout from "./EditWorkout";
import SearchWorkout from "./SearchWorkout";
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
  const perPage = 5;
  const [loading, setLoading] = useState(true);

  const firebaseUrl = "https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout.json";

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

  if (loading) return <p>Loading...</p>;

  const filtered = workouts.filter((w) =>
    w.exercise.toLowerCase().includes(search.toLowerCase()) ||
    w.date.includes(search) ||
    w.sets.toString().includes(search) ||
    w.reps.toString().includes(search) ||
    w.weight.toString().includes(search)
  );

  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  const currentWorkouts = filtered.slice(firstIndex, lastIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(filtered.length / perPage)) return;
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await fetch(`https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout/${id}.json`, { method: "DELETE" });
    dispatch(deleteWorkout(id));
  };

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
    <div className="container mt-5 pt-5">
      <h2 className="text-center mb-4">📈 Workout Progress</h2>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <SearchWorkout search={search} setSearch={setSearch} />
        <div>
          <button className="btn btn-danger btn-sm" onClick={() => navigate("/add")}>
            Add Workout
          </button>
          <button className="btn btn-success btn-sm ms-2" onClick={() => navigate("/check")}>
            Check Progress
          </button>
        </div>
      </div>

      {filtered.length ? (
        <>
          <WorkoutTable workouts={currentWorkouts} onEdit={handleEdit} onDelete={handleDelete} />
          <Pagination total={filtered.length} perPage={perPage} currentPage={currentPage} onPageChange={handlePageChange} />
        </>
      ) : (
        <p className="text-center fs-5">No workouts found 😔</p>
      )}

      {editId && <EditWorkout editData={editData} setEditData={setEditData} handleUpdate={handleUpdate} cancelEdit={() => setEditId(null)} />}
    </div>
  );
};

export default WorkoutList;
