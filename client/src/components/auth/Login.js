import React, { useState } from 'react';
import axios from 'axios'; 

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      setError('');
      const response = await axios.post('/api/auth/login', { username, password });
      setIsLoading(false);

      if (response.data.access_token) {
        onLoginSuccess(response.data.access_token); 
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Login failed. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {error && <p className="error">{error}</p>}
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

export default Login;
