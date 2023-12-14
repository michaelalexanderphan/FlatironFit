import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/dashboard/profile">Profile</Link>
      <Link to="/dashboard/workout-plans">Workout Plans</Link>
      <Link to="/dashboard/exercises">Exercises</Link>
      <Link to="/dashboard/clients">Clients</Link>
      <Link to="/dashboard/messaging">Messaging</Link>
      <Link to="/dashboard/calendar">Calendar</Link>
    </nav>
  );
}

export default Navbar;
