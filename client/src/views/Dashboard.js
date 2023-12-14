import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import the Link component
import Navbar from './Navbar';
import { Routes, Route, Outlet } from 'react-router-dom';
import WorkoutPlans from '../components/workout/WorkoutPlans'; // Updated import path
import Clients from '../components/workout/WorkoutDetail'; // Placeholder for Clients
import Exercises from '../components/exercise/ExerciseList'; // Placeholder for Exercises
import Messaging from '../components/message/MessageList'; // Updated import path

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/workouts', {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const handleNewWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkoutTitle) return;

    try {
      const response = await axios.post(
        '/api/workouts',
        { title: newWorkoutTitle },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` } }
      );
      if (response.status === 201) {
        setWorkouts([...workouts, response.data]);
        setNewWorkoutTitle('');
      }
    } catch (error) {
      console.error('Error creating a new workout', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {user ? `Welcome, ${user.username}!` : 'Guest'}!</h2>
      <Navbar />
      <div>
        <Link to="/logout">Logout</Link>
      </div>
      <Routes>
        <Route path="workout-plans" element={<WorkoutPlans />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="clients" element={<Clients />} />
        <Route path="messaging" element={<Messaging />} />
        <Route index element={<Outlet />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
