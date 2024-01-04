import React, { useState } from 'react';
import axios from 'axios';

function WorkoutForm({ onWorkoutCreated, existingWorkout }) {
  const [title, setTitle] = useState(existingWorkout?.title || '');
  const [description, setDescription] = useState(existingWorkout?.description || '');
  const [exercises, setExercises] = useState(existingWorkout?.exercises || [{ name: '', reps: '', rest: '' }]);

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', reps: '', rest: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || exercises.some(ex => !ex.name || !ex.reps || !ex.rest)) {
      alert('All fields are required, including for each exercise');
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
        setExercises([{ name: '', reps: '', rest: '' }]);
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

        <div>
          <label>Exercises:</label>
          {exercises.map((exercise, index) => (
            <div key={index}>
              <input 
                type="text" 
                placeholder="Exercise name"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Reps"
                value={exercise.reps}
                onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Rest (e.g., 30s)"
                value={exercise.rest}
                onChange={(e) => handleExerciseChange(index, 'rest', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addExercise}>Add Exercise</button>
        </div>

        <button type="submit">{existingWorkout ? 'Update' : 'Create'} Workout</button>
      </form>
    </div>
  );
}

export default WorkoutForm;
