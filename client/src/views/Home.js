import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
