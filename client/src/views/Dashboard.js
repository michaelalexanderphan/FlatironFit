import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import WorkoutPlans from '../components/workout/WorkoutPlans';
import WorkoutDetail from '../components/workout/WorkoutDetail';
import Exercises from '../components/exercise/ExerciseList';
import Messaging from '../components/message/MessageList';
import MessageForm from '../components/message/MessageForm';
import UserProfile from '../components/user/UserProfile';
import UserProfileEdit from '../components/user/UserProfileEdit';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem('authToken');

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {user ? user.username : 'Guest'}!</h2>
      <Navbar />
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<UserProfile />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="profile/edit" element={<UserProfileEdit />} />
          {user && user.role === 'trainer' && (
            <Route path="workout-plans/create" element={<WorkoutPlans />} />
          )}
          {user && user.role !== 'trainer' && (
            <Route path="workout-plans" element={<WorkoutPlans />} />
          )}
          <Route path="workout-detail/:workoutId" element={<WorkoutDetail />} />
          <Route path="exercises" element={<Exercises />} />
          <Route
            path="messaging"
            element={
              <>
                <MessageForm currentUserId={user?.id} authToken={authToken} role={user?.role} />
                <Messaging currentUserId={user?.id} authToken={authToken} />
              </>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default Dashboard;
