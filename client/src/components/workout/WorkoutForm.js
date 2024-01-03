import React, { useState } from 'react';
import axios from 'axios';

function WorkoutForm({ onWorkoutCreated, existingWorkout }) {
  const [title, setTitle] = useState(existingWorkout?.title || '');
  const [description, setDescription] = useState(existingWorkout?.description || '');
  const [exercises, setExercises] = useState(existingWorkout?.exercises || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !exercises) {
      alert('All fields are required');
      return;
    }
    const workoutData = { title, description, exercises };
    const endPoint = existingWorkout ? `/api/workouts/${existingWorkout.id}` : '/api/workouts';
    const method = existingWorkout ? 'put' : 'post';
    axios[method](endPoint, workoutData)
      .then(response => {
        onWorkoutCreated(response.data);
        setTitle('');
        setDescription('');
        setExercises('');
      })
      .catch(error => {
        console.error('Error submitting workout:', error);
      });
  };

  return (
    <div>
      <h2>{existingWorkout ? 'Edit Workout Plan' : 'Create a New Workout Plan'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="description">Description:</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label htmlFor="exercises">Exercises:</label>
        <textarea id="exercises" value={exercises} onChange={(e) => setExercises(e.target.value)} />
        <button type="submit">{existingWorkout ? 'Update' : 'Create'} Workout</button>
      </form>
    </div>
  );
}

export default WorkoutForm;
