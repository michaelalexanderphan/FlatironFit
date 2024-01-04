import React, { useState } from 'react';
import axios from 'axios';

function WorkoutForm({ existingWorkout, onWorkoutCreatedOrUpdated, token, clients }) {
  const [title, setTitle] = useState(existingWorkout?.title || '');
  const [description, setDescription] = useState(existingWorkout?.description || '');
  const [exercises, setExercises] = useState(existingWorkout?.exercises || []);
  const [selectedClientId, setSelectedClientId] = useState(existingWorkout?.client_id || '');

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { exercise_name: '', reps: '', sets: '', rest_duration: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workoutData = { title, description, exercises, client_id: selectedClientId };
    const endpoint = existingWorkout?.id ? `http://localhost:5000/api/workouts/${existingWorkout.id}` : 'http://localhost:5000/api/workouts';
    const method = existingWorkout?.id ? 'put' : 'post';

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
    setTitle('');
    setDescription('');
    setExercises([]);
    setSelectedClientId('');
  };

  return (
    <div>
      <h2>{existingWorkout ? 'Edit Workout Plan' : 'Create a New Workout Plan'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="description">Description:</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div>
          {exercises.map((exercise, index) => (
            <div key={index}>
              <input 
                type="text" 
                placeholder="Exercise name"
                value={exercise.exercise_name}
                onChange={(e) => handleExerciseChange(index, 'exercise_name', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Reps (e.g., 8-12)"
                value={exercise.reps}
                onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Sets"
                value={exercise.sets}
                onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Rest (e.g., 30s)"
                value={exercise.rest_duration}
                onChange={(e) => handleExerciseChange(index, 'rest_duration', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addExercise}>Add Exercise</button>
        </div>
        {clients && (
          <div>
            <label htmlFor="client">Assign to Client:</label>
            <select
              id="client"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              <option value="">Select a Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.username}
                </option>
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
