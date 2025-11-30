import React, { useState } from "react";
import WorkoutForm from "./WorkoutForm";
import WorkoutList from "./WorkoutList";

const WorkoutPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-4">

      {/* Collapsible Form */}
      
      {/* Workout List */}
      <WorkoutList />

    </div>
  );
};

export default WorkoutPage;
