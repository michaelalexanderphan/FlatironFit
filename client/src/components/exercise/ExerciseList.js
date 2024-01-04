import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext); // Assuming you have user information in your context

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      console.log('Token Status:', token);
      const response = await axios.get('/api/exercises', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Exercise List Response:', response);
      setExercises(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError('Failed to fetch exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExercise = (exerciseId) => {
    axios
      .delete(`/api/exercises/${exerciseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchExercises();
      })
      .catch((error) => {
        console.error('Error deleting exercise', error);
      });
  };

  return (
    <div>
      <h2>Exercise List</h2>
      {isLoading ? (
        <p>Loading exercises...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <h3>{exercise.name}</h3>
              <p>{exercise.description}</p>
              <p>Body Part: {exercise.body_part}</p>
              <p>Difficulty: {exercise.difficulty}</p>
              {exercise.youtube_url && (
                <a href={exercise.youtube_url} target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                </a>
              )}

              {/* Conditionally render the delete button based on user's role */}
              {user && user.role === 'trainer' && (
                <button onClick={() => deleteExercise(exercise.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExerciseList;
