import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function WorkoutForm({ existingWorkout, onWorkoutCreatedOrUpdated, token, clients, availableExercises }) {
  const [workoutData, setWorkoutData] = useState({
    title: '',
    description: '',
    exercises: [],
    client_id: '',
  });

  useEffect(() => {
    const fetchWorkoutExercises = async () => {
      if (existingWorkout && existingWorkout.id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/workouts/${existingWorkout.id}/exercises`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const fetchedExercises = response.data.map(exercise => ({
            exercise_id: exercise.exercise_id,
            reps: exercise.reps,
            sets: exercise.sets,
            rest_duration: exercise.rest_duration
          }));
          setWorkoutData({ ...existingWorkout, exercises: fetchedExercises });
        } catch (error) {
          console.error('Error fetching workout exercises', error.response || error);
        }
      }
    };

    fetchWorkoutExercises();
  }, [existingWorkout, token]);

  const handleInputChange = (index, field, value) => {
    const newExercises = [...workoutData.exercises];
    newExercises[index][field] = value;
    setWorkoutData({ ...workoutData, exercises: newExercises });
  };

  const addExercise = () => {
    setWorkoutData({
      ...workoutData,
      exercises: [...workoutData.exercises, { exercise_id: '', reps: '', sets: '', rest_duration: '' }]
    });
  };

  const removeExercise = (index) => {
    const newExercises = [...workoutData.exercises];
    newExercises.splice(index, 1);
    setWorkoutData({ ...workoutData, exercises: newExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workoutEndpoint = existingWorkout?.id ? `http://localhost:5000/api/workouts/${existingWorkout.id}` : 'http://localhost:5000/api/workouts';
    const workoutMethod = existingWorkout?.id ? 'put' : 'post';
  
    try {
      const workoutResponse = await axios({
        method: workoutMethod,
        url: workoutEndpoint,
        data: workoutData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Only attempt to assign a client if a client_id has been selected
      if (workoutData.client_id) {
        // Adjust the keys in the payload to match what the server is expecting
        await axios.post(`http://localhost:5000/api/user_workouts`, {
          client_id: workoutData.client_id, // Use client_id instead of user_id
          workout_id: workoutResponse.data.id // Ensure workoutResponse.data.id is present
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
      }
  
      onWorkoutCreatedOrUpdated(workoutResponse.data);
      toast.success('Workout saved successfully!');
  
      // Reset form if creating a new workout
      if (!existingWorkout) {
        setWorkoutData({
          title: '',
          description: '',
          exercises: [],
          client_id: '',
        });
      }
    } catch (error) {
      console.error('Error submitting workout', error.response || error);
      toast.error('Failed to save workout. Please try again.');
    }
  };

  return (
    <div>
      <h2>{existingWorkout ? 'Edit Workout Plan' : 'Create a New Workout Plan'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input id="title" type="text" value={workoutData.title} onChange={(e) => setWorkoutData({ ...workoutData, title: e.target.value })} />
        <label htmlFor="description">Description:</label>
        <textarea id="description" value={workoutData.description} onChange={(e) => setWorkoutData({ ...workoutData, description: e.target.value })} />
        {workoutData.exercises.map((exercise, index) => (
          <div key={index}>
            <select value={exercise.exercise_id} onChange={(e) => handleInputChange(index, 'exercise_id', e.target.value)}>
              <option value="">Select Exercise</option>
              {availableExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
            <input type="text" placeholder="Reps (e.g., 8-12)" value={exercise.reps} onChange={(e) => handleInputChange(index, 'reps', e.target.value)} />
            <input type="text" placeholder="Sets" value={exercise.sets} onChange={(e) => handleInputChange(index, 'sets', e.target.value)} />
            <input type="text" placeholder="Rest (e.g., 30s)" value={exercise.rest_duration} onChange={(e) => handleInputChange(index, 'rest_duration', e.target.value)} />
            <button type="button" onClick={() => removeExercise(index)}>Remove Exercise</button>
          </div>
        ))}
        <button type="button" onClick={addExercise}>Add Exercise</button>
        <label htmlFor="client">Assign to Client:</label>
        <select id="client" value={workoutData.client_id} onChange={(e) => setWorkoutData({ ...workoutData, client_id: e.target.value })}>
          <option value="">Select a Client</option>
          {clients.filter(client => client.role === 'client').map(client => (
            <option key={client.id} value={client.id}>{client.username}</option>
          ))}
        </select>
        <button type="submit">{existingWorkout ? 'Update' : 'Create'} Workout</button>
      </form>
    </div>
  );
}

export default WorkoutForm;
