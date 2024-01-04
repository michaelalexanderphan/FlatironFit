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
  const [showDetails, setShowDetails] = useState({}); // State to track whether to show details for each workout

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
    const response = await axios.get('http://localhost:5000/api/workouts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserWorkouts(response.data);
  };

  const fetchClientWorkouts = async () => {
    const response = await axios.get('http://localhost:5000/api/user_workouts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserWorkouts(response.data);
  };

  const fetchClients = async () => {
    const response = await axios.get('http://localhost:5000/api/clients', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClients(response.data);
  };

  const fetchAvailableExercises = async () => {
    const response = await axios.get('http://localhost:5000/api/exercises', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAvailableExercises(response.data);
  };

  const handleWorkoutCreatedOrUpdated = () => {
    setEditingWorkout(null);
    fetchTrainerWorkouts();
  };

  const handleWorkoutClick = async (workout) => {
    const workoutId = workout.id || workout.workout_id;
    const exercisesResponse = await axios.get(`http://localhost:5000/api/workouts/${workoutId}/exercises`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelectedWorkoutDetails({ ...workout, exercises: exercisesResponse.data || [] });

    // Toggle the showDetails state for this workout
    setShowDetails(prevState => ({
      ...prevState,
      [workoutId]: !prevState[workoutId],
    }));
  };

  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
    setSelectedWorkoutDetails(null);
  };

  const handleDelete = async (workoutId) => {
    await axios.delete(`http://localhost:5000/api/workouts/${workoutId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTrainerWorkouts();
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
    // Assume workoutDetails contains the detailed exercises to be exported
    const workoutDataForExcel = workoutDetails.exercises.map(exercise => ({
      'Exercise Name': exercise.name,
      'Reps': exercise.reps,
      'Sets': exercise.sets,
      'Rest (seconds)': exercise.rest_duration  // Adjust the property names based on your actual state
    }));

    const worksheet = XLSX.utils.json_to_sheet(workoutDataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Workout Details");

    // Replace space with underscore in workout title for filename
    const fileName = `${workoutDetails.title.replace(/\s+/g, '_')}_Workout_Plan.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };


  const handleAddToCalendar = (workout) => {
    const calendarUrl = createGoogleCalendarEventUrl(workout);
    window.open(calendarUrl, '_blank');
  };

  return (
    <div>
      {user && user.role === 'trainer' && <button onClick={() => setEditingWorkout({})}>Create Workout Plan</button>}
      {editingWorkout ? (
        <WorkoutForm
          existingWorkout={editingWorkout}
          onWorkoutCreatedOrUpdated={handleWorkoutCreatedOrUpdated}
          token={token}
          clients={clients}
          availableExercises={availableExercises}
        />
      ) : (
        userWorkouts.map(workout => (
          <div key={workout.id}>
            <h3>{workout.title}</h3>
            <p>{workout.description}</p>
            <button onClick={() => handleWorkoutClick(workout)}>
              {showDetails[workout.id] ? 'Hide Workout Details' : 'Show Workout Details'}
            </button>
            {showDetails[workout.id] && (
              <>
                <ul>
                  {selectedWorkoutDetails.exercises.map(exercise => (
                    <li key={exercise.id}>
                      {exercise.name} - Reps: {exercise.reps} Sets: {exercise.sets} Rest: {exercise.rest} seconds
                    </li>
                  ))}
                </ul>
                {user && user.role === 'trainer' && (
                  <div>
                    <button onClick={() => handleEditClick(workout)}>Edit</button>
                    <button onClick={() => handleDelete(workout.id)}>Delete</button>
                    <button onClick={() => handleAddToCalendar(workout)}>Add to Google Calendar</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default WorkoutPlans;
