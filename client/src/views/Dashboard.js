import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import WorkoutPlans from '../components/workout/WorkoutPlans';
import Clients from '../components/workout/WorkoutDetail';
import Exercises from '../components/exercise/ExerciseList';
import Messaging from '../components/message/MessageList';
import MessageForm from '../components/message/MessageForm';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem('authToken');

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  useEffect(() => {
    if (user && authToken) {
      setIsLoading(true);
      setError('');
      axios.get('/api/workouts/workouts', {
        headers: { Authorization: `Bearer ${authToken}` },
      }).then(response => {
        setWorkouts(response.data);
      }).catch(error => {
        setError('Failed to fetch workouts');
        console.error('Error fetching workouts', error);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user, authToken]);

  const handleNewWorkout = async (e) => {
    e.preventDefault();
    if (newWorkoutTitle) {
      axios.post(
        '/api/workouts',
        { title: newWorkoutTitle },
        { headers: { Authorization: `Bearer ${authToken}` } }
      ).then(response => {
        if (response.status === 201) {
          setWorkouts([...workouts, response.data]);
          setNewWorkoutTitle('');
        }
      }).catch(error => {
        console.error('Error creating a new workout', error);
      });
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {user ? user.username : 'Guest'}!</h2>
      <Navbar />
      <div>
        <Link to="/dashboard/logout">Logout</Link>
      </div>
      <Routes>
        <Route path="workout-plans" element={<WorkoutPlans />} />
        <Route
          path="messaging"
          element={
            <>
              <MessageForm currentUserId={user?.id} authToken={authToken} role={user?.role} />
              <Messaging currentUserId={user?.id} authToken={authToken} />
            </>
          }
        />
        <Route index element={<Outlet />} />
      </Routes>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Dashboard;
