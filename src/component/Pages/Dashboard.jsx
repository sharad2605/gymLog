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

  // 🔥 Fetch only logged-in user's workouts
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
    .slice(0, 5);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center bg-light shadow-sm p-3" style={{ minHeight: "150px" }}>
            <h5>🔥 Streak</h5>
            <h3 className="mt-3">{calculateStreak(workouts)} days</h3>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center bg-light shadow-sm p-3" style={{ minHeight: "150px" }}>
            <h5>🏋️ Personal Record</h5>
            {highestPR ? (
              <>
                <h4 className="mt-2">{highestPR.exercise}</h4>
                <h3>{highestPR.weight} kg</h3>
              </>
            ) : (
              <h3 className="mt-3">No PR yet</h3>
            )}
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center bg-light shadow-sm p-3" style={{ minHeight: "150px" }}>
            <h5>📊 Total Workouts</h5>
            <h3 className="mt-3">{totalWorkouts}</h3>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button className="btn btn-primary me-2" onClick={() => navigate("/add")}>
          Add Workout
        </button>
        <button className="btn btn-success me-2" onClick={() => navigate("/view")}>
          View Workouts
        </button>
        <button className="btn btn-warning" onClick={() => navigate("/check")}>
          Check Progress
        </button>
      </div>

      <h5>Recent Workouts</h5>
      {recentWorkouts.length ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Muscle Group</th>
                <th>Exercise</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight (kg)</th>
              </tr>
            </thead>
            <tbody>
              {recentWorkouts.map((w) => (
                <tr key={w.id}>
                  <td>{w.date}</td>
                  <td>{w.muscleGroup}</td>
                  <td>{w.exercise}</td>
                  <td>{w.sets}</td>
                  <td>{w.reps}</td>
                  <td>{w.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No recent workouts 😔</p>
      )}
    </div>
  );
};

export default Dashboard;
