import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styling/Home.css';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="home-container">
      <div className="content">
      <h1 className="welcome-heading">Welcome to Flatiron FitFlow</h1>
      <div className="info-box" style={{ backgroundColor: '#ee8787' }}>          <h3>Stay Engaged with Personalized Workout Plans</h3>
          <p>Our platform empowers trainers to create and assign tailored workout plans to their clients. Keep track of your fitness journey, communicate with your trainer, and manage your workout calendar all in one place. Our features are designed to help you stay committed and reach your fitness goals with ease.</p>
          <button className="learn-more-button">Discover More</button>
        </div>
        {!user && (
          <div className="auth-box">
            <Link to="/login" className="auth-link login-btn">Login</Link>
            <Link to="/signup" className="auth-link signup-btn">Signup</Link>
          </div>
        )}
      </div>
      <div className="logo-container">
      <img src="/flatironfitflow.PNG" alt="Flatiron FitFlow Logo" />
      </div>
    </div>
  );
}

export default Home;
