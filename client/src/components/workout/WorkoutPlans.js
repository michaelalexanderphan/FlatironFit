import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

function WorkoutPlans() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [clients, setClients] = useState([]);
  const [assignedClientId, setAssignedClientId] = useState('');
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    console.log(user)
    const fetchResources = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const workoutsRes = await axios.get('/api/workouts', { headers });
        setWorkouts(workoutsRes.data);
        if (user.role === 'trainer') {
          const exercisesRes = await axios.get('/api/exercises', { headers });
          const clientsRes = await axios.get('/api/users/clients', { headers });
          setExercises(exercisesRes.data);
          setClients(clientsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchResources();
  }, [token, user.role]);

  const handleCreateWorkout = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        '/api/workouts',
        { title: workoutTitle, description: workoutDescription, exercises: selectedExercises },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkouts([...workouts, response.data]);
      setWorkoutTitle('');
      setWorkoutDescription('');
      setSelectedExercises([]);
    } catch (error) {
      console.error('Error creating workout', error);
    }
  };

  const handleEditWorkout = async (workoutId) => {
    try {
      const response = await axios.put(
        `/api/workouts/${workoutId}`,
        { title: workoutTitle, description: workoutDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkouts(workouts.map(workout => workout.id === workoutId ? response.data : workout));
    } catch (error) {
      console.error('Error updating workout', error);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await axios.delete(`/api/workouts/${workoutId}`, { headers: { Authorization: `Bearer ${token}` } });
      setWorkouts(workouts.filter(workout => workout.id !== workoutId));
    } catch (error) {
      console.error('Error deleting workout', error);
    }
  };

  const handleAssignWorkout = async (workoutId) => {
    try {
      await axios.post(
        `/api/workouts/${workoutId}/assign`,
        { clientId: assignedClientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignedClientId('');
    } catch (error) {
      console.error('Error assigning workout', error);
    }
  };

  return (
    <div>
      {user.role === 'trainer' && (
        <>
          <form onSubmit={handleCreateWorkout}>
            <input
              value={workoutTitle}
              onChange={e => setWorkoutTitle(e.target.value)}
              placeholder="Workout Plan Title"
              required
            />
            <textarea
              value={workoutDescription}
              onChange={e => setWorkoutDescription(e.target.value)}
              placeholder="Workout Plan Description"
              required
            />
            <button type="submit">Create Workout Plan</button>
          </form>
          {exercises.map(exercise => (
            <div key={exercise.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedExercises.includes(exercise.id)}
                  onChange={e => {
                    setSelectedExercises(
                      e.target.checked
                        ? [...selectedExercises, exercise.id]
                        : selectedExercises.filter(id => id !== exercise.id)
                    );
                  }}
                />
                {exercise.name}
              </label>
            </div>
          ))}
          {workouts.map(workout => (
            <div key={workout.id}>
              <h3>{workout.title}</h3>
              <p>{workout.description}</p>
              <button onClick={() => setEditingWorkoutId(workout.id)}>Edit</button>
              <button onClick={() => handleDeleteWorkout(workout.id)}>Delete</button>
              <select onChange={e => setAssignedClientId(e.target.value)}>
                <option value="">Assign to Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.username}</option>
                ))}
              </select>
              <button onClick={() => handleAssignWorkout(workout.id)}>Assign</button>
            </div>
          ))}
        </>
      )}
      {user.role === 'client' && (
        <div>
          {workouts.map(workout => (
            <div key={workout.id}>
              <h3>{workout.title}</h3>
              <p>{workout.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutPlans;
