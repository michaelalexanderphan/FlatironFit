import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

function ExerciseList() {
  const { authToken } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  const axiosWithAuth = () => {
    return axios.create({
      baseURL: '/api',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  };

  const fetchExercises = async () => {
    try {
      const response = await axiosWithAuth().get('/exercises/exercises');
      setExercises(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExercise = (exerciseId) => {
    axiosWithAuth()
      .delete(`/exercises/exercises/${exerciseId}`)
      .then(() => {
        fetchExercises();
      })
      .catch(error => {
        console.error('Error deleting exercise', error);
      });
  };

  return (
    <div>
      <h2>Exercise List</h2>
      {isLoading ? <p>Loading exercises...</p> : error ? <p>{error}</p> : (
        <ul>
          {exercises.map(exercise => (
            <li key={exercise.id}>
              <h3>{exercise.name}</h3>
              <p>{exercise.description}</p>
              <p>Body Part: {exercise.body_part}</p>
              <p>Difficulty: {exercise.difficulty}</p>
              {exercise.youtube_url && (
                <a href={exercise.youtube_url} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
              )}
              <button onClick={() => deleteExercise(exercise.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExerciseList;
