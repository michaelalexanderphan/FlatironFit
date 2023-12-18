import React, { useEffect, useState } from 'react';
import { getWorkouts } from '../api'; // You'll need to create this API call function

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await getWorkouts(); // Fetch workouts from the backend
      setWorkouts(data);
    };

    fetchWorkouts();
  }, []);

  return (
    <div>
      {workouts.map(workout => (
        <div key={workout.id}>
          <h3>{workout.title}</h3>
          <p>{workout.description}</p>
          {/* ... */}
        </div>
      ))}
    </div>
  );
};

export default Workouts;
