import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; // Make sure to import the CSS file

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link className="nav-link" to="/dashboard/profile">Profile</Link>
        <Link className="nav-link" to="/dashboard/workout-plans">Workout Plans</Link>
        <Link className="nav-link" to="/dashboard/exercises">Exercises</Link>
        <Link className="nav-link" to="/dashboard/messaging">Messaging</Link>
      </div>
      {user && (
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}

export default Navbar;
