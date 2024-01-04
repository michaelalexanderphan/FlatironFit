import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { validateYouTubeUrl } from '../utils/validations';

function ExerciseForm({ exerciseId, onExerciseSaved, token }) {
  const [exercise, setExercise] = useState({
    name: '',
    description: '',
    body_part: '',
    difficulty: '',
    youtube_url: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (exerciseId && token) {
      axios.get(`/api/exercises/${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setExercise(response.data); 
      })
      .catch(error => {
        console.error('Error fetching exercise details', error);
      });
    }
  }, [exerciseId, token]);

  const handleChange = (e) => {
    setExercise({ ...exercise, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!exercise.name || !exercise.difficulty || (exercise.youtube_url && !validateYouTubeUrl(exercise.youtube_url))) {
      setError('Please fill all required fields and enter a valid YouTube URL.');
      return;
    }
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      }
    };
  
    const { id, ...exerciseData } = exercise;
  
    try {
      let response;
      if (exerciseId) {
        response = await axios.put(`/api/exercises/${exerciseId}`, exerciseData, config);
      } else {
        response = await axios.post('/api/exercises', exerciseData, config);
      }
      onExerciseSaved(response.data);
    } catch (error) {
      setError('Error saving exercise. Please try again.');
      console.error('Error submitting exercise:', error);
    }
  };

  return (
    <div>
      <h2>{exerciseId ? 'Edit Exercise' : 'Create Exercise'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={exercise.name}
          onChange={handleChange}
          placeholder="Exercise Name"
          required
        />
        <textarea
          name="description"
          value={exercise.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          name="body_part"
          value={exercise.body_part}
          onChange={handleChange}
          placeholder="Body Part"
        />
        <input
          name="difficulty"
          value={exercise.difficulty}
          onChange={handleChange}
          placeholder="Difficulty"
        />
        <input
          name="youtube_url"
          value={exercise.youtube_url}
          onChange={handleChange}
          placeholder="YouTube URL"
        />
        <button type="submit">{exerciseId ? 'Save Changes' : 'Create Exercise'}</button>
      </form>
    </div>
  );
}

export default ExerciseForm;
