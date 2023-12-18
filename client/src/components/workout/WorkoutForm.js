import React, { useState } from 'react';
import axios from 'axios';

function WorkoutForm() {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/workouts', { title })
      .then(response => {
        console.log('Workout created:', response.data);
        setTitle('');
      })
      .catch(error => {
        console.error('Error creating workout:', error);
      });
  };

  return (
    <div>
      <h2>Create a New Workout Plan</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit">Create Workout</button>
      </form>
    </div>
  );
}

export default WorkoutForm;
