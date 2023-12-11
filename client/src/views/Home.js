import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styling/Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h1>Welcome to FlatironFit</h1>
      {user && <p>Hello, {user.name}!</p>}
    </div>
  );
}

export default Home;
