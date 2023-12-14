import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('/api/exercises');
        setExercises(response.data);
      } catch (error) {
        console.error('Error fetching exercises', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return (
    <div>
      <h2>Exercise List</h2>
      {isLoading ? (
        <p>Loading exercises...</p>
      ) : (
        <ul>
          {exercises.map(exercise => (
            <li key={exercise.id}>
              <h3>{exercise.name}</h3>
              <p>{exercise.description}</p>
              <p>Body Part: {exercise.body_part}</p>
              <p>Difficulty: {exercise.difficulty}</p>
              {exercise.youtube_url && <a href={exercise.youtube_url} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Exercises;
