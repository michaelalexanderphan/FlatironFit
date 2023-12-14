import React, { useState } from 'react';

function WorkoutForm() {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    console.log(title);
  };

  return (
    <div>
      <h2>Create a New Workout Plan</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Create Workout</button>
      </form>
    </div>
  );
}

export default WorkoutForm;
