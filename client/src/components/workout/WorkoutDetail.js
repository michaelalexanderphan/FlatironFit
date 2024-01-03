import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WorkoutDetail({ workoutId }) {
  const [workoutDetail, setWorkoutDetail] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkoutDetail = async () => {
      try {
        const response = await axios.get(`/api/workouts/${workoutId}`);
        setWorkoutDetail(response.data);
      } catch (err) {
        setError('Failed to fetch workout details');
      }
    };
    fetchWorkoutDetail();
  }, [workoutId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!workoutDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Workout Details</h2>
      <p>Title: {workoutDetail.title}</p>
      <p>Description: {workoutDetail.description}</p>
      <p>Exercises: {workoutDetail.exercises}</p>
      {/* Add back button or link here */}
    </div>
  );
}

export default WorkoutDetail;
