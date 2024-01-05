import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; // Ensure this CSS file contains the necessary styles

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="left-nav">
        <Link className="nav-link" to="/dashboard/profile">Profile</Link>
        <Link className="nav-link" to="/dashboard/workout-plans">Workout Plans</Link>
        <Link className="nav-link" to="/dashboard/exercises">Exercises</Link>
        <Link className="nav-link" to="/dashboard/messaging">Messaging</Link>
      </div>
      <div className="center-nav">
        <h1 className="display-4">Flatiron Fit Flow</h1>
      </div>
      <div className="right-nav">
        <span className="welcome-message">Welcome, {user ? user.username : 'Guest'}!</span>
        <button className="inbox-button" onClick={() => navigate('/dashboard/messaging')}>
          Inbox (5) {/* Update with dynamic count */}
        </button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
