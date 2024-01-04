import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import WorkoutForm from './WorkoutForm';

function WorkoutPlans() {
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState([]);
  const { user, token } = useContext(AuthContext);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedWorkoutDetails, setSelectedWorkoutDetails] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchUserWorkouts = async () => {
      const response = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserWorkouts(response.data);
    };

    const fetchClients = async () => {
      if (user?.role === 'trainer') {
        const response = await axios.get('http://localhost:5000/api/clients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      }
    };

    fetchUserWorkouts();
    fetchClients();
  }, [user, token]);

  const handleWorkoutClick = async (workoutId) => {
    const detailsResponse = await axios.get(`http://localhost:5000/api/workouts/${workoutId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelectedWorkoutDetails(detailsResponse.data);

    const workoutExercisesResponse = await axios.get(`http://localhost:5000/api/workouts/${workoutId}/workout_exercises`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const exerciseDetailsPromises = workoutExercisesResponse.data.map(exercise =>
      axios.get(`http://localhost:5000/api/exercises/${exercise.exercise_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    const exercisesDetailsResponses = await Promise.all(exerciseDetailsPromises);
    const exercisesWithDetails = exercisesDetailsResponses.map(response => response.data);
    setSelectedWorkoutExercises(exercisesWithDetails);
  };

  const handleWorkoutCreatedOrUpdated = (workout) => {
    const updatedWorkouts = userWorkouts.map((w) => (w.id === workout.id ? workout : w));
    setUserWorkouts(updatedWorkouts.find(w => w.id === workout.id) ? updatedWorkouts : [...updatedWorkouts, workout]);
    setSelectedWorkoutDetails(null);
    setEditingWorkout(null);
  };

  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
    setSelectedWorkoutDetails(null);
  };

  const handleDelete = async (workoutId) => {
    await axios.delete(`http://localhost:5000/api/workouts/${workoutId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserWorkouts(userWorkouts.filter((workout) => workout.id !== workoutId));
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
        />
      ) : (
        <>
          {userWorkouts.map((workout) => (
            <div key={workout.id}>
              <h3 onClick={() => handleWorkoutClick(workout.id)}>{workout.title}</h3>
              <button onClick={() => handleEditClick(workout)}>Edit</button>
              <button onClick={() => handleDelete(workout.id)}>Delete</button>
            </div>
          ))}
          {selectedWorkoutDetails && (
            <div>
              <h3>{selectedWorkoutDetails.title}</h3>
              <p>{selectedWorkoutDetails.description}</p>
              {selectedWorkoutExercises.map((exercise) => (
                <div key={exercise.id}>
                  <h4>{exercise.name}</h4>
                  <p>Reps: {exercise.reps}</p>
                  <p>Sets: {exercise.sets}</p>
                  <p>Rest: {exercise.rest} seconds</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WorkoutPlans;
