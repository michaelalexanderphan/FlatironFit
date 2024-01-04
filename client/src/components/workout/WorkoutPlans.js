import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import WorkoutForm from './WorkoutForm';
import * as XLSX from 'xlsx';

function WorkoutPlans() {
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const { user, token } = useContext(AuthContext);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedWorkoutDetails, setSelectedWorkoutDetails] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (token) {
      if (user?.role === 'trainer') {
        fetchClients();
        fetchTrainerWorkouts();
      } else {
        fetchClientWorkouts();
      }
      fetchAvailableExercises();
    }
  }, [user, token]);

  const fetchTrainerWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts', error.response || error);
    }
  };

  const fetchClientWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user_workouts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching assigned workouts', error.response || error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients', error.response || error);
    }
  };

  const fetchAvailableExercises = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exercises', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises', error.response || error);
    }
  };

  const handleWorkoutCreatedOrUpdated = workout => {
    setEditingWorkout(null);
    fetchTrainerWorkouts();
  };

  const handleWorkoutClick = async (workout) => {
    const workoutId = workout.id || workout.workout_id;
    try {
      const exercisesResponse = await axios.get(`http://localhost:5000/api/workouts/${workoutId}/exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedWorkoutDetails({ ...workout, exercises: exercisesResponse.data || [] });
    } catch (error) {
      console.error('Error fetching workout details', error.response || error);
    }
  };

  const handleEditClick = workout => {
    setEditingWorkout(workout);
    setSelectedWorkoutDetails(null);
  };

  const handleDelete = async workoutId => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrainerWorkouts();
    } catch (error) {
      console.error('Error deleting workout', error.response || error);
    }
  };

  const createGoogleCalendarEventUrl = (workout) => {
    const title = encodeURIComponent(workout.title);
    const description = encodeURIComponent(workout.description);
    const startTime = convertToGoogleCalendarDateTime(new Date()); // Replace with actual workout start time
    const endTime = convertToGoogleCalendarDateTime(new Date()); // Replace with actual workout end time
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${description}`;
    return calendarUrl;
  };

  const convertToGoogleCalendarDateTime = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, -1) + "Z";
  };

  const handleExportToExcel = (workoutDetails) => {
    const workoutDataForExcel = workoutDetails.exercises.map(exercise => ({
      'Exercise Name': exercise.name,
      'Reps': exercise.reps,
      'Sets': exercise.sets,
      'Rest (seconds)': exercise.rest_duration
    }));

    const worksheet = XLSX.utils.json_to_sheet(workoutDataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Workout Details");
    const fileName = `${workoutDetails.title.replace(/\s+/g, '_')}_Workout_Plan.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleAddToCalendar = (workout) => {
    const calendarUrl = createGoogleCalendarEventUrl(workout);
    window.open(calendarUrl, '_blank');
  };

  return (
    <div>
      {user && user.role === 'trainer' && (
        <button onClick={() => setEditingWorkout({})}>Create Workout Plan</button>
      )}
      {editingWorkout ? (
        <WorkoutForm
          existingWorkout={editingWorkout}
          onWorkoutCreatedOrUpdated={handleWorkoutCreatedOrUpdated}
          token={token}
          clients={clients}
          availableExercises={availableExercises}
        />
      ) : (
        <div>
          {userWorkouts.map((workout) => (
            <div key={workout.id}>
              <h3>{workout.title}</h3>
              <p>{workout.description}</p>
              <button onClick={() => handleWorkoutClick(workout)}>
                Show Workout Details
              </button>
              {selectedWorkoutDetails && selectedWorkoutDetails.id === workout.id && (
                <div>
                  <ul>
                    {selectedWorkoutDetails.exercises.map((exercise) => (
                      <li key={exercise.id}>
                        {exercise.name} - Reps: {exercise.reps} Sets: {exercise.sets} Rest: {exercise.rest_duration} seconds
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleEditClick(workout)}>Edit</button>
                  <button onClick={() => handleDelete(workout.id)}>Delete</button>
                  <button onClick={() => handleExportToExcel(selectedWorkoutDetails)}>Export to Excel</button>
                  <button onClick={() => handleAddToCalendar(workout)}>Add to Google Calendar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default WorkoutPlans;