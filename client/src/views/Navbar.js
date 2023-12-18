import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <Link to="/dashboard/profile">Profile</Link>
      <Link to="/dashboard/workout-plans">Workout Plans</Link>
      <Link to="/dashboard/exercises">Exercises</Link>
      <Link to="/dashboard/messaging">Messaging</Link>
      {user && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}

export default Navbar;
