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
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (token) {
      if (user?.role === 'trainer') {
        fetchClients();
        fetchTrainerWorkouts();
      } else {
        fetchClientWorkouts();
      }
      fetchAvailableExercises();
    }
  }, [user, token]);

  const fetchTrainerWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts', error.response || error);
    }
  };

  const fetchClientWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user_workouts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching assigned workouts', error.response || error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients', error.response || error);
    }
  };

  const fetchAvailableExercises = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exercises', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises', error.response || error);
    }
  };

  const handleWorkoutCreatedOrUpdated = workout => {
    setEditingWorkout(null);
    fetchTrainerWorkouts();
  };

  const handleWorkoutClick = async workout => {
    try {
      const exercisesResponse = await axios.get(`http://localhost:5000/api/workouts/${workout.id}/exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedWorkoutDetails({ ...workout, exercises: exercisesResponse.data || [] });
    } catch (error) {
      console.error('Error fetching workout exercises', error.response || error);
    }
  };

  const handleEditClick = workout => {
    setEditingWorkout(workout);
    setSelectedWorkoutDetails(null);
  };

  const handleDelete = async workoutId => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrainerWorkouts();
    } catch (error) {
      console.error('Error deleting workout', error.response || error);
    }
  };

  return (
    <div>
      {user && user.role === 'trainer' && <button onClick={() => setEditingWorkout({})}>Create Workout Plan</button>}
      {editingWorkout ? (
        <WorkoutForm
          existingWorkout={editingWorkout}
          onWorkoutCreatedOrUpdated={handleWorkoutCreatedOrUpdated}
          token={token}
          clients={clients}
          availableExercises={availableExercises}
        />
      ) : (
        <div>
          {userWorkouts.length === 0 && <p>No workouts available.</p>}
          {userWorkouts.map(workout => (
            <div key={workout.id} onClick={() => handleWorkoutClick(workout)}>
              <h3>{workout.title}</h3>
              <p>{workout.description}</p>
              {selectedWorkoutDetails && selectedWorkoutDetails.id === workout.id && (
                <ul>
                  {selectedWorkoutDetails.exercises.map(exercise => (
                    <li key={exercise.id}>{exercise.name} - Reps: {exercise.reps} Sets: {exercise.sets}</li>
                  ))}
                </ul>
              )}
              {user && user.role === 'trainer' && (
                <>
                  <button onClick={() => handleEditClick(workout)}>Edit</button>
                  <button onClick={() => handleDelete(workout.id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutPlans;
