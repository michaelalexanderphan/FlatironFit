import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import WorkoutForm from './WorkoutForm';

function WorkoutPlans() {
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const { user, token } = useContext(AuthContext);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedWorkoutDetails, setSelectedWorkoutDetails] = useState(null);
  const [noWorkoutsMessage, setNoWorkoutsMessage] = useState('');
  const [clients, setClients] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);

  useEffect(() => {
    if (token) {
      fetchUserWorkouts();
      if (user?.role === 'trainer') {
        fetchClients();
      }
      fetchAvailableExercises();
    }
  }, [user, token]);

  const fetchUserWorkouts = async () => {
    const response = await axios.get('http://localhost:5000/api/workouts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserWorkouts(response.data);

    if (response.data.length === 0) {
      setNoWorkoutsMessage(
        user?.role === 'trainer'
          ? 'No workouts created. Would you like to create one?'
          : 'No workouts currently assigned!'
      );
    } else {
      setNoWorkoutsMessage('');
    }
  };

  const fetchClients = async () => {
    const response = await axios.get('http://localhost:5000/api/clients', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClients(response.data);
  };

  const fetchAvailableExercises = async () => {
    const response = await axios.get('http://localhost:5000/api/exercises', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAvailableExercises(response.data);
  };

  const handleWorkoutCreatedOrUpdated = (workout) => {
    setEditingWorkout(null);
    const updatedWorkouts = userWorkouts.map((w) => (w.id === workout.id ? workout : w));
    setUserWorkouts(
      updatedWorkouts.find((w) => w.id === workout.id) ? updatedWorkouts : [...updatedWorkouts, workout]
    );
    setSelectedWorkoutDetails(null);
  };

  const handleWorkoutClick = async (workout) => {
    setSelectedWorkoutDetails(workout);
    const exercisesResponse = await axios.get(`http://localhost:5000/api/workouts/${workout.id}/exercises`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWorkoutExercises(exercisesResponse.data);
  };

  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
    setSelectedWorkoutDetails(null);
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      await axios.delete(`http://localhost:5000/api/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserWorkouts(userWorkouts.filter((workout) => workout.id !== workoutId));
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
          clients={clients}
          availableExercises={availableExercises}
        />
      ) : (
        <>
          {noWorkoutsMessage && <p>{noWorkoutsMessage}</p>}
          {userWorkouts.map((workout) => (
            <div key={workout.id} onClick={() => handleWorkoutClick(workout)}>
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
          {selectedWorkoutDetails && (
            <div>
              <h3>{selectedWorkoutDetails.title}</h3>
              <p>{selectedWorkoutDetails.description}</p>
              <ul>
                {workoutExercises.map((exercise) => (
                  <li key={exercise.id}>
                    {exercise.name} - Reps: {exercise.reps} Sets: {exercise.sets}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WorkoutPlans;
