import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

function WorkoutPlans() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState(new Set());
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [clients, setClients] = useState([]);
  const [assignedClientId, setAssignedClientId] = useState('');
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (user.role === 'trainer') {
      fetchResources();
    }
  }, [user.role]);

  async function fetchResources() {
    setIsLoading(true);
    const [exercisesResponse, workoutsResponse, clientsResponse] = await Promise.all([
      axios.get('/api/exercises', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/workouts', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/users/clients', { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setExercises(exercisesResponse.data);
    setWorkouts(workoutsResponse.data);
    setClients(clientsResponse.data);
    setIsLoading(false);
  }

  async function handleCreateWorkout() {
    const response = await axios.post('/api/workouts', {
      title: workoutTitle,
      description: workoutDescription,
      exercises: Array.from(selectedExercises),
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWorkouts([...workouts, response.data]);
    setWorkoutTitle('');
    setWorkoutDescription('');
    setSelectedExercises(new Set());
  }

  async function handleEditWorkout() {
    const response = await axios.put(`/api/workouts/${editingWorkout.id}`, {
      title: workoutTitle,
      description: workoutDescription,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWorkouts(workouts.map(workout => workout.id === editingWorkout.id ? response.data : workout));
    setEditingWorkout(null);
  }

  async function handleDeleteWorkout(workoutId) {
    await axios.delete(`/api/workouts/${workoutId}`, { headers: { Authorization: `Bearer ${token}` } });
    setWorkouts(workouts.filter(workout => workout.id !== workoutId));
  }

  async function handleAssignWorkout(workoutId) {
    await axios.post(`/api/workouts/${workoutId}/assign`, { clientId: assignedClientId }, { headers: { Authorization: `Bearer ${token}` } });
    setAssignedClientId('');
  }

  function handleSelectExercise(exerciseId) {
    const updatedSelectedExercises = new Set(selectedExercises);
    updatedSelectedExercises.has(exerciseId) ? updatedSelectedExercises.delete(exerciseId) : updatedSelectedExercises.add(exerciseId);
    setSelectedExercises(new Set(updatedSelectedExercises));
  }

  function startEdit(workout) {
    setEditingWorkout(workout);
    setWorkoutTitle(workout.title);
    setWorkoutDescription(workout.description);
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (user.role !== 'trainer') return <p>You do not have permission to view this page.</p>;

  return (
    <div>
      <h2>Create a New Workout Plan</h2>
      <input type="text" value={workoutTitle} onChange={(e) => setWorkoutTitle(e.target.value)} placeholder="Workout Plan Title" />
      <textarea value={workoutDescription} onChange={(e) => setWorkoutDescription(e.target.value)} placeholder="Workout Plan Description" />
      <h3>Select Exercises for the Workout Plan</h3>
      {exercises.map(exercise => (
        <div key={exercise.id}>
          <label>
            <input type="checkbox" checked={selectedExercises.has(exercise.id)} onChange={() => handleSelectExercise(exercise.id)} />
            {exercise.name}
          </label>
        </div>
      ))}
      <button onClick={handleCreateWorkout}>Save Workout Plan</button>

      <h2>Existing Workout Plans</h2>
      {workouts.map(workout => (
        <div key={workout.id}>
          {editingWorkout === workout ? (
            <>
              <input type="text" value={workoutTitle} onChange={(e) => setWorkoutTitle(e.target.value)} />
              <textarea value={workoutDescription} onChange={(e) => setWorkoutDescription(e.target.value)} />
              <button onClick={handleEditWorkout}>Save Changes</button>
            </>
          ) : (
            <>
              <h3>{workout.title}</h3>
              <p>{workout.description}</p>
              <button onClick={() => startEdit(workout)}>Edit</button>
              <button onClick={() => handleDeleteWorkout(workout.id)}>Delete</button>
              <select onChange={(e) => setAssignedClientId(e.target.value)}>
                <option value="">Assign to Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.username}</option>
                ))}
              </select>
              <button onClick={() => handleAssignWorkout(workout.id)}>Assign</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default WorkoutPlans;
