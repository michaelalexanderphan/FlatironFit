import React, { useState } from 'react';
import axios from 'axios';

function WorkoutForm({ onWorkoutCreatedOrUpdated, existingWorkout, token }) {
  const [title, setTitle] = useState(existingWorkout?.title || '');
  const [description, setDescription] = useState(existingWorkout?.description || '');
  const [exercises, setExercises] = useState(existingWorkout?.exercises || []);

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
    if (!title || !description || exercises.some(ex => !ex.exercise_name || ex.reps === '' || ex.sets === '' || ex.rest_duration === '')) {
      alert('All fields are required, including for each exercise');
      return;
    }
    const workoutData = { title, description, exercises };
    const endpoint = existingWorkout?.id ? `http://localhost:5000/api/workouts/${existingWorkout.id}` : 'http://localhost:5000/api/workouts';
    const method = existingWorkout?.id ? 'put' : 'post';

    try {
      const response = await axios({
        method: method,
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
    } catch (error) {
      console.error('Error submitting workout:', error);
    }
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
        <button type="submit">{existingWorkout ? 'Update' : 'Create'} Workout</button>
      </form>
    </div>
  );
}

export default WorkoutForm;
