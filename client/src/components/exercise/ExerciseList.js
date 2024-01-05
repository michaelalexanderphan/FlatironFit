import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ExerciseForm from './ExerciseForm';
import './ExerciseCard.css';


function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext);
  const [editingExerciseId, setEditingExerciseId] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, [token]);

  const fetchExercises = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await axios.get('/api/exercises', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const editExercise = (exerciseId) => {
    setEditingExerciseId(exerciseId);
  };

  const onExerciseSaved = () => {
    setEditingExerciseId(null);
    fetchExercises();
  };

  return (
    <div className="exercise-list-container">
      <h2 className="exercise-list-heading">Exercise List</h2>
      {editingExerciseId ? (
        <ExerciseForm
          exerciseId={editingExerciseId}
          onExerciseSaved={onExerciseSaved}
          token={token}
        />
      ) : (
        <>
          {isLoading ? (
            <p>Loading exercises...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ul>
              {exercises.map((exercise) => (
                <li key={exercise.id} className="exercise-card">
                  <h3 className="exercise-title">{exercise.name}</h3>
                  <p className="exercise-description">{exercise.description}</p>
                  <p className="exercise-detail">Body Part: {exercise.body_part}</p>
                  <p className="exercise-detail">Difficulty: {exercise.difficulty}</p>
                  {exercise.youtube_url && (
                    <a href={exercise.youtube_url} target="_blank" rel="noopener noreferrer" className="exercise-link">
                      Watch on YouTube
                    </a>
                  )}
                  {user && user.role === 'trainer' && (
                    <>
                      <button onClick={() => editExercise(exercise.id)} className="exercise-button">Edit</button>
                      <button onClick={() => deleteExercise(exercise.id)} className="exercise-button">Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
  
}

export default ExerciseList;