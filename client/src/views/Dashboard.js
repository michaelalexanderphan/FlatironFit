import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/workouts', {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts', error);
        // Handle error, e.g., redirect to login if the token is invalid
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const handleNewWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkoutTitle) return; // Simple validation

    try {
      const response = await axios.post(
        '/api/workouts',
        { title: newWorkoutTitle },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` } }
      );
      if (response.status === 201) {
        setWorkouts([...workouts, response.data]);
        setNewWorkoutTitle('');
      }
    } catch (error) {
      console.error('Error creating a new workout', error);
      // Handle error, e.g., show a notification
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {user ? user.username : 'Guest'}!</h2>

      {user && user.role === 'trainer' && (
        <div>
          <h3>Create New Workout Plan</h3>
          <form onSubmit={handleNewWorkout}>
            <input
              type="text"
              value={newWorkoutTitle}
              onChange={(e) => setNewWorkoutTitle(e.target.value)}
              placeholder="Enter workout title"
              required
            />
            <button type="submit">Add Workout</button>
          </form>
        </div>
      )}

      <div>
        <h3>Your Workout Plans</h3>
        {isLoading ? (
          <p>Loading workouts...</p>
        ) : workouts.length ? (
          <ul>
            {workouts.map(workout => (
              <li key={workout.id}>{workout.title}</li>
            ))}
          </ul>
        ) : (
          <p>No workouts found. Start by creating a new plan.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
