import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/workout-plans">Workout Plans</Link>
      <Link to="/exercises">Exercises</Link>
      <Link to="/clients">Clients</Link>
      <Link to="/messaging">Messaging</Link>
    </nav>
  );
}

export default Navbar;
