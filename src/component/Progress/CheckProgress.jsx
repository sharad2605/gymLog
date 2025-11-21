import React from 'react';
import './CheckProgress.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CheckProgress = () => {

  const allworkout = useSelector((state) => state.workouts.list);
  const uniqueGroups = [...new Set(allworkout.map((w) => w.muscleGroup))];
  const navigate = useNavigate();
  
const handleClick = (group) => {
  navigate(`/progress/${group}`);
};

  return (
    <div className="page-wrapper">
      <h3>Check Your Progress</h3>
      <div className="check-progress">
        {uniqueGroups.map((group, index) => (
          <div
            key={index}
            className="progress-item"
            onClick={() => handleClick(group)}
          >
            <h3>{group}</h3>
            <p>Click to see exercises</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CheckProgress;
