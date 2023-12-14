import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ExerciseEditForm() {
  const [exercise, setExercise] = useState({
    name: '',
    description: '',
    body_part: '',
    difficulty: '',
    youtube_url: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { exerciseId } = useParams(); // Assuming you're using react-router-dom

  useEffect(() => {
    axios.get(`/api/exercises/${exerciseId}`)
      .then(response => {
        setExercise(response.data);
      })
      .catch(error => {
        console.error('Error fetching exercise details', error);
      });
  }, [exerciseId]);

  const handleChange = (e) => {
    setExercise({ ...exercise, [e.target.name]: e.target.value });
  };

  const validateYouTubeUrl = (url) => {
    const regExp = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regExp.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (exercise.youtube_url && !validateYouTubeUrl(exercise.youtube_url)) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    axios.put(`/api/exercises/${exerciseId}`, exercise)
      .then(response => {
        navigate('/dashboard/exercises'); 
      })
      .catch(error => {
        setError('Error updating exercise. Please try again.');
      });
  };

  return (
    <div>
      <h2>Edit Exercise</h2>
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default ExerciseEditForm;
