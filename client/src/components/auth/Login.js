import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

function Login({ history }) {
  const { login } = useContext(AuthContext);
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
        login(response.data.user, response.data.access_token);
        history.push('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Login failed. Please try again later.');
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: 'auto',
  };

  const inputStyle = {
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
  };

  const buttonStyle = {
    padding: '10px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    cursor: isLoading ? 'default' : 'pointer',
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '10px',
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        {error && <p style={errorStyle}>{error}</p>}
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            style={inputStyle}
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
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={isLoading} style={buttonStyle}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

export default Login;
