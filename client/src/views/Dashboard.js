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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/workouts/workouts', {  // Adjusted URL
          headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` },
        });
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    console.log('User:', user); // Log the user object
  
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

  const authToken = sessionStorage.getItem('authToken');

  if (!authToken) {
    navigate('/login');
  }

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
        {/* <Route path="exercises" element={<Exercises />} />
        <Route path="clients" element={<Clients />} /> */}
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
    </div>
  );
}

export default Dashboard;
