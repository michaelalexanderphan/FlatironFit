import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import WorkoutForm from './WorkoutForm';
import WorkoutDetail from './WorkoutDetail'; // Import if you have a detailed view component

function WorkoutPlans() {
  const [userWorkouts, setUserWorkouts] = useState([]);
  const { user, token } = useContext(AuthContext); 
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null); // For viewing workout details
  const [noWorkoutsMessage, setNoWorkoutsMessage] = useState('');

  useEffect(() => {
    const fetchUserWorkouts = async () => {
      try {
        const response = await axios.get('/api/workouts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserWorkouts(response.data);
        if (response.data.length === 0) {
          setNoWorkoutsMessage(user?.role === 'client' ? 'No workouts currently assigned.' : 'No workouts created. Would you like to create one?');
        }
      } catch (error) {
        console.error('Error fetching user workouts', error);
      }
    };

    fetchUserWorkouts();
  }, [user, token]);

  const handleWorkoutCreated = (newWorkout) => {
    setEditingWorkout(null);
    const updatedWorkouts = editingWorkout 
      ? userWorkouts.map(workout => workout.id === newWorkout.id ? newWorkout : workout)
      : [...userWorkouts, newWorkout];
    setUserWorkouts(updatedWorkouts);
  };

  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
    setSelectedWorkoutId(null); // Clear selected workout for detail view
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`/api/workouts/${workoutId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserWorkouts(userWorkouts.filter(workout => workout.id !== workoutId));
      } catch (error) {
        console.error('Error deleting workout', error);
      }
    }
  };

  const handleViewDetails = (workoutId) => {
    setSelectedWorkoutId(workoutId);
    setEditingWorkout(null); // Clear editing workout
  };

  return (
    <div>
      {user?.role === 'trainer' && (
        <div>
          <button onClick={() => setEditingWorkout({})}>Create Workout Plan</button>
        </div>
      )}
      {editingWorkout ? (
        <WorkoutForm existingWorkout={editingWorkout} onWorkoutCreated={handleWorkoutCreated} />
      ) : selectedWorkoutId ? (
        <WorkoutDetail workoutId={selectedWorkoutId} />
      ) : (
        <>
          {noWorkoutsMessage && <p>{noWorkoutsMessage}</p>}
          {userWorkouts.map(workout => (
            <div key={workout.id}>
              <h3>{workout.title}</h3>
              <p>{workout.description}</p>
              {user?.role === 'trainer' && (
                <>
                  <button onClick={() => handleEditClick(workout)}>Edit</button>
                  <button onClick={() => handleDelete(workout.id)}>Delete</button>
                </>
              )}
              <button onClick={() => handleViewDetails(workout.id)}>View Details</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default WorkoutPlans;
