import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WorkoutForm({ existingWorkout, onWorkoutCreatedOrUpdated, token, userRoles, clients, availableExercises }) {
  const [workoutData, setWorkoutData] = useState({
    title: '',
    description: '',
    exercises: [{ exercise_id: '', reps: '', sets: '', rest_duration: '' }],
    client_id: '',
  });

  useEffect(() => {
    if (existingWorkout) {
      setWorkoutData({
        ...existingWorkout,
        exercises: existingWorkout.exercises || [{ exercise_id: '', reps: '', sets: '', rest_duration: '' }]
      });
    }
  }, [existingWorkout]);

  const handleInputChange = (index, field, value) => {
    const newWorkoutData = { ...workoutData };
    newWorkoutData.exercises[index][field] = value;
    setWorkoutData(newWorkoutData);
  };

  const addExercise = () => {
    const newWorkoutData = { ...workoutData };
    newWorkoutData.exercises.push({ exercise_id: '', reps: '', sets: '', rest_duration: '' });
    setWorkoutData(newWorkoutData);
  };

  const removeExercise = (index) => {
    const newWorkoutData = { ...workoutData };
    newWorkoutData.exercises.splice(index, 1);
    setWorkoutData(newWorkoutData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = existingWorkout?.id ? `http://localhost:5000/api/workouts/${existingWorkout.id}` : 'http://localhost:5000/api/workouts';
    const method = existingWorkout?.id ? 'put' : 'post';

    try {
      const response = await axios({
        method,
        url: endpoint,
        data: workoutData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      onWorkoutCreatedOrUpdated(response.data);
      if (!existingWorkout) {
        setWorkoutData({
          title: '',
          description: '',
          exercises: [{ exercise_id: '', reps: '', sets: '', rest_duration: '' }],
          client_id: '',
        });
      }
    } catch (error) {
      console.error('Error submitting workout', error.response || error);
    }
  };

  return (
    <div>
      <h2>{existingWorkout ? 'Edit Workout Plan' : 'Create a New Workout Plan'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={workoutData.title}
          onChange={(e) => setWorkoutData({ ...workoutData, title: e.target.value })}
        />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={workoutData.description}
          onChange={(e) => setWorkoutData({ ...workoutData, description: e.target.value })}
        />
        {workoutData.exercises.map((exercise, index) => (
          <div key={index}>
            <select
              value={exercise.exercise_id}
              onChange={(e) => handleInputChange(index, 'exercise_id', e.target.value)}
            >
              <option value="">Select Exercise</option>
              {availableExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Reps (e.g., 8-12)"
              value={exercise.reps}
              onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
            />
            <input
              type="text"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) => handleInputChange(index, 'sets', e.target.value)}
            />
            <input
              type="text"
              placeholder="Rest (e.g., 30s)"
              value={exercise.rest_duration}
              onChange={(e) => handleInputChange(index, 'rest_duration', e.target.value)}
            />
            <button type="button" onClick={() => removeExercise(index)}>Remove Exercise</button>
          </div>
        ))}
        <button type="button" onClick={addExercise}>Add Exercise</button>
        {Array.isArray(userRoles) && userRoles.includes('Client') && clients && (
          <div>
            <label htmlFor="client">Assign to Client:</label>
            <select
              id="client"
              value={workoutData.client_id}
              onChange={(e) => setWorkoutData({ ...workoutData, client_id: e.target.value })}
            >
              <option value="">Select a Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.username}</option>
              ))}
            </select>
          </div>
        )}
        <button type="submit">{existingWorkout ? 'Update' : 'Create'} Workout</button>
      </form>
    </div>
  );  
}

export default WorkoutForm;
