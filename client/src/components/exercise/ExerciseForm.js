import React, { useState } from 'react';
import axios from 'axios';

function ExerciseForm({ exerciseId, onExerciseSaved }) {
  const [exercise, setExercise] = useState({
    name: '',
    description: '',
    body_part: '',
    difficulty: '',
    youtube_url: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setExercise({ ...exercise, [e.target.name]: e.target.value });
  };

  const validateYouTubeUrl = (url) => {
    const regExp = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regExp.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (exercise.youtube_url && !validateYouTubeUrl(exercise.youtube_url)) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    try {
      let response;
      if (exerciseId) {
        response = await axios.put(`/api/exercises/${exerciseId}`, exercise);
      } else {
        response = await axios.post('/api/exercises', exercise);
      }

      if (response.status === 200 || response.status === 201) {
        onExerciseSaved(response.data);
        setExercise({
          name: '',
          description: '',
          body_part: '',
          difficulty: '',
          youtube_url: ''
        });
      }
    } catch (error) {
      setError('Error saving exercise. Please try again.');
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
