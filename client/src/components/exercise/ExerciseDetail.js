import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExerciseDetail({ exerciseId }) {
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState({
    name: '',
    description: '',
    body_part: '',
    difficulty: '',
    youtube_url: ''
  });

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await axios.get(`/dashboard/exercises/${exerciseId}`);
        setExercise(response.data);
        setEditedExercise(response.data);
      } catch (error) {
        console.error('Error fetching exercise', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  const handleEditChange = (e) => {
    setEditedExercise({ ...editedExercise, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(`/dashboard/exercises/${exerciseId}`, editedExercise);
      setExercise(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating exercise', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!exercise) return <div>Exercise not found.</div>;

  return (
    <div>
      <h2>Exercise Details</h2>
      {isEditing ? (
        <div>
          <input
            name="name"
            value={editedExercise.name}
            onChange={handleEditChange}
          />
          <textarea
            name="description"
            value={editedExercise.description}
            onChange={handleEditChange}
          />
          <input
            name="body_part"
            value={editedExercise.body_part}
            onChange={handleEditChange}
          />
          <input
            name="difficulty"
            value={editedExercise.difficulty}
            onChange={handleEditChange}
          />
          <input
            name="youtube_url"
            value={editedExercise.youtube_url}
            onChange={handleEditChange}
          />
          <button onClick={saveEdit}>Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {exercise.name}</p>
          <p><strong>Description:</strong> {exercise.description}</p>
          <p><strong>Body Part:</strong> {exercise.body_part}</p>
          <p><strong>Difficulty:</strong> {exercise.difficulty}</p>
          {exercise.youtube_url && (
            <p><strong>YouTube URL:</strong> <a href={exercise.youtube_url} target="_blank" rel="noopener noreferrer">{exercise.youtube_url}</a></p>
          )}
          <button onClick={() => setIsEditing(true)}>Edit Exercise</button>
        </div>
      )}
    </div>
  );
}

export default ExerciseDetail;
