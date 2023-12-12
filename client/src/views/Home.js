import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  if (user) {
    navigate('/dashboard');
  }

  return (
    <div className="container">
      <h1>Welcome to FlatironFit</h1>
      {!user && (
        <div className="auth-box">
          <Link to="/login" className="auth-link">Login</Link>
          <Link to="/signup" className="auth-link">Signup</Link>
        </div>
      )}
    </div>
  );
}

export default Home;
