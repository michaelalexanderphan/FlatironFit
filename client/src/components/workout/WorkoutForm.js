import React, { useState } from 'react';
import axios from 'axios';

function WorkoutForm({ existingWorkout, onWorkoutCreatedOrUpdated, token, clients, availableExercises }) {
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
    setExercises([...exercises, { exercise_id: '', reps: '', sets: '', rest_duration: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workoutData = {
      title,
      description,
      exercises: exercises.map(exercise => ({
        exercise_id: exercise.exercise_id,
        reps: exercise.reps,
        sets: exercise.sets,
        rest: exercise.rest_duration
      })),
      client_id: selectedClientId
    };
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
    } catch (error) {
      console.error('Error submitting workout', error.response || error);
    }
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
        {exercises.map((exercise, index) => (
          <div key={index}>
            <select value={exercise.exercise_id} onChange={(e) => handleExerciseChange(index, 'exercise_id', e.target.value)}>
              <option value="">Select Exercise</option>
              {availableExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
            <input type="text" placeholder="Reps (e.g., 8-12)" value={exercise.reps} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} />
            <input type="text" placeholder="Sets" value={exercise.sets} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} />
            <input type="text" placeholder="Rest (e.g., 30s)" value={exercise.rest_duration} onChange={(e) => handleExerciseChange(index, 'rest_duration', e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={addExercise}>Add Exercise</button>
        {clients && (
          <div>
            <label htmlFor="client">Assign to Client:</label>
            <select id="client" value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
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
