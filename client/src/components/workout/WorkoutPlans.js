import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WorkoutPlans() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setError('');

    const authToken = sessionStorage.getItem('authToken');
    axios.get('/api/workouts/workouts', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    .then(response => {
      setWorkouts(response.data);
    })
    .catch(error => {
      setError('Failed to fetch workouts');
      console.error('Error fetching workouts', error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Workout Plans</h2>
      {workouts.map((workout) => (
        <div key={workout.id}>
          <h3>{workout.title}</h3>
          {/* Render more details or actions for each workout */}
        </div>
      ))}
    </div>
  );
}

export default WorkoutPlans;
