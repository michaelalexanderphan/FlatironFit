import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import WorkoutForm from './WorkoutForm';

function WorkoutPlans() {
  const [userWorkouts, setUserWorkouts] = useState([]);
  const { user, token } = useContext(AuthContext);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [noWorkoutsMessage, setNoWorkoutsMessage] = useState('');

  useEffect(() => {
    const fetchUserWorkouts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/workouts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserWorkouts(response.data);
        if (response.data.length === 0) {
          setNoWorkoutsMessage(
            user?.role === 'client'
              ? 'No workouts currently assigned.'
              : 'No workouts created. Would you like to create one?'
          );
        }
      } catch (error) {
        console.error('Error fetching user workouts', error);
      }
    };

    fetchUserWorkouts();
  }, [user, token]);

  const handleWorkoutCreatedOrUpdated = (workout) => {
    setEditingWorkout(null);
    const updatedWorkouts = userWorkouts.map((w) => (w.id === workout.id ? workout : w));
    if (!updatedWorkouts.find(w => w.id === workout.id)) {
      updatedWorkouts.push(workout);
    }
    setUserWorkouts(updatedWorkouts);
  };

  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`http://localhost:5000/api/workouts/${workoutId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserWorkouts(userWorkouts.filter((workout) => workout.id !== workoutId));
      } catch (error) {
        console.error('Error deleting workout', error);
      }
    }
  };

  return (
    <div>
      {user && user.role === 'trainer' && (
        <button onClick={() => setEditingWorkout({})}>Create Workout Plan</button>
      )}
      {editingWorkout ? (
        <WorkoutForm
          existingWorkout={editingWorkout}
          onWorkoutCreatedOrUpdated={handleWorkoutCreatedOrUpdated}
          token={token}
        />
      ) : (
        <>
          {noWorkoutsMessage && <p>{noWorkoutsMessage}</p>}
          {userWorkouts.map((workout) => (
            <div key={workout.id}>
              <h3>{workout.title}</h3>
              <p>{workout.description}</p>
              {user && user.role === 'trainer' && (
                <>
                  <button onClick={() => handleEditClick(workout)}>Edit</button>
                  <button onClick={() => handleDelete(workout.id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default WorkoutPlans;
