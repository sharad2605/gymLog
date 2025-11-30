import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setWorkouts } from "../../store/workoutSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workouts = useSelector((state) => state.workouts.list);
  const [loading, setLoading] = useState(true);

  const firebaseUrl =
    "https://gymlog-46d79-default-rtdb.firebaseio.com/addworkout.json";

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const res = await fetch(firebaseUrl);
        const data = await res.json();

        const email = localStorage.getItem("email");
        const sanitizedEmail = email?.replace(/\./g, ",");

        const arr = Object.entries(data || {})
          .filter(([id, w]) => w.user === sanitizedEmail)
          .map(([id, w]) => ({ id, ...w }));

        dispatch(setWorkouts(arr));
      } catch (err) {
        console.error("Error fetching workouts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [dispatch]);

  // 🔹 Streak calculation
  const calculateStreak = (list) => {
    if (!list.length) return 0;
    const dates = [...new Set(list.map((w) => w.date))].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    let count = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const curr = new Date(dates[i]);
      const next = new Date(dates[i + 1]);
      const diff =
        (curr.setHours(0, 0, 0, 0) - next.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24);
      if (diff === 1) count++;
      else break;
    }
    return count;
  };

  const totalWorkouts = workouts.length;
  const highestPR = workouts.length
    ? workouts.reduce((max, curr) => (curr.weight > max.weight ? curr : max))
    : null;

  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl m-5 font-bold mb-6">Dashboard</h2>

      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Total Workouts</h3>
          <p className="text-4xl font-bold text-yellow-400">{totalWorkouts}</p>
        </div>

        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Personal Record</h3>
          {highestPR ? (
            <>
              <p className="text-lg">{highestPR.exercise}</p>
              <p className="text-3xl font-bold text-yellow-400">{highestPR.weight} kg</p>
            </>
          ) : (
            <p className="text-3xl font-bold text-yellow-400">—</p>
          )}
        </div>

        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Streak</h3>
          <p className="text-4xl font-bold text-yellow-400">{calculateStreak(workouts)} Days</p>
        </div>
      </div>

     

      {/* 🔹 Recent Workouts Table */}
      <h3 className="text-xl font-semibold mb-3">Recent Workouts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
      {recentWorkouts.map((w) => (
    <div key={w.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{w.exercise}</h3>
      <p className="text-sm text-gray-500">{w.muscleGroup}</p>
      <p> Sets: {w.sets} | Reps: {w.reps} | Weight: {w.weight}kg</p>
      <p className="text-sm text-gray-400 mt-1"> {w.date}</p>
    </div>
  ))}
</div>
    </div>
  );
};

export default Dashboard;
